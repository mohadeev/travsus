// Analytics collector: receives batches from the site tracker
// (src/components/AnalyticsTracker.tsx) and stores the visit and its events.
// Anonymous by default; account linking only with measurement consent.
import { NextResponse, type NextRequest } from 'next/server'
import { db, T } from '@/lib/db'
import { deviceInfo, isBot, place, trafficSource } from '@/lib/analytics/classify'
import { getSessionUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

const EVENT_TYPES = new Set(['pageview', 'leave', 'click', 'error', 'search', 'identify', 'booking_start', 'signup_open'])
const ID = /^[a-zA-Z0-9_-]{8,40}$/
const str = (v: unknown, max: number) => (typeof v === 'string' && v ? v.slice(0, max) : null)
const int = (v: unknown, min: number, max: number) => (typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v))) : null)

/** Event details: up to 10 short text / number values. */
function cleanData(data: unknown) {
	if (!data || typeof data !== 'object' || Array.isArray(data)) return null
	const out: Record<string, string | number> = {}
	for (const [key, value] of Object.entries(data).slice(0, 10)) {
		if (typeof value === 'string') out[key.slice(0, 30)] = value.slice(0, 300)
		else if (typeof value === 'number' && Number.isFinite(value)) out[key.slice(0, 30)] = value
	}
	return Object.keys(out).length ? out : null
}

// At most 400 events per visit per minute (one tab can't flood the tables)
const recent = new Map<string, { count: number; until: number }>()
function tooMany(sid: string, n: number) {
	const now = Date.now()
	const entry = recent.get(sid)
	if (!entry || entry.until < now) {
		recent.set(sid, { count: n, until: now + 60_000 })
		if (recent.size > 5000) recent.forEach((e, key) => e.until < now && recent.delete(key))
		return false
	}
	entry.count += n
	return entry.count > 400
}

export async function POST(req: NextRequest) {
	const ua = req.headers.get('user-agent') ?? ''
	if (isBot(ua)) return new NextResponse(null, { status: 204 })

	const body = await req.json().catch(() => null)
	const sid = body?.sid
	if (typeof sid !== 'string' || !ID.test(sid)) return new NextResponse(null, { status: 400 })
	const consent = body.consent === true
	const vid = consent && typeof body.vid === 'string' && ID.test(body.vid) ? body.vid : null

	const events = (Array.isArray(body.events) ? body.events : [])
		.slice(0, 50)
		.filter((e: any) => EVENT_TYPES.has(e?.type))
		.map((e: any) => ({
			session_id: sid,
			type: e.type,
			path: str(e.path, 300),
			title: str(e.title, 200),
			duration_ms: int(e.duration, 0, 6 * 3600_000),
			scroll: int(e.scroll, 0, 100),
			data: cleanData(e.data),
			retry: e.retry === true,
			created_at: typeof e.t === 'number' && Math.abs(Date.now() - e.t) < 10 * 60_000 ? new Date(e.t).toISOString() : new Date().toISOString(),
		}))
	if (tooMany(sid, events.length + 1)) return new NextResponse(null, { status: 429 })

	try {
		const now = new Date().toISOString()
		const live = body.live && typeof body.live === 'object' ? body.live : null

		// The visit: created on its first batch
		const { data: existing } = await db
			.from(T.analyticsSessions)
			.select('id, pageviews, errors, user_id')
			.eq('id', sid)
			.maybeSingle()
		if (!existing) {
			const first = body.first ?? {}
			const ownHost = req.headers.get('host')?.split(':')[0] ?? null
			await db.from(T.analyticsSessions).upsert(
				{
					id: sid,
					started_at: now,
					last_seen_at: now,
					...place(req.headers),
					...deviceInfo(ua),
					...trafficSource(str(first.referrer, 500), str(first.url, 1000), ownHost),
					referrer: str(first.referrer, 500),
					landing_path: str(first.path, 300),
					locale: str(first.locale, 10),
					screen: str(first.screen, 20),
				},
				{ onConflict: 'id', ignoreDuplicates: true },
			)
		}

		// Link the visit to the signed-in account only with consent
		let userId: string | null = existing?.user_id ?? null
		if (consent && !userId && events.some((e: any) => e.type === 'identify')) {
			userId = (await getSessionUser().catch(() => null))?.id ?? null
		}

		const pageviews = events.filter((e: any) => e.type === 'pageview' && !e.retry).length
		const errors = events.filter((e: any) => e.type === 'error' && !e.retry).length
		await db
			.from(T.analyticsSessions)
			.update({
				last_seen_at: now,
				consent,
				...(vid ? { visitor_id: vid } : {}),
				...(userId ? { user_id: userId } : {}),
				...(live
					? { current_path: str(live.path, 300), current_title: str(live.title, 200), current_scroll: int(live.scroll, 0, 100) }
					: {}),
				...(pageviews || errors ? { pageviews: (existing?.pageviews ?? 0) + pageviews, errors: (existing?.errors ?? 0) + errors } : {}),
			})
			.eq('id', sid)

		// Resent events (see the tracker) are skipped when already stored
		let stored = events.filter((e: any) => e.type !== 'identify')
		const retried = stored.filter((e: any) => e.retry)
		if (retried.length) {
			const { data: have } = await db
				.from(T.analyticsEvents)
				.select('type, created_at')
				.eq('session_id', sid)
				.in('created_at', retried.map((e: any) => e.created_at))
			const seen = new Set((have ?? []).map((h: any) => `${h.type}|${new Date(h.created_at).getTime()}`))
			stored = stored.filter((e: any) => !e.retry || !seen.has(`${e.type}|${new Date(e.created_at).getTime()}`))
		}
		if (stored.length) await db.from(T.analyticsEvents).insert(stored.map(({ retry, ...e }: any) => e))
		return new NextResponse(null, { status: 204 })
	} catch (error) {
		console.error('Analytics collect failed:', error)
		return new NextResponse(null, { status: 204 }) // never bother the visitor
	}
}
