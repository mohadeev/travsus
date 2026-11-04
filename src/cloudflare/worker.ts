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
	/** Page and data cache (wrangler.jsonc "kv_namespaces") */
	VINEXT_KV_CACHE?: KVNamespace
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

/** Same pages as isPublicPage in src/middleware.ts: the same for every visitor. */
const PUBLIC_PAGES = new Set(['about', 'affiliates', 'agencies', 'blog', 'contact', 'cookie-policy', 'destinations', 'general-conditions', 'group-tours', 'legal-notice', 'privacy-policy'])
const LOCALE = /^[a-z]{2}-[A-Z]{2}$/
const TOUR_ID = /^[0-9a-f]{24}$/

function isPublicPath(pathname: string) {
	const parts = pathname.split('/').filter(Boolean)
	if (!LOCALE.test(parts[0] ?? '')) return false
	if (parts.length === 1) return true // home
	if (parts[1] === 'destinations') return true // destinations, countries, cities
	if (parts.length === 2) return PUBLIC_PAGES.has(parts[1])
	return parts.length === 6 && TOUR_ID.test(parts[5]) // tour page
}

/** Response header that tells whether the edge copy was used (check with curl -I). */
const EDGE_HEADER = 'x-edge-cache'

/**
 * Serves a page through vinext, with a copy in Cloudflare's edge cache (on a
 * custom domain, not on *.workers.dev) so the next visitors near that data
 * centre get the HTML without running the page, the middleware or the database.
 *
 * Kept at the edge for an hour:
 * - pages vinext serves from its cache (they come back with `s-maxage`);
 * - public pages (isPublicPath) on their first render too. vinext sends those
 *   with `no-store` and saves them to KV after the response; when that save
 *   doesn't happen on Cloudflare, every visit used to render the page again
 *   (3–12 s). The edge copy no longer depends on it.
 * Pages for one visitor (account, checkout, search…) are never kept or marked public.
 */
async function servePage(request: Request, env: Env, ctx: ExecutionContext) {
	request = withoutTrackingParams(request)
	const url = new URL(request.url)
	const edge = isPageLoad(request) ? (caches as unknown as { default: Cache }).default : null
	// Keyed by deploy too: a page from an earlier deploy links to JS and CSS
	// files that no longer exist, so each deploy starts with its own copies
	const edgeKey = new Request(edgeCacheUrl(request.url, env), { method: 'GET' })
	if (edge) {
		const hit = await edge.match(edgeKey)
		if (hit) {
			const page = new Response(hit.body, hit)
			page.headers.set(EDGE_HEADER, 'HIT')
			return page
		}
	}

	const response = await requestScope.run({}, () => vinext.fetch(request, env as never, ctx))
	const cacheControl = response.headers.get('cache-control') ?? ''
	const servedFromCache = /\bs-maxage=/.test(cacheControl)
	const firstRender = !url.search && isPublicPath(url.pathname) && response.headers.get('x-nextjs-cache') === 'MISS'
	if (response.status !== 200 || response.headers.has('set-cookie') || !(servedFromCache || (edge && firstRender))) return response

	const page = new Response(response.body, response)
	page.headers.set('Cache-Control', PUBLIC_CACHE_CONTROL)
	if (edge) {
		page.headers.set(EDGE_HEADER, 'MISS')
		const copy = new Response(page.clone().body, page)
		// The edge copy is the HTML document only: one entry per address
		copy.headers.delete('vary')
		copy.headers.delete(EDGE_HEADER)
		ctx.waitUntil(edge.put(edgeKey, copy).catch(() => {}))
	}
	return page
}

/** /api/tours: kept at the edge for a minute (it lists every tour). */
const TOURS_API_SECONDS = 60

async function serveToursApi(request: Request, env: Env, ctx: ExecutionContext) {
	const edge = (caches as unknown as { default: Cache }).default
	const edgeKey = new Request(edgeCacheUrl(request.url, env), { method: 'GET' })
	const hit = await edge.match(edgeKey)
	if (hit) {
		const answer = new Response(hit.body, hit)
		answer.headers.set(EDGE_HEADER, 'HIT')
		return answer
	}
	const response = await requestScope.run({}, () => vinext.fetch(request, env as never, ctx))
	if (response.status !== 200) return response
	const answer = new Response(response.body, response)
	const copy = new Response(answer.clone().body, answer)
	copy.headers.set('Cache-Control', `public, s-maxage=${TOURS_API_SECONDS}`)
	ctx.waitUntil(edge.put(edgeKey, copy).catch(() => {}))
	answer.headers.set(EDGE_HEADER, 'MISS')
	return answer
}

/**
 * GET /__cache-check with "Authorization: Bearer <CRON_SECRET>": writes a
 * test entry to the KV page cache and reads it back, and does the same with
 * the edge cache, so you can see on the live site whether each one works.
 */
async function cacheCheck(request: Request, env: Env) {
	if (!env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${env.CRON_SECRET}`) {
		return new Response('Not found', { status: 404 })
	}
	const result: Record<string, unknown> = { deploy: env.CF_VERSION_METADATA?.id ?? null, kvBinding: !!env.VINEXT_KV_CACHE }
	const value = String(Date.now())
	try {
		await env.VINEXT_KV_CACHE!.put('__cache-check', value, { expirationTtl: 60 })
		result.kvWriteRead = (await env.VINEXT_KV_CACHE!.get('__cache-check')) === value ? 'ok' : 'read back a different value'
	} catch (error) {
		result.kvWriteRead = `failed: ${error instanceof Error ? error.message : String(error)}`
	}
	try {
		const edge = (caches as unknown as { default: Cache }).default
		const key = new Request(new URL('/__cache-check-entry', request.url))
		await edge.put(key, new Response(value, { headers: { 'Cache-Control': 'public, s-maxage=60' } }))
		const hit = await edge.match(key)
		result.edgeWriteRead = hit && (await hit.text()) === value ? 'ok' : 'not stored (normal on *.workers.dev)'
	} catch (error) {
		result.edgeWriteRead = `failed: ${error instanceof Error ? error.message : String(error)}`
	}
	return Response.json(result, { headers: { 'Cache-Control': 'no-store' } })
}

export default {
	...vinext,
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const { pathname } = new URL(request.url)
		if (pathname === '/__cache-check') return cacheCheck(request, env)
		if (pathname === '/api/tours' && request.method === 'GET') return serveToursApi(request, env, ctx)
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
