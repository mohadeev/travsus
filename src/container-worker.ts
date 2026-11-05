// Cloudflare Worker in front of the Next.js app, which runs in a Docker
// container (Cloudflare Containers, wrangler.container.jsonc).
// - Every request is forwarded to the container (one instance, max_instances
//   in wrangler.container.jsonc). While it is starting, visitors get a short
//   "starting up" page that refreshes itself instead of a raw 500.
// - The Worker's variables and secrets (set with `wrangler secret put`) are
//   passed to the container as environment variables, so the app reads them
//   from process.env as on Vercel. Nothing secret is in the repo or the image.
// - Cron Triggers are OFF ("crons": [] in wrangler.container.jsonc): the live
//   Worker already runs the daily jobs, and running them here too would charge
//   balances twice. scheduled() is kept so they can be moved here later.
import { Container, getRandom } from '@cloudflare/containers'

type Env = {
	TRAVSUS_CONTAINER: DurableObjectNamespace<TravsusContainer>
	CRON_SECRET?: string
	NEXT_PUBLIC_SITE_URL?: string
	[name: string]: unknown
}

/**
 * Containers that share the traffic. Must not exceed max_instances in
 * wrangler.container.jsonc (1): a higher number sends requests to instances
 * that cannot start ("Maximum number of running container instances exceeded").
 */
const INSTANCES = 1

/** Same schedules (UTC) and routes as vercel.json. */
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

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
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
	},

	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
		const path = JOBS[controller.cron]
		if (!path) return console.error(`No job for cron "${controller.cron}"`)
		const origin = env.NEXT_PUBLIC_SITE_URL || 'https://www.travsus.com'
		const request = new Request(new URL(path, origin), {
			headers: { authorization: `Bearer ${env.CRON_SECRET ?? ''}` },
		})
		const container = await getRandom(env.TRAVSUS_CONTAINER, INSTANCES)
		const response = await container.fetch(request)
		const body = await response.text()
		if (!response.ok) throw new Error(`${path} failed (${response.status}): ${body.slice(0, 500)}`)
		console.log(`${path}: ${body.slice(0, 500)}`)
	},
} satisfies ExportedHandler<Env>
