// Cloudflare Worker in front of the Next.js app, which runs in a Docker
// container (Cloudflare Containers, wrangler.container.jsonc).
// - Every request is forwarded to one of the containers (up to 3).
// - The Worker's variables and secrets (set with `wrangler secret put`) are
//   passed to the container as environment variables, so the app reads them
//   from process.env as on Vercel. Nothing secret is in the repo or the image.
// - The two daily jobs Vercel Cron ran (vercel.json) run as Cron Triggers and
//   call the same routes with the same "Authorization: Bearer <CRON_SECRET>".
import { Container, getRandom } from '@cloudflare/containers'

type Env = {
	TRAVSUS_CONTAINER: DurableObjectNamespace<TravsusContainer>
	CRON_SECRET?: string
	NEXT_PUBLIC_SITE_URL?: string
	[name: string]: unknown
}

/** Containers that share the traffic (max_instances in wrangler.container.jsonc). */
const INSTANCES = 3

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
	// Stops after 30 minutes without requests; the next request starts it again
	sleepAfter = '30m'

	constructor(ctx: DurableObjectState<{}>, env: Env) {
		super(ctx, env)
		this.envVars = containerEnv(env)
	}

	override onError(error: unknown) {
		console.error('Container error:', error)
		throw error
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const container = await getRandom(env.TRAVSUS_CONTAINER, INSTANCES)
		return container.fetch(request)
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
