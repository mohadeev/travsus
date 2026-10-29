// Agencies page: "request access" form for tour agencies and guides. Saves the
// request in `agency_requests` (the owner accepts or declines it in
// /admin/agencies), then tells the team by email.
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must } from '@/lib/db'
import { rateLimit } from '@/lib/rateLimit'
import { sendTemplate } from '@/lib/email/send'
import { OWNER_EMAIL } from '@/lib/admin/owner'

export const dynamic = 'force-dynamic'

const limiter = rateLimit(5, 60_000) // 5 requests a minute per visitor

const isEmail = (value: unknown): value is string =>
	typeof value === 'string' && value.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const field = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max)

export async function POST(req: NextRequest) {
	const limited = limiter(req, NextResponse.next(), () => {})
	if (limited) return limited

	const body = await req.json().catch(() => ({}))
	const email = field(body.email, 120).toLowerCase()
	const company = field(body.company, 120)
	const location = field(body.location, 120)
	const website = field(body.website, 200)
	const locale = field(body.locale, 10)
	if (!isEmail(email)) return NextResponse.json({ code: 'INVALID_EMAIL' }, { status: 400 })
	if (company.length < 2 || location.length < 2) return NextResponse.json({ code: 'MISSING' }, { status: 400 })

	try {
		const requested = must(await db.from(T.agencies).select('id').eq('email', email).maybeSingle())
		if (requested) return NextResponse.json({ code: 'ALREADY_REQUESTED' })
		must(
			await db.from(T.agencies).insert({ email, company, location, website: website || null, locale: locale || null, status: 'pending', note: null, decided_at: null }),
		)

		// To the team inbox; never fails the request
		await sendTemplate('agency-request-team', {
			to: OWNER_EMAIL,
			data: { email, company, location, website: website || undefined, locale: locale || undefined },
		})

		return NextResponse.json({ code: 'REQUESTED' }, { status: 201 })
	} catch (error) {
		console.error('Agency request error:', error)
		return NextResponse.json({ code: 'SERVER_ERROR' }, { status: 500 })
	}
}
