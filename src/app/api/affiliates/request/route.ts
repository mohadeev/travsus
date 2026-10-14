// Affiliate program: "request access" form. Saves the email in the newsletter
// list with the 'affiliate' type (existing subscribers get the type added),
// then tells the team by email.
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must, withMeta } from '@/lib/db'
import { rateLimit } from '@/lib/rateLimit'
import sendEmail from '@/utils/email/sendMail'

export const dynamic = 'force-dynamic'

const TYPE = 'affiliate'
const limiter = rateLimit(5, 60_000) // 5 requests a minute per visitor

const isEmail = (value: unknown): value is string =>
	typeof value === 'string' && value.length <= 120 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const escape = (text: string) =>
	text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

export async function POST(req: NextRequest) {
	const limited = limiter(req, NextResponse.next(), () => {})
	if (limited) return limited

	const body = await req.json().catch(() => ({}))
	const email = String(body.email ?? '').trim().toLowerCase()
	const website = String(body.website ?? '').trim().slice(0, 200)
	if (!isEmail(email)) return NextResponse.json({ code: 'INVALID_EMAIL' }, { status: 400 })

	try {
		const existing = must(
			await db.from(T.newsletter).select('id, types').eq('email', email).maybeSingle(),
		) as { id: string; types: string[] | null } | null

		if (existing?.types?.includes(TYPE)) {
			return NextResponse.json({ code: 'ALREADY_REQUESTED' })
		}
		if (existing) {
			must(
				await db
					.from(T.newsletter)
					.update({ types: [...(existing.types ?? []), TYPE], updatedAt: new Date().toISOString() })
					.eq('id', existing.id),
			)
		} else {
			must(
				await db
					.from(T.newsletter)
					.insert(withMeta({ email, types: [TYPE], subscribed: true, tokens: [] })),
			)
		}

		// To the team inbox (sendEmail's default recipient); never fails the request
		await sendEmail({
			subject: `Affiliate access request: ${email}`,
			message: `<p>New affiliate program request.</p><p><b>Email:</b> ${escape(email)}${
				website ? `<br><b>Website / channel:</b> ${escape(website)}` : ''
			}<br><b>Language:</b> ${escape(String(body.locale ?? '').slice(0, 10))}</p>`,
		})

		return NextResponse.json({ code: 'REQUESTED' }, { status: 201 })
	} catch (error) {
		console.error('Affiliate request error:', error)
		return NextResponse.json({ code: 'SERVER_ERROR' }, { status: 500 })
	}
}
