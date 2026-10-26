// Affiliate program: "request access" form. Saves the request in `affiliates`
// (the owner accepts or declines it in /admin/affiliates), tags the email in
// the newsletter list with the 'affiliate' type, then tells the team by email.
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must, withMeta } from '@/lib/db'
import { rateLimit } from '@/lib/rateLimit'
import { sendTemplate } from '@/lib/email/send'
import { OWNER_EMAIL } from '@/lib/admin/owner'

export const dynamic = 'force-dynamic'

const TYPE = 'affiliate'
const limiter = rateLimit(5, 60_000) // 5 requests a minute per visitor

const isEmail = (value: unknown): value is string =>
	typeof value === 'string' && value.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)


export async function POST(req: NextRequest) {
	const limited = limiter(req, NextResponse.next(), () => {})
	if (limited) return limited

	const body = await req.json().catch(() => ({}))
	const email = String(body.email ?? '').trim().toLowerCase()
	const website = String(body.website ?? '').trim().slice(0, 200)
	if (!isEmail(email)) return NextResponse.json({ code: 'INVALID_EMAIL' }, { status: 400 })
	// Where they share content (Instagram, YouTube, a blog...): requests without one are declined
	if (website.length < 3) return NextResponse.json({ code: 'NO_SOCIAL' }, { status: 400 })

	try {
		const requested = must(await db.from(T.affiliates).select('id').eq('email', email).maybeSingle())
		if (requested) return NextResponse.json({ code: 'ALREADY_REQUESTED' })
		must(
			await db.from(T.affiliates).insert({ email, website: website || null, locale: String(body.locale ?? '').slice(0, 10) || null }),
		)

		const existing = must(
			await db.from(T.newsletter).select('id, types').eq('email', email).maybeSingle(),
		) as { id: string; types: string[] | null } | null

		if (existing && !existing.types?.includes(TYPE)) {
			must(
				await db
					.from(T.newsletter)
					.update({ types: [...(existing.types ?? []), TYPE], updatedAt: new Date().toISOString() })
					.eq('id', existing.id),
			)
		} else if (!existing) {
			must(
				await db
					.from(T.newsletter)
					.insert(withMeta({ email, types: [TYPE], subscribed: true, tokens: [] })),
			)
		}

		// To the team inbox; never fails the request
		await sendTemplate('affiliate-request-team', {
			to: OWNER_EMAIL,
			data: { email, website: website || undefined, locale: String(body.locale ?? '').slice(0, 10) || undefined },
		})

		return NextResponse.json({ code: 'REQUESTED' }, { status: 201 })
	} catch (error) {
		console.error('Affiliate request error:', error)
		return NextResponse.json({ code: 'SERVER_ERROR' }, { status: 500 })
	}
}
