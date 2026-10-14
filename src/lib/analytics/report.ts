// Numbers for the analytics panel, computed from analytics_sessions /
// analytics_events (and new accounts from users). Server only.
import 'server-only'
import { db, T, must } from '@/lib/db'

const LIVE_SECONDS = 60 // seen in the last minute = online now
const MAX_ROWS = 50_000

/** All rows of a filtered query, page by page (up to MAX_ROWS). */
async function all<Row = any>(build: (from: number, to: number) => PromiseLike<{ data: any; error: any }>) {
	const rows: Row[] = []
	for (let from = 0; from < MAX_ROWS; from += 1000) {
		const page = (must(await build(from, from + 999)) ?? []) as Row[]
		rows.push(...page)
		if (page.length < 1000) break
	}
	return rows
}

/** "/fr-FR/morocco/fes/tours/x/123?y" → "/morocco/fes/tours/x/123" (pages grouped across languages) */
const pagePath = (path: string | null) => (path ?? '').split('?')[0].replace(/^\/[a-z]{2}-[A-Z]{2}(?=\/|$)/, '') || '/'
const isTourPage = (p: string) => /^\/[^/]+\/[^/]+\/[^/]+\/[^/]+\/[0-9a-f]{24}$/.test(p)
const isCheckout = (p: string) => p.startsWith('/checkout')
const isPaid = (p: string) => p.startsWith('/pay-done')

function countBy<T>(items: T[], key: (item: T) => string | null | undefined) {
	const map = new Map<string, number>()
	for (const item of items) {
		const k = key(item) || 'Unknown'
		map.set(k, (map.get(k) ?? 0) + 1)
	}
	return Array.from(map, ([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
}

const seconds = (a: string, b: string) => Math.max(0, (new Date(b).getTime() - new Date(a).getTime()) / 1000)

async function emailsOf(userIds: string[]) {
	const ids = Array.from(new Set(userIds.filter(Boolean)))
	if (!ids.length) return new Map<string, { email: string; createdAt: string }>()
	const users = must(await db.from(T.users).select('id, email, createdAt').in('id', ids)) as any[]
	return new Map(users.map((u) => [u.id, { email: u.email, createdAt: u.createdAt }]))
}

/** Who is on the site right now, and where. */
export async function liveVisitors() {
	const since = new Date(Date.now() - LIVE_SECONDS * 1000).toISOString()
	const sessions = must(
		await db
			.from(T.analyticsSessions)
			.select('id, user_id, started_at, last_seen_at, country, region, city, source, medium, device, browser, os, current_path, current_title, current_scroll, pageviews, errors, landing_path')
			.gte('last_seen_at', since)
			.order('started_at', { ascending: true }),
	) as any[]
	const emails = await emailsOf(sessions.map((s) => s.user_id))
	return sessions.map((s) => ({
		...s,
		email: emails.get(s.user_id)?.email ?? null,
		on_site_seconds: seconds(s.started_at, new Date().toISOString()),
	}))
}

/** Everything for a time range (in days; 1 = last 24 hours). */
export async function report(days: number) {
	const since = new Date(Date.now() - days * 86400_000).toISOString()
	const [sessions, events, newUsers] = await Promise.all([
		all<any>((from, to) =>
			db
				.from(T.analyticsSessions)
				.select('id, visitor_id, user_id, started_at, last_seen_at, country, city, source, medium, campaign, device, browser, os, landing_path, pageviews, errors, consent')
				.gte('started_at', since)
				.order('started_at', { ascending: false })
				.range(from, to),
		),
		all<any>((from, to) =>
			db
				.from(T.analyticsEvents)
				.select('session_id, created_at, type, path, duration_ms, scroll, data')
				.gte('created_at', since)
				.in('type', ['pageview', 'leave', 'error', 'click', 'search'])
				.order('id', { ascending: true })
				.range(from, to),
		),
		db.from(T.users).select('id, email, createdAt').gte('createdAt', since).then((r) => (r.data ?? []) as any[]),
	])

	const pageviews = events.filter((e) => e.type === 'pageview')
	const leaves = events.filter((e) => e.type === 'leave' && e.duration_ms != null)
	const errors = events.filter((e) => e.type === 'error')
	const durations = sessions.map((s) => seconds(s.started_at, s.last_seen_at))
	const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

	// Visits over time: by hour for one day, by day otherwise
	const bucket = (iso: string) => (days <= 1 ? iso.slice(0, 13) + ':00' : iso.slice(0, 10))
	const timeline = new Map<string, { visits: number; pageviews: number }>()
	for (let t = Date.now() - days * 86400_000; t <= Date.now(); t += days <= 1 ? 3600_000 : 86400_000) {
		timeline.set(bucket(new Date(t).toISOString()), { visits: 0, pageviews: 0 })
	}
	for (const s of sessions) {
		const slot = timeline.get(bucket(s.started_at))
		if (slot) slot.visits += 1
	}
	for (const e of pageviews) {
		const slot = timeline.get(bucket(e.created_at))
		if (slot) slot.pageviews += 1
	}

	// Pages: views, time spent and scroll depth
	const pages = new Map<string, { views: number; time: number[]; scroll: number[] }>()
	for (const e of pageviews) {
		const p = pagePath(e.path)
		pages.set(p, pages.get(p) ?? { views: 0, time: [], scroll: [] })
		pages.get(p)!.views += 1
	}
	for (const e of leaves) {
		const entry = pages.get(pagePath(e.path))
		if (!entry) continue
		entry.time.push(e.duration_ms / 1000)
		if (e.scroll != null) entry.scroll.push(e.scroll)
	}

	// Funnel: visits → tour page → checkout → paid
	const pathsBySession = new Map<string, string[]>()
	for (const e of pageviews) {
		const list = pathsBySession.get(e.session_id) ?? []
		list.push(pagePath(e.path))
		pathsBySession.set(e.session_id, list)
	}
	const reached = (test: (p: string) => boolean) => Array.from(pathsBySession.values()).filter((ps) => ps.some(test)).length

	// New accounts and the visit that brought them (when linked with consent)
	const sessionsByUser = new Map<string, any[]>()
	for (const s of sessions) if (s.user_id) sessionsByUser.set(s.user_id, [...(sessionsByUser.get(s.user_id) ?? []), s])
	const signups = newUsers
		.map((u) => {
			const visits = (sessionsByUser.get(u.id) ?? []).sort((a, b) => a.started_at.localeCompare(b.started_at))
			const first = visits[0]
			return {
				email: u.email,
				createdAt: u.createdAt,
				country: first?.country ?? null,
				source: first ? `${first.source} / ${first.medium}` : null,
				visitsBefore: visits.filter((v) => v.started_at <= u.createdAt).length,
				landing: first?.landing_path ?? null,
			}
		})
		.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

	// Errors grouped by message
	const errorGroups = new Map<string, { message: string; count: number; sessions: Set<string>; lastPath: string; last: string }>()
	for (const e of errors) {
		const message = String(e.data?.message ?? 'Error')
		const g = errorGroups.get(message) ?? { message, count: 0, sessions: new Set<string>(), lastPath: '', last: '' }
		g.count += 1
		g.sessions.add(e.session_id)
		if (e.created_at > g.last) {
			g.last = e.created_at
			g.lastPath = e.path ?? ''
		}
		errorGroups.set(message, g)
	}

	const visitors = new Set(sessions.map((s) => s.visitor_id ?? s.id)).size
	const emails = await emailsOf(sessions.slice(0, 100).map((s) => s.user_id))

	return {
		range: days,
		kpis: {
			visits: sessions.length,
			visitors,
			pageviews: pageviews.length,
			pagesPerVisit: sessions.length ? pageviews.length / sessions.length : 0,
			avgVisitSeconds: avg(durations),
			bounceRate: sessions.length ? sessions.filter((s) => (s.pageviews ?? 0) <= 1).length / sessions.length : 0,
			avgScroll: avg(leaves.filter((e) => e.scroll != null).map((e) => e.scroll)),
			errors: errors.length,
			visitsWithErrors: sessions.filter((s) => (s.errors ?? 0) > 0).length,
			newAccounts: newUsers.length,
			consentRate: sessions.length ? sessions.filter((s) => s.consent).length / sessions.length : 0,
		},
		timeline: Array.from(timeline, ([time, v]) => ({ time, ...v })),
		countries: countBy(sessions, (s) => s.country),
		cities: countBy(sessions, (s) => (s.city ? `${s.city}${s.country ? `, ${s.country}` : ''}` : null)).slice(0, 15),
		sources: countBy(sessions, (s) => `${s.source ?? 'direct'} / ${s.medium ?? 'none'}`),
		campaigns: countBy(sessions.filter((s) => s.campaign), (s) => s.campaign),
		devices: countBy(sessions, (s) => s.device),
		browsers: countBy(sessions, (s) => s.browser),
		systems: countBy(sessions, (s) => s.os),
		entryPages: countBy(sessions, (s) => pagePath(s.landing_path)).slice(0, 15),
		pages: Array.from(pages, ([path, p]) => ({ path, views: p.views, avgSeconds: avg(p.time), avgScroll: avg(p.scroll) }))
			.sort((a, b) => b.views - a.views)
			.slice(0, 30),
		funnel: [
			{ step: 'Visits', count: sessions.length },
			{ step: 'Viewed a tour', count: reached(isTourPage) },
			{ step: 'Opened checkout', count: reached(isCheckout) },
			{ step: 'Paid', count: reached(isPaid) },
		],
		errors: Array.from(errorGroups.values())
			.map((g) => ({ message: g.message, count: g.count, visits: g.sessions.size, lastPath: pagePath(g.lastPath), last: g.last }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 30),
		searches: countBy(events.filter((e) => e.type === 'search'), (e) => String(e.data?.q ?? '').toLowerCase().trim()).slice(0, 20),
		clicks: countBy(events.filter((e) => e.type === 'click'), (e) => (e.data?.text ? `${e.data.text}` : e.data?.href ?? null)).slice(0, 20),
		signups,
		recent: sessions.slice(0, 100).map((s) => ({
			id: s.id,
			started_at: s.started_at,
			duration: seconds(s.started_at, s.last_seen_at),
			country: s.country,
			city: s.city,
			source: s.source,
			medium: s.medium,
			device: s.device,
			browser: s.browser,
			pageviews: s.pageviews,
			errors: s.errors,
			landing: pagePath(s.landing_path),
			pages: (pathsBySession.get(s.id) ?? []).slice(0, 8),
			email: emails.get(s.user_id)?.email ?? null,
			returning: !!s.visitor_id && sessions.some((o) => o.visitor_id === s.visitor_id && o.started_at < s.started_at),
		})),
	}
}

/** One visit, step by step. */
export async function visitDetail(id: string) {
	const session = must(await db.from(T.analyticsSessions).select('*').eq('id', id).maybeSingle()) as any
	if (!session) return null
	const events = must(
		await db.from(T.analyticsEvents).select('created_at, type, path, title, duration_ms, scroll, data').eq('session_id', id).order('created_at').limit(2000),
	) as any[]
	const emails = await emailsOf([session.user_id])
	const user = emails.get(session.user_id)
	// How many visits this person made in total (known only with consent)
	const visits = session.visitor_id
		? (await db.from(T.analyticsSessions).select('id', { count: 'exact', head: true }).eq('visitor_id', session.visitor_id)).count
		: null
	return { session: { ...session, email: user?.email ?? null, accountCreated: user?.createdAt ?? null }, events, visits }
}
