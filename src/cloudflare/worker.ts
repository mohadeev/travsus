// Cloudflare Worker entry (wrangler.jsonc "main"). Pages, API routes and
// middleware are served by vinext as usual. This file adds:
// - a per-request scope: on Workers a database connection can't be shared
//   between requests, so src/lib/db.ts keeps its connections in this scope;
// - the daily jobs that Vercel Cron ran from vercel.json, as Cloudflare Cron
//   Triggers (wrangler.jsonc "triggers"). Each calls the same API route with the
//   same "Authorization: Bearer <CRON_SECRET>" header Vercel sent.
import { AsyncLocalStorage } from 'node:async_hooks'
import vinext from 'vinext/server/fetch-handler'

const requestScope = new AsyncLocalStorage<Record<string, unknown>>()
;(globalThis as { __travsusRequestScope?: typeof requestScope }).__travsusRequestScope = requestScope

const JOBS: Record<string, string> = {
	'0 6 * * *': '/api/cron/charge-balances',
	'0 9 * * *': '/api/cron/invite-reminders',
}

type Env = { CRON_SECRET?: string; NEXT_PUBLIC_SITE_URL?: string }

export default {
	...vinext,
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		return requestScope.run({}, () => vinext.fetch(request, env as never, ctx))
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
