// Agency requests for the admin (owner only): accept / decline, private note.
// Accepting can email them how to add their tours; declining always sends
// the standard "no for now" email. DELETE removes a request.
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'
import { sendTemplate } from '@/lib/email/send'

export const dynamic = 'force-dynamic'

const STATUSES = ['pending', 'approved', 'declined'] as const

export async function PATCH(req: NextRequest) {
	if (!(await isOwner())) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const body = await req.json().catch(() => ({}))
	const id = typeof body.id === 'string' ? body.id : ''
	if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

	const changes: Record<string, unknown> = {}
	if ('status' in body) {
		if (!STATUSES.includes(body.status)) return NextResponse.json({ error: 'Unknown status' }, { status: 400 })
		changes.status = body.status
		changes.decided_at = body.status === 'pending' ? null : new Date().toISOString()
	}
	if ('note' in body) changes.note = String(body.note ?? '').trim().slice(0, 2000) || null
	if (!Object.keys(changes).length) return NextResponse.json({ error: 'Nothing to change' }, { status: 400 })

	try {
		const before = must(await db.from(T.agencies).select('status').eq('id', id).maybeSingle()) as any
		if (!before) return NextResponse.json({ error: 'Request not found' }, { status: 404 })
		const row = must(await db.from(T.agencies).update(changes).eq('id', id).select('*').maybeSingle()) as any

		// Tell them about the decision (templates in src/lib/email/templates.ts)
		let emailed = false
		const decided = changes.status && changes.status !== before.status
		if (decided && changes.status === 'approved' && body.notify) {
			emailed = (await sendTemplate('agency-approved', { to: row.email, data: {} })).ok
		} else if (decided && changes.status === 'declined') {
			emailed = (await sendTemplate('agency-declined', { to: row.email, data: {} })).ok
		}
		return NextResponse.json({ agency: row, emailed })
	} catch (error) {
		console.error('Admin agencies error:', error)
		return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 })
	}
}

export async function DELETE(req: NextRequest) {
	if (!(await isOwner())) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const { id } = await req.json().catch(() => ({}))
	if (typeof id !== 'string' || !id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
	try {
		must(await db.from(T.agencies).delete().eq('id', id))
		return NextResponse.json({ ok: true })
	} catch (error) {
		console.error('Admin agencies delete error:', error)
		return NextResponse.json({ error: 'Could not remove. Please try again.' }, { status: 500 })
	}
}
