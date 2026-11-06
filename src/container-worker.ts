// Cloudflare Worker in front of the Next.js app, which runs in a Docker
// container (Cloudflare Containers, wrangler.container.jsonc).
// - Pages that are the same for every visitor (home, tours, destinations,
//   blog list, about...) are kept in Cloudflare's edge cache, so visitors and
//   search engine crawlers get them from the nearest data centre without
//   waking the container (see servePage). An old copy is served while a new
//   one is fetched in the background, so a sleeping container never makes a
//   cached page wait.
// - Everything else is forwarded to the container (one instance,
//   max_instances in wrangler.container.jsonc). While it is starting, visitors
//   get a short "starting up" page that refreshes itself instead of a raw 500.
// - The Worker's variables and secrets (set with `wrangler secret put`) are
//   passed to the container as environment variables, so the app reads them
//   from process.env as on Vercel. Nothing secret is in the repo or the image.
// - The only Cron Trigger keeps the container awake (KEEP_WARM_CRON). The
//   daily jobs are NOT run here: the live Worker already runs them, and running
//   them here too would charge balances twice. JOBS is kept so they can be
//   moved here later.
import { Container, getRandom } from '@cloudflare/containers'

type Env = {
	TRAVSUS_CONTAINER: DurableObjectNamespace<TravsusContainer>
	CRON_SECRET?: string
	NEXT_PUBLIC_SITE_URL?: string
	/** This deploy's id (wrangler.container.jsonc "version_metadata") */
	CF_VERSION_METADATA?: { id: string }
	[name: string]: unknown
}

/**
 * Containers that share the traffic. Must not exceed max_instances in
 * wrangler.container.jsonc (1): a higher number sends requests to instances
 * that cannot start ("Maximum number of running container instances exceeded").
 */
const INSTANCES = 1

/**
 * Pings the container every hour so it never reaches sleepAfter (2h): a
 * crawler or visitor on a page that is not cached yet never waits for a cold
 * start. Remove it from wrangler.container.jsonc to let the container sleep.
 */
const KEEP_WARM_CRON = '23 * * * *'
const KEEP_WARM_PATH = '/robots.txt'

/**
 * The daily jobs, NOT scheduled in wrangler.container.jsonc (the live Worker
 * runs them). Same schedules (UTC) and routes as vercel.json.
 */
const JOBS: Record<string, string> = {
	'0 6 * * *': '/api/cron/charge-balances',
	'0 9 * * *': '/api/cron/invite-reminders',
}

/** The Worker's text variables and secrets, for the container's environment (bindings are left out). */
function containerEnv(env: Env): Record<string, string> {
	const vars: Record<string, string> = {}
	for (const [name, value] of Object.entries(env)) if (typeof value === 'string') vars[name] = value
	return {
		...vars,
		NODE_ENV: 'production',
		PORT: '8080',
		HOSTNAME: '0.0.0.0',
		// The middleware's own API calls go straight to the server, not out
		// through Cloudflare and back (src/middleware.ts)
		INTERNAL_ORIGIN: 'http://127.0.0.1:8080',
	}
}

export class TravsusContainer extends Container<Env> {
	defaultPort = 8080
	// Stops after 2 hours without requests; the next request starts it again
	sleepAfter = '2h'

	constructor(ctx: DurableObjectState<{}>, env: Env) {
		super(ctx, env)
		this.envVars = containerEnv(env)
	}

	override onError(error: unknown) {
		console.error('Container error:', error)
		throw error
	}
}

/**
 * Errors the containers library returns (as text) while the container is
 * starting, waking up, restarting or at its instance limit. The app's own
 * errors are HTML or JSON and pass through unchanged.
 */
const STARTING_ERRORS = [
	'Failed to start container',
	'There is no Container instance available',
	'Container suddenly disconnected',
	'Error proxying request to container',
	'Container did not start',
	'Maximum number of running container instances exceeded',
]

async function isStartingError(response: Response): Promise<boolean> {
	if (![500, 502, 503, 429].includes(response.status)) return false
	const type = response.headers.get('content-type') ?? ''
	if (type && !type.startsWith('text/plain')) return false
	const text = await response.clone().text()
	return STARTING_ERRORS.some((start) => text.includes(start))
}

const RETRY_SECONDS = 5

/** Shown instead of a raw 500 while the container starts; reloads itself. */
function startingResponse(request: Request): Response {
	const headers = {
		'Retry-After': String(RETRY_SECONDS),
		'Cache-Control': 'no-store',
	}
	const wantsHtml = request.method === 'GET' && (request.headers.get('accept') ?? '').includes('text/html')
	if (!wantsHtml) {
		return Response.json(
			{ error: 'starting', message: `The site is starting up. Try again in ${RETRY_SECONDS} seconds.` },
			{ status: 503, headers },
		)
	}
	const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="refresh" content="${RETRY_SECONDS}">
<meta name="robots" content="noindex">
<title>TRAVSUS is starting up</title>
<style>
	body { margin: 0; min-height: 100vh; display: grid; place-items: center; font-family: system-ui, -apple-system, sans-serif; background: #fff; color: #111827; padding: 16px; box-sizing: border-box; text-align: center; }
	.spinner { width: 36px; height: 36px; margin: 0 auto 20px; border: 3px solid #e5e7eb; border-top-color: #111827; border-radius: 50%; animation: spin 0.9s linear infinite; }
	h1 { font-size: 1.25rem; margin: 0 0 8px; }
	p { margin: 0; color: #4b5563; }
	a { color: inherit; }
	@keyframes spin { to { transform: rotate(360deg); } }
	@media (prefers-color-scheme: dark) { body { background: #111827; color: #f9fafb; } p { color: #d1d5db; } .spinner { border-color: #374151; border-top-color: #f9fafb; } }
</style>
</head>
<body>
<main>
	<div class="spinner" aria-hidden="true"></div>
	<h1>TRAVSUS is starting up</h1>
	<p>This takes a few seconds. The page will refresh by itself, or <a href="">refresh now</a>.</p>
</main>
</body>
</html>`
	return new Response(html, { status: 503, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } })
}

/** Forwards a request to the container; a starting container gives the "starting up" page. */
async function fromContainer(request: Request, env: Env): Promise<Response> {
	try {
		const container = await getRandom(env.TRAVSUS_CONTAINER, INSTANCES)
		const response = await container.fetch(request)
		if (await isStartingError(response)) {
			console.warn(`Container not ready (${response.status}) for ${request.method} ${new URL(request.url).pathname}`)
			return startingResponse(request)
		}
		return response
	} catch (error) {
		console.error('Container fetch failed:', error)
		return startingResponse(request)
	}
}

// ---- Edge cache for public pages ----

/** A copy younger than this is served as is; an older one is served while a new one is fetched. */
const FRESH_SECONDS = 60 * 60
/** How long Cloudflare keeps a copy at all (old copies are still better than a cold start). */
const KEEP_SECONDS = 7 * 24 * 60 * 60
/** When the copy was made (ms), on the cached copy only. */
const STORED_AT = 'x-edge-stored-at'
/** Tells whether the edge copy was used: HIT, STALE or MISS (check with curl -I). */
const EDGE_HEADER = 'x-edge-cache'
/** Browsers check with the Worker each time; the edge cache does the caching. */
const BROWSER_CACHE_CONTROL = 'public, max-age=0, must-revalidate'

/**
 * Ad and campaign click ids (?gclid=…, ?utm_source=…). The page never reads
 * them (analytics and Google tags read the address in the browser), so they
 * are dropped before rendering and caching; the address in the browser keeps
 * them. Affiliate ?ref= links are untouched (and not cached).
 */
const TRACKING_PARAM = /^(utm_[a-z_]+|gclid|gbraid|wbraid|gclsrc|dclid|fbclid|msclkid|ttclid|twclid|li_fat_id|mc_cid|mc_eid|_gl|_ga|yclid)$/i

function withoutTrackingParams(request: Request): Request {
	const url = new URL(request.url)
	const names = Array.from(url.searchParams.keys()).filter((name) => TRACKING_PARAM.test(name))
	if (!names.length) return request
	for (const name of names) url.searchParams.delete(name)
	return new Request(url, request)
}

/**
 * Pages that are the same for every visitor (nothing per visitor is read on
 * the server: no cookies(), headers() or auth()). Account, booking, checkout
 * and search pages are never cached.
 */
// Keep in step with isPublicPage in src/middleware.ts (those pages skip Clerk)
const PUBLIC_PAGES = new Set(['about', 'affiliates', 'agencies', 'blog', 'contact', 'cookie-policy', 'destinations', 'general-conditions', 'group-tours', 'legal-notice', 'privacy-policy', 'search'])
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

/** A full page load of a public page with no query string (not an API call, a client-side navigation or a form post). */
function isCacheablePageLoad(request: Request) {
	const url = new URL(request.url)
	return (
		request.method === 'GET' &&
		!url.search &&
		isPublicPath(url.pathname) &&
		!request.headers.has('rsc') &&
		!request.headers.has('next-router-prefetch') &&
		!request.headers.has('authorization')
	)
}

/** The edge cache address of a page: its own address plus the deploy id. */
function edgeKey(request: Request, env: Env) {
	const url = new URL(request.url)
	// Keyed by deploy: a page from an earlier deploy links to JS and CSS files
	// that no longer exist, so each deploy starts with its own copies
	url.searchParams.set('__deploy', env.CF_VERSION_METADATA?.id ?? 'dev')
	return new Request(url.toString(), { method: 'GET' })
}

/**
 * Cookies a page may set and still be cached: only next-intl's language
 * cookie, which it sets when the browser's language differs from the page's
 * (crawlers often do). The cached copy is stored without it.
 */
const CACHEABLE_COOKIE = /^NEXT_LOCALE=/

function canStore(response: Response) {
	if (response.status !== 200) return false
	if (!(response.headers.get('content-type') ?? '').startsWith('text/html')) return false
	return response.headers.getSetCookie().every((cookie) => CACHEABLE_COOKIE.test(cookie))
}

/** Saves a copy of a page in the edge cache (without cookies). */
function store(response: Response, key: Request, ctx: ExecutionContext) {
	const copy = new Response(response.clone().body, response)
	copy.headers.delete('set-cookie')
	copy.headers.delete('vary') // one entry per address: the HTML document
	copy.headers.delete(EDGE_HEADER)
	copy.headers.set('Cache-Control', `public, s-maxage=${KEEP_SECONDS}`)
	copy.headers.set(STORED_AT, String(Date.now()))
	ctx.waitUntil(caches.default.put(key, copy).catch((error) => console.error('Edge cache put failed:', error)))
}

/** The cached copy as an answer for the visitor. */
function fromEdge(hit: Response, state: 'HIT' | 'STALE') {
	const page = new Response(hit.body, hit)
	page.headers.delete(STORED_AT)
	page.headers.set('Cache-Control', BROWSER_CACHE_CONTROL)
	page.headers.set(EDGE_HEADER, state)
	return page
}

/** Pages being refreshed in the background by this Worker instance (one refresh per page at a time). */
const refreshing = new Set<string>()

/** Fetches a new copy of a page for the edge cache, as an anonymous visitor. */
async function refresh(request: Request, key: Request, env: Env, ctx: ExecutionContext) {
	if (refreshing.has(key.url)) return
	refreshing.add(key.url)
	try {
		const headers = new Headers(request.headers)
		headers.delete('cookie')
		const response = await fromContainer(new Request(request.url, { method: 'GET', headers }), env)
		if (canStore(response)) store(response, key, ctx)
		else console.warn(`Edge refresh of ${new URL(request.url).pathname} not stored (${response.status})`)
	} catch (error) {
		console.error('Edge refresh failed:', error)
	} finally {
		refreshing.delete(key.url)
	}
}

/**
 * Public pages through the edge cache (on the custom domain; *.workers.dev
 * has no cache, so everything goes to the container there).
 * - fresh copy (< FRESH_SECONDS): served, the container is not called;
 * - older copy: served at once, and a new one is fetched in the background
 *   (stale-while-revalidate), so even a sleeping container costs no wait;
 * - no copy: the container renders the page and a copy is saved.
 * A page that sets cookies other than the language cookie is never stored,
 * and the stored copy is always fetched as a visitor without cookies.
 * After a deploy every page starts with no copy (keyed by deploy id); run
 * `npm run warm:cache` to fill the cache.
 */
async function servePage(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	const key = edgeKey(request, env)
	const hit = await caches.default.match(key)
	if (hit) {
		const storedAt = Number(hit.headers.get(STORED_AT)) || 0
		if (Date.now() - storedAt < FRESH_SECONDS * 1000) return fromEdge(hit, 'HIT')
		ctx.waitUntil(refresh(request, key, env, ctx))
		return fromEdge(hit, 'STALE')
	}

	const response = await fromContainer(request, env)
	if (!canStore(response)) return response
	// Only an anonymous visitor's page is stored as is. For a visitor with
	// cookies (signed in, consent...), an anonymous copy is fetched separately.
	if (request.headers.has('cookie')) ctx.waitUntil(refresh(request, key, env, ctx))
	else store(response, key, ctx)
	const page = new Response(response.body, response)
	page.headers.set('Cache-Control', BROWSER_CACHE_CONTROL)
	page.headers.set(EDGE_HEADER, 'MISS')
	return page
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		request = withoutTrackingParams(request)
		if (isCacheablePageLoad(request)) return servePage(request, env, ctx)
		return fromContainer(request, env)
	},

	async scheduled(controller: ScheduledController, env: Env) {
		const origin = env.NEXT_PUBLIC_SITE_URL || 'https://www.travsus.com'
		const container = await getRandom(env.TRAVSUS_CONTAINER, INSTANCES)

		if (controller.cron === KEEP_WARM_CRON) {
			const response = await container.fetch(new Request(new URL(KEEP_WARM_PATH, origin)))
			await response.body?.cancel()
			if (!response.ok) console.warn(`Keep-warm ping got ${response.status}`)
			return
		}

		const path = JOBS[controller.cron]
		if (!path) return console.error(`No job for cron "${controller.cron}"`)
		const request = new Request(new URL(path, origin), {
			headers: { authorization: `Bearer ${env.CRON_SECRET ?? ''}` },
		})
		const response = await container.fetch(request)
		const body = await response.text()
		if (!response.ok) throw new Error(`${path} failed (${response.status}): ${body.slice(0, 500)}`)
		console.log(`${path}: ${body.slice(0, 500)}`)
	},
} satisfies ExportedHandler<Env>
