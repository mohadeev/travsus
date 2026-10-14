// Affiliate requests for the admin (owner only): accept / decline, custom
// commission (null = the standard tiers), link code, private note. Accepting
// gives the affiliate a code; on accept or decline the person can be told by
// email.
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'
import { CODE, newCode } from '@/lib/affiliates'
import sendEmail from '@/utils/email/sendMail'
import { TIERS } from '@/app/[locale]/affiliates/tiers'

export const dynamic = 'force-dynamic'

const STATUSES = ['pending', 'approved', 'declined'] as const
type Status = (typeof STATUSES)[number]

const SITE = 'https://www.travsus.com'
const MESSAGES: Partial<Record<Status, (rate: string, code: string) => { subject: string; html: string }>> = {
	approved: (rate, code) => ({
		subject: 'Welcome to the TRAVSUS affiliate program',
		html: `<p>Hello,</p><p>Good news: your request to join the TRAVSUS affiliate program has been accepted.</p><p><b>Your commission:</b> ${rate}<br><b>Your link:</b> <a href="${SITE}/en-US?ref=${code}">${SITE}/en-US?ref=${code}</a></p><p>Sign in to TRAVSUS with this email: on every tour page you'll see your personal link to share, and your clicks, bookings and earnings are in your account under <a href="${SITE}/en-US/account-affiliate">Affiliate</a>.</p><p>The TRAVSUS team</p>`,
	}),
	declined: () => ({
		subject: 'Your TRAVSUS affiliate request',
		html: `<p>Hello,</p><p>Thank you for your interest in the TRAVSUS affiliate program. We're not able to accept your request at the moment.</p><p>The TRAVSUS team</p>`,
	}),
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
	if ('code' in body && body.code) {
		const code = String(body.code).trim().toLowerCase()
		if (!CODE.test(code)) return NextResponse.json({ error: 'The code can use 3 to 24 letters, digits or dashes' }, { status: 400 })
		const taken = must(await db.from(T.affiliates).select('id').eq('code', code).neq('id', id).maybeSingle())
		if (taken) return NextResponse.json({ error: 'This code is already used by another affiliate' }, { status: 409 })
		changes.code = code
	}
	if ('note' in body) changes.note = String(body.note ?? '').slice(0, 2000) || null
	if (!Object.keys(changes).length) return NextResponse.json({ error: 'Nothing to change' }, { status: 400 })

	try {
		const before = must(await db.from(T.affiliates).select('code').eq('id', id).maybeSingle()) as any
		if (!before) return NextResponse.json({ error: 'Request not found' }, { status: 404 })
		// Accepted affiliates always have a code (kept if they're declined later, so old links stay theirs)
		if (changes.status === 'approved' && !before.code && !changes.code) changes.code = await newCode()

		const row = must(await db.from(T.affiliates).update(changes).eq('id', id).select('*').maybeSingle()) as any

		let emailed = false
		const message = body.notify && 'status' in changes ? MESSAGES[row.status as Status] : undefined
		if (message) {
			const tiers = `${TIERS[0].rate}% to ${TIERS[TIERS.length - 1].rate}%, growing with your bookings`
			const { subject, html } = message(row.rate === null ? tiers : `${Number(row.rate)}% on every booking`, row.code ?? '')
			// sendEmail returns nothing when it fails
			emailed = !!(await sendEmail({ to: row.email, subject, message: html }).catch(() => null))
		}
		return NextResponse.json({ affiliate: row, emailed })
	} catch (error) {
		console.error('Admin affiliates error:', error)
		return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 })
	}
}
