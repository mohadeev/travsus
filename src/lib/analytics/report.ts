// Numbers for the analytics panel, computed from analytics_sessions /
// analytics_events (and new accounts from users). Server only.
import 'server-only'
import { db, T, must } from '@/lib/db'
import { GOOD_EVENTS, visitMood } from '@/lib/analytics/mood'

/** Rage clicks and good moments per visit, from a list of events. */
function signals(events: any[]) {
	const bySession = new Map<string, { rage: number; good: number }>()
	for (const e of events) {
		if (e.type !== 'rage' && !GOOD_EVENTS.has(e.type)) continue
		const s = bySession.get(e.session_id) ?? { rage: 0, good: 0 }
		if (e.type === 'rage') s.rage += 1
		else s.good += 1
		bySession.set(e.session_id, s)
	}
	return bySession
}

const moodOf = (s: any, sig?: { rage: number; good: number }, duration?: number) =>
	visitMood({
		errors: s.errors ?? 0,
		rage: sig?.rage ?? 0,
		good: sig?.good ?? 0,
		pageviews: s.pageviews ?? 0,
		duration: duration ?? Math.max(0, (new Date(s.last_seen_at).getTime() - new Date(s.started_at).getTime()) / 1000),
	})

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
	const liveSig = sessions.length
		? signals(
				(must(
					await db
						.from(T.analyticsEvents)
						.select('session_id, type')
						.in('session_id', sessions.map((s) => s.id))
						.in('type', ['rage', 'search', 'booking_start', 'signup_open'])
						.limit(2000),
				) ?? []) as any[],
			)
		: new Map()
	return sessions.map((s) => ({
		...s,
		mood: moodOf(s, liveSig.get(s.id)),
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
				.in('type', ['pageview', 'leave', 'error', 'click', 'search', 'rage', 'booking_start', 'signup_open'])
				.order('id', { ascending: true })
				.range(from, to),
		),
		db.from(T.users).select('id, email, createdAt').gte('createdAt', since).then((r) => (r.data ?? []) as any[]),
	])

	const pageviews = events.filter((e) => e.type === 'pageview')
	const leaves = events.filter((e) => e.type === 'leave' && e.duration_ms != null)
	const errors = events.filter((e) => e.type === 'error')
	const sig = signals(events)
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
	// A person's visits: signed in (user_id) plus, with consent, the same browser before sign-up (visitor_id)
	const sessionsByUser = new Map<string, any[]>()
	const visitorOfUser = new Map<string, Set<string>>()
	for (const s of sessions) {
		if (!s.user_id) continue
		sessionsByUser.set(s.user_id, [...(sessionsByUser.get(s.user_id) ?? []), s])
		if (s.visitor_id) visitorOfUser.set(s.user_id, (visitorOfUser.get(s.user_id) ?? new Set()).add(s.visitor_id))
	}
	for (const [userId, visitors] of Array.from(visitorOfUser.entries())) {
		const known = new Set((sessionsByUser.get(userId) ?? []).map((s) => s.id))
		const extra = sessions.filter((s) => !s.user_id && s.visitor_id && visitors.has(s.visitor_id) && !known.has(s.id))
		sessionsByUser.set(userId, [...(sessionsByUser.get(userId) ?? []), ...extra])
	}
	// Accounts with no visit in this period: find their latest visit ever, so the row can still be opened
	const missing = newUsers.filter((u) => !sessionsByUser.has(u.id)).map((u) => u.id)
	if (missing.length) {
		const older = ((await db.from(T.analyticsSessions).select('id, user_id, started_at').in('user_id', missing).order('started_at', { ascending: false }).limit(500)).data ?? []) as any[]
		for (const s of older) if (!sessionsByUser.has(s.user_id)) sessionsByUser.set(s.user_id, [s])
	}
	const signups = newUsers
		.map((u) => {
			const visits = (sessionsByUser.get(u.id) ?? []).sort((a, b) => a.started_at.localeCompare(b.started_at))
			const first = visits[0]
			return {
				userId: u.id,
				visitId: visits.length ? visits[visits.length - 1].id : null,
				visits: visits.length,
				email: u.email,
				createdAt: u.createdAt,
				country: first?.country ?? null,
				source: first?.source ? `${first.source} / ${first.medium ?? ''}` : null,
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
		moods: (() => {
			const counts = new Map<string, { emoji: string; label: string; count: number }>()
			for (const s of sessions) {
				const m = moodOf(s, sig.get(s.id))
				const c = counts.get(m.label) ?? { emoji: m.emoji, label: m.label, count: 0 }
				c.count += 1
				counts.set(m.label, c)
			}
			return ['Great', 'Good', 'Neutral', 'Struggling', 'Frustrated'].map((l) => counts.get(l)).filter(Boolean)
		})(),
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
			rage: sig.get(s.id)?.rage ?? 0,
			mood: moodOf(s, sig.get(s.id)),
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
	const history = await visitHistory(session)
	const detailSig = signals(events.map((e) => ({ ...e, session_id: id }))).get(id)
	return {
		session: { ...session, email: user?.email ?? null, accountCreated: user?.createdAt ?? null },
		mood: moodOf(session, detailSig),
		rage: detailSig?.rage ?? 0,
		events,
		visits: Math.max(visits ?? 0, history.length) || visits,
		history,
	}
}

/**
 * Every visit by the same person, oldest first and numbered (1st, 2nd...):
 * same browser (visitor_id, known only with consent) or same signed-in account.
 */
async function visitHistory(session: any) {
	const [byVisitor, byUser] = await Promise.all([
		session.visitor_id
			? db.from(T.analyticsSessions).select(HISTORY_SELECT).eq('visitor_id', session.visitor_id).order('started_at').limit(200)
			: Promise.resolve({ data: [] as any[] }),
		session.user_id
			? db.from(T.analyticsSessions).select(HISTORY_SELECT).eq('user_id', session.user_id).order('started_at').limit(200)
			: Promise.resolve({ data: [] as any[] }),
	])
	const all = new Map<string, any>()
	for (const s of [...((byVisitor as any).data ?? []), ...((byUser as any).data ?? [])]) all.set(s.id, s)
	if (!all.size) all.set(session.id, session)
	const sessions = Array.from(all.values()).sort((a, b) => String(a.started_at).localeCompare(String(b.started_at)))
	// The pages of each visit, in order
	const pages = new Map<string, string[]>()
	const ids = sessions.map((s) => s.id)
	let histSig = new Map<string, { rage: number; good: number }>()
	if (ids.length > 1) {
		const views = (must(
			await db
				.from(T.analyticsEvents)
				.select('session_id, type, path, created_at')
				.in('session_id', ids)
				.in('type', ['pageview', 'rage', 'search', 'booking_start', 'signup_open'])
				.order('created_at')
				.limit(4000),
		) ?? []) as any[]
		for (const v of views) if (v.type === 'pageview') pages.set(v.session_id, [...(pages.get(v.session_id) ?? []), v.path])
		histSig = signals(views)
	}
	return sessions.map((s, i) => ({
		number: i + 1,
		id: s.id,
		current: s.id === session.id,
		started_at: s.started_at,
		duration: Math.max(0, (new Date(s.last_seen_at).getTime() - new Date(s.started_at).getTime()) / 1000),
		pageviews: s.pageviews ?? 0,
		errors: s.errors ?? 0,
		mood: moodOf(s, histSig.get(s.id)),
		source: s.source ?? 'direct',
		device: s.device ?? null,
		country: s.country ?? null,
		city: s.city ?? null,
		landing: s.landing_path ?? null,
		signedIn: !!s.user_id,
		pages: pages.get(s.id) ?? (s.landing_path ? [s.landing_path] : []),
	}))
}

const HISTORY_SELECT = 'id, visitor_id, user_id, started_at, last_seen_at, country, city, source, device, landing_path, pageviews, errors'
