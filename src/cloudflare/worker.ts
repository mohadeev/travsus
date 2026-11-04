// Cloudflare Worker entry (wrangler.jsonc "main"). Pages, API routes and
// middleware are served by vinext as usual. This file adds:
// - a per-request scope: on Workers a database connection can't be shared
//   between requests, so src/lib/db.ts keeps its connections in this scope;
// - the daily jobs that Vercel Cron ran from vercel.json, as Cloudflare Cron
//   Triggers (wrangler.jsonc "triggers"). Each calls the same API route with the
//   same "Authorization: Bearer <CRON_SECRET>" header Vercel sent;
// - caching for public pages (see servePage below).
import { AsyncLocalStorage } from 'node:async_hooks'
import vinext from 'vinext/server/fetch-handler'

const requestScope = new AsyncLocalStorage<Record<string, unknown>>()
;(globalThis as { __travsusRequestScope?: typeof requestScope }).__travsusRequestScope = requestScope

const JOBS: Record<string, string> = {
	'0 6 * * *': '/api/cron/charge-balances',
	'0 9 * * *': '/api/cron/invite-reminders',
}

type Env = {
	CRON_SECRET?: string
	NEXT_PUBLIC_SITE_URL?: string
	/** This deploy's id (wrangler.jsonc "version_metadata") */
	CF_VERSION_METADATA?: { id: string }
}

/** Public, cached pages: kept by Cloudflare's edge for an hour, served stale for a day while refreshed. */
// (Cloudflare's cache keeps the edge copy for s-maxage; browsers don't keep it)
const PUBLIC_CACHE_CONTROL = 'public, s-maxage=3600, stale-while-revalidate=86400'

/**
 * Ad and campaign click ids (?gclid=…, ?utm_source=…). The page never reads
 * them (analytics and Google tags read the address in the browser), but any
 * query string makes vinext render the page again instead of using the cache,
 * so every ad click cost a full render. They are dropped before rendering;
 * the address in the browser keeps them. Affiliate ?ref= links are untouched.
 */
const TRACKING_PARAM = /^(utm_[a-z_]+|gclid|gbraid|wbraid|gclsrc|dclid|fbclid|msclkid|ttclid|twclid|li_fat_id|mc_cid|mc_eid|_gl|_ga|yclid)$/i

function withoutTrackingParams(request: Request): Request {
	const url = new URL(request.url)
	const names = Array.from(url.searchParams.keys()).filter((name) => TRACKING_PARAM.test(name))
	if (!names.length) return request
	for (const name of names) url.searchParams.delete(name)
	return new Request(url, request)
}

/** A full page load (not an API call, a client-side navigation or a form post). */
function isPageLoad(request: Request) {
	const url = new URL(request.url)
	return (
		request.method === 'GET' &&
		!url.pathname.startsWith('/api/') &&
		!url.searchParams.has('_rsc') &&
		!request.headers.has('rsc') &&
		!request.headers.has('authorization')
	)
}

/** The edge cache address of a page: its own address plus the deploy id. */
function edgeCacheUrl(address: string, env: Env) {
	const url = new URL(address)
	url.searchParams.set('__deploy', env.CF_VERSION_METADATA?.id ?? 'dev')
	return url.toString()
}

/**
 * Serves a page through vinext. Pages vinext caches (they come back with
 * `s-maxage`, i.e. the public pages with `revalidate`) get the public
 * Cache-Control header and, for full page loads, a copy in Cloudflare's edge
 * cache (on a custom domain), so the next visitors near that data centre get
 * the HTML without running the page at all. Pages that are per visitor
 * (account, checkout, search…) are never marked public.
 */
async function servePage(request: Request, env: Env, ctx: ExecutionContext) {
	request = withoutTrackingParams(request)
	const edge = isPageLoad(request) ? (caches as unknown as { default: Cache }).default : null
	// Keyed by deploy too: a page from an earlier deploy links to JS and CSS
	// files that no longer exist, so each deploy starts with its own copies
	const edgeKey = new Request(edgeCacheUrl(request.url, env), { method: 'GET' })
	if (edge) {
		const hit = await edge.match(edgeKey)
		if (hit) return hit
	}

	const response = await requestScope.run({}, () => vinext.fetch(request, env as never, ctx))
	const cacheControl = response.headers.get('cache-control') ?? ''
	if (response.status !== 200 || !/\bs-maxage=/.test(cacheControl) || response.headers.has('set-cookie')) return response

	const page = new Response(response.body, response)
	page.headers.set('Cache-Control', PUBLIC_CACHE_CONTROL)
	if (edge) {
		const copy = new Response(page.clone().body, page)
		// The edge copy is the HTML document only: one entry per address
		copy.headers.delete('vary')
		ctx.waitUntil(edge.put(edgeKey, copy).catch(() => {}))
	}
	return page
}

export default {
	...vinext,
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		return servePage(request, env, ctx)
	},
	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
		const path = JOBS[controller.cron]
		if (!path) return console.error(`No job for cron "${controller.cron}"`)
		const origin = env.NEXT_PUBLIC_SITE_URL || 'https://www.travsus.com'
		const request = new Request(new URL(path, origin), {
			headers: { authorization: `Bearer ${env.CRON_SECRET ?? ''}` },
		})
		const response = await requestScope.run({}, () => vinext.fetch(request, env as never, ctx))
		const body = await response.text()
		if (!response.ok) throw new Error(`${path} failed (${response.status}): ${body.slice(0, 500)}`)
		console.log(`${path}: ${body.slice(0, 500)}`)
	},
} satisfies ExportedHandler<Env>
