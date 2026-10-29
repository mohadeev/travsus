// Outreach tracker for the admin (owner only). POST adds people (one, or many
// handles pasted at once), PATCH changes a person (status, details, follow-up
// day) and can add a note to their timeline, DELETE removes them.
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'
import { cleanHandle, OUTREACH_PLATFORMS, OUTREACH_STATUSES, type OutreachContact, type OutreachEvent } from '@/lib/admin/outreach'

export const dynamic = 'force-dynamic'

const DAY = /^\d{4}-\d{2}-\d{2}$/
const text = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max) || null
const followers = (value: unknown) => {
	const n = Number(String(value ?? '').replace(/[^\d.]/g, '')) * (/k/i.test(String(value)) ? 1000 : /m/i.test(String(value)) ? 1_000_000 : 1)
	return Number.isFinite(n) && n > 0 ? Math.round(n) : null
}

/** Body fields we accept for a person (only the ones present) */
function details(body: any) {
	const changes: Partial<OutreachContact> = {}
	if ('handle' in body) changes.handle = cleanHandle(String(body.handle ?? ''))
	if ('platform' in body && OUTREACH_PLATFORMS.includes(body.platform)) changes.platform = body.platform
	if ('name' in body) changes.name = text(body.name, 120)
	if ('followers' in body) changes.followers = followers(body.followers)
	if ('email' in body) changes.email = text(body.email, 120)?.toLowerCase() ?? null
	if ('follow_up' in body) changes.follow_up = DAY.test(String(body.follow_up)) ? body.follow_up : null
	return changes
}

export async function POST(req: NextRequest) {
	if (!(await isOwner())) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const body = await req.json().catch(() => ({}))
	const status = OUTREACH_STATUSES.includes(body.status) ? body.status : 'messaged'
	const now = new Date().toISOString()
	// Many handles at once (one per line), or a single person
	const handles: string[] = Array.isArray(body.handles) ? body.handles.map((h: unknown) => cleanHandle(String(h))) : [cleanHandle(String(body.handle ?? ''))]
	const wanted = Array.from(new Set(handles.filter((h) => h.length >= 2))).slice(0, 300)
	if (!wanted.length) return NextResponse.json({ error: 'Add an Instagram name, like @wanderwithsofia' }, { status: 400 })

	try {
		const existing = must(await db.from(T.outreach).select('handle').in('handle', wanted)) as { handle: string }[]
		const taken = new Set(existing.map((r) => r.handle))
		const fresh = wanted.filter((h) => !taken.has(h))
		const note = text(body.note, 2000)
		const log: OutreachEvent[] = [{ at: now, status, ...(note ? { text: note } : {}) }]
		const one = details(body)
		const rows = fresh.map((handle) => ({
			platform: 'instagram',
			name: null,
			followers: null,
			email: null,
			follow_up: null,
			...(fresh.length === 1 && wanted.length === 1 ? one : {}),
			handle,
			status,
			last_contact_at: status === 'to_contact' ? null : now,
			log,
		}))
		const created = rows.length ? (must(await db.from(T.outreach).insert(rows).select('*')) as OutreachContact[]) : []
		return NextResponse.json({ created, skipped: wanted.filter((h) => taken.has(h)) })
	} catch (error) {
		console.error('Admin outreach add error:', error)
		return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 })
	}
}

export async function PATCH(req: NextRequest) {
	if (!(await isOwner())) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const body = await req.json().catch(() => ({}))
	const id = typeof body.id === 'string' ? body.id : ''
	if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

	try {
		const before = must(await db.from(T.outreach).select('*').eq('id', id).maybeSingle()) as OutreachContact | null
		if (!before) return NextResponse.json({ error: 'Person not found' }, { status: 404 })
		const changes: Record<string, unknown> = details(body)
		if (changes.handle !== undefined && (changes.handle as string).length < 2) return NextResponse.json({ error: 'Add an Instagram name' }, { status: 400 })

		// A note and/or a new status go on the timeline
		const now = new Date().toISOString()
		const event: OutreachEvent = { at: now }
		const note = text(body.note, 2000)
		if (note) event.text = note
		if (OUTREACH_STATUSES.includes(body.status) && body.status !== before.status) {
			changes.status = event.status = body.status
			if (body.status === 'joined' || body.status === 'declined') changes.follow_up = null
		}
		if (event.text || event.status) {
			changes.log = [...(before.log ?? []), event]
			if (event.status !== 'to_contact') changes.last_contact_at = now
		}
		// Remove one line of the timeline (by its time)
		if (typeof body.removeEventAt === 'string') changes.log = (before.log ?? []).filter((e) => e.at !== body.removeEventAt)
		if (!Object.keys(changes).length) return NextResponse.json({ contact: before })

		const contact = must(await db.from(T.outreach).update(changes).eq('id', id).select('*').maybeSingle())
		return NextResponse.json({ contact })
	} catch (error) {
		console.error('Admin outreach error:', error)
		return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 })
	}
}

export async function DELETE(req: NextRequest) {
	if (!(await isOwner())) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const { id } = await req.json().catch(() => ({}))
	if (typeof id !== 'string' || !id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
	try {
		must(await db.from(T.outreach).delete().eq('id', id))
		return NextResponse.json({ ok: true })
	} catch (error) {
		console.error('Admin outreach delete error:', error)
		return NextResponse.json({ error: 'Could not remove. Please try again.' }, { status: 500 })
	}
}
