// Sets the map point of countries (geo_countries.geo), used for the map,
// weather and local time on the destination pages (admin only).
//
// POST { points: [{ code: "QA", lat: 25.28545, lng: 51.53096, place?: "Doha" }] }
//   code: 2-letter country code. Countries not in the database are skipped.
// POST { cities: [{ id, lat, lng }] }: sets the point of cities (geo_cities) by id.
// GET ?cities=1: every city with its English name, country code and current point.
// Allowed for the site owner's account, or with "Authorization: Bearer <CRON_SECRET>".
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must, mongoCollection } from '@/lib/db'
import { ObjectId } from 'mongodb'
import { isOwner } from '@/lib/admin/owner'

export const dynamic = 'force-dynamic'

async function allowed(request: NextRequest) {
	const secret = process.env.CRON_SECRET
	if (secret && request.headers.get('authorization') === `Bearer ${secret}`) return true
	return isOwner()
}

export async function GET(request: NextRequest) {
	if (!(await allowed(request))) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const countries: any[] = must(await db.from(T.countries).select('id, code')) ?? []
	const codeOf = new Map(countries.map((c) => [String(c.id), c.code]))
	const cities = await (await mongoCollection(T.cities))
		.find({}, { projection: { geo: 1, countryId: 1, contentId: 1, population: 1, 'translations.language': 1, 'translations.name': 1 } })
		.toArray()
	// English names from the geo texts, for rows without their own translations
	const contentIds = cities.filter((c) => !c.translations?.length && c.contentId).map((c) => c.contentId)
	const texts = contentIds.length
		? await (await mongoCollection(T.geoTexts)).find({ contentId: { $in: contentIds }, language: 'en-US', type: 'city' }, { projection: { contentId: 1, text: 1 } }).toArray()
		: []
	const textOf = new Map(texts.map((t) => [String(t.contentId), t.text]))
	return NextResponse.json({
		count: cities.length,
		cities: cities.map((c) => ({
			id: String(c._id),
			code: codeOf.get(String(c.countryId)) ?? null,
			name: c.translations?.find((t: any) => t.language === 'en-US')?.name ?? textOf.get(String(c.contentId)) ?? null,
			population: c.population ?? null,
			geo: c.geo ?? null,
		})),
	})
}

export async function POST(request: NextRequest) {
	if (!(await allowed(request))) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const body = await request.json().catch(() => null)
	if (Array.isArray(body?.cities)) {
		const list = body.cities.filter((c: any) => /^[0-9a-f]{24}$/.test(c?.id) && Number.isFinite(c?.lat) && Number.isFinite(c?.lng) && Math.abs(c.lat) <= 90 && Math.abs(c.lng) <= 180)
		if (!list.length || list.length > 2000) return NextResponse.json({ error: 'Send 1 to 2000 cities: { id, lat, lng }' }, { status: 400 })
		const col = await mongoCollection(T.cities)
		const result = await col.bulkWrite(
			list.map((c: any) => ({
				updateOne: { filter: { _id: new ObjectId(c.id) }, update: { $set: { geo: { lat: Math.round(c.lat * 1e5) / 1e5, log: Math.round(c.lng * 1e5) / 1e5 } } } },
			})),
		)
		return NextResponse.json({ ok: true, received: list.length, matched: result.matchedCount, changed: result.modifiedCount })
	}
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
