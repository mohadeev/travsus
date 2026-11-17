// Sets the map point of countries (geo_countries.geo), used for the map,
// weather and local time on the destination pages (admin only).
//
// POST { points: [{ code: "QA", lat: 25.28545, lng: 51.53096, place?: "Doha" }] }
//   code: 2-letter country code. Countries not in the database are skipped.
// Allowed for the site owner's account, or with "Authorization: Bearer <CRON_SECRET>".
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'

export const dynamic = 'force-dynamic'

async function allowed(request: NextRequest) {
	const secret = process.env.CRON_SECRET
	if (secret && request.headers.get('authorization') === `Bearer ${secret}`) return true
	return isOwner()
}

export async function POST(request: NextRequest) {
	if (!(await allowed(request))) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const body = await request.json().catch(() => null)
	const points: any[] = Array.isArray(body?.points) ? body.points : []
	const valid = points.filter(
		(p) => /^[A-Z]{2}$/.test(p?.code) && Number.isFinite(p?.lat) && Number.isFinite(p?.lng) && Math.abs(p.lat) <= 90 && Math.abs(p.lng) <= 180,
	)
	if (!valid.length || valid.length > 300) return NextResponse.json({ error: 'Send 1 to 300 points: { code, lat, lng }' }, { status: 400 })

	try {
		const rows: any[] = must(await db.from(T.countries).select('id, code, geo').in('code', valid.map((p) => p.code))) ?? []
		const byCode = new Map(rows.map((r) => [r.code, r]))
		const changed: { code: string; before: any; after: any }[] = []
		for (const p of valid) {
			const row = byCode.get(p.code)
			if (!row) continue
			const after = { lat: Math.round(p.lat * 1e5) / 1e5, log: Math.round(p.lng * 1e5) / 1e5 }
			if (row.geo?.lat === after.lat && row.geo?.log === after.log) continue
			must(await db.from(T.countries).update({ geo: after }).eq('id', row.id))
			changed.push({ code: p.code, before: row.geo ?? null, after })
		}
		return NextResponse.json({ ok: true, received: valid.length, found: byCode.size, changed: changed.length, missing: valid.filter((p) => !byCode.has(p.code)).map((p) => p.code), details: changed })
	} catch (error: any) {
		console.error('Geo points update failed:', error)
		return NextResponse.json({ error: error?.message || 'Could not save' }, { status: 500 })
	}
}
