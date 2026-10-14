// Affiliate requests for the admin (owner only): accept / decline, custom
// commission (null = the standard tiers), private note. On accept or decline
// the person can be told by email.
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'
import sendEmail from '@/utils/email/sendMail'
import { TIERS } from '@/app/[locale]/affiliates/tiers'

export const dynamic = 'force-dynamic'

const STATUSES = ['pending', 'approved', 'declined'] as const
type Status = (typeof STATUSES)[number]

const MESSAGES: Partial<Record<Status, (rate: string) => { subject: string; html: string }>> = {
	approved: (rate) => ({
		subject: 'Welcome to the TRAVSUS affiliate program',
		html: `<p>Hello,</p><p>Good news: your request to join the TRAVSUS affiliate program has been accepted.</p><p><b>Your commission:</b> ${rate}</p><p>We'll be in touch shortly with your affiliate link and everything you need to get started.</p><p>The TRAVSUS team</p>`,
	}),
	declined: () => ({
		subject: 'Your TRAVSUS affiliate request',
		html: `<p>Hello,</p><p>Thank you for your interest in the TRAVSUS affiliate program. We're not able to accept your request at the moment.</p><p>The TRAVSUS team</p>`,
	}),
}

export async function GET() {
	if (!(await isOwner())) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const rows = must(await db.from(T.affiliates).select('*').order('created_at', { ascending: false }).limit(1000))
	return NextResponse.json({ affiliates: rows ?? [] }, { headers: { 'Cache-Control': 'private, no-store' } })
}

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
	if ('rate' in body) {
		const rate = body.rate === null || body.rate === '' ? null : Number(body.rate)
		if (rate !== null && !(Number.isFinite(rate) && rate >= 0 && rate <= 100))
			return NextResponse.json({ error: 'The commission must be between 0 and 100%' }, { status: 400 })
		changes.rate = rate === null ? null : Math.round(rate * 100) / 100
	}
	if ('note' in body) changes.note = String(body.note ?? '').slice(0, 2000) || null
	if (!Object.keys(changes).length) return NextResponse.json({ error: 'Nothing to change' }, { status: 400 })

	try {
		const row = must(await db.from(T.affiliates).update(changes).eq('id', id).select('*').maybeSingle()) as any
		if (!row) return NextResponse.json({ error: 'Request not found' }, { status: 404 })

		let emailed = false
		const message = body.notify && 'status' in changes ? MESSAGES[row.status as Status] : undefined
		if (message) {
			const tiers = `${TIERS[0].rate}% to ${TIERS[TIERS.length - 1].rate}%, growing with your bookings`
			const { subject, html } = message(row.rate === null ? tiers : `${Number(row.rate)}% on every booking`)
			// sendEmail returns nothing when it fails
			emailed = !!(await sendEmail({ to: row.email, subject, message: html }).catch(() => null))
		}
		return NextResponse.json({ affiliate: row, emailed })
	} catch (error) {
		console.error('Admin affiliates error:', error)
		return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 })
	}
}
