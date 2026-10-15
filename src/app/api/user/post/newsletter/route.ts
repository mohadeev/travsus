// Newsletter sign-up (the pop-up and the footer). Saves the email with the
// chosen topics, adds it to MailRelay (where newsletters are sent from) and
// sends the welcome email. Answers with a code the forms
// turn into a message in the visitor's language.
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must, withMeta } from '@/lib/db'
import { rateLimit } from '@/lib/rateLimit'
import { sendTemplate } from '@/lib/email/send'
import { addToMailRelay } from '@/lib/email/mailrelay'

export const dynamic = 'force-dynamic'

const limiter = rateLimit(4, 60_000) // 4 requests a minute per visitor
const TOPICS = ['deals', 'tips', 'reviews', 'inspiration']
const TEST_EMAILS = ['skendoulmohamed@gmail.com']
const TEST_DOMAINS = ['travsus.com']

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 60
const isTestEmail = (email: string) => TEST_EMAILS.includes(email) || TEST_DOMAINS.some((domain) => email.endsWith(`@${domain}`))

export async function POST(req: NextRequest) {
	// Over the limit: answer right away (before, the request was left hanging)
	const limited = limiter(req, NextResponse.next(), () => {})
	if (limited) return NextResponse.json({ code: 'RATE_LIMIT_EXCEEDED' }, { status: 429 })

	try {
		const body = await req.json().catch(() => ({}))
		const email = String(body.email ?? '').trim().toLowerCase()
		const types = Array.isArray(body.types) ? body.types.filter((t: unknown) => TOPICS.includes(t as string)) : []

		if (!email) return NextResponse.json({ code: 'EMAIL_REQUIRED' }, { status: 400 })
		if (!isValidEmail(email)) return NextResponse.json({ code: 'INVALID_EMAIL' }, { status: 400 })

		// Team addresses: only send the welcome email (to check it), nothing is saved
		if (isTestEmail(email)) {
			await sendTemplate('newsletter-welcome', { to: email, data: {}, subjectPrefix: '[Test] ' })
			return NextResponse.json({ code: 'TEST_EMAIL_SENT' })
		}

		if (!types.length) return NextResponse.json({ code: 'TYPES_REQUIRED' }, { status: 400 })

		// Older rows may have capitals in the email: compare without case (escaping % and _)
		const existing = must(await db.from(T.newsletter).select('id').ilike('email', email.replace(/[\\%_]/g, '\\$&')).limit(1).maybeSingle())
		if (existing) return NextResponse.json({ code: 'ALREADY_SUBSCRIBED' })

		must(await db.from(T.newsletter).insert(withMeta({ email, types, subscribed: true, tokens: [] })))
		// The newsletters themselves are sent from MailRelay
		await Promise.all([sendTemplate('newsletter-welcome', { to: email, data: {} }), addToMailRelay(email)])

		return NextResponse.json({ code: 'SUBSCRIPTION_SUCCESS' }, { status: 201 })
	} catch (error) {
		console.error('Newsletter subscription error:', error)
		return NextResponse.json({ code: 'SERVER_ERROR' }, { status: 500 })
	}
}
