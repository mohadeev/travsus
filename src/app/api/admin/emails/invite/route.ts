// Sends the affiliate invitation to a list of people (owner only).
// Body: { recipients: "Sofia Martin <sofia@example.com>\nbob@example.com", message?: string }
import { NextResponse, type NextRequest } from 'next/server'
import { isOwner } from '@/lib/admin/owner'
import { sendTemplate } from '@/lib/email/send'

export const dynamic = 'force-dynamic'

const MAX = 50 // per send (Brevo's free plan allows 300 emails a day)
const EMAIL = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/

/** "Sofia Martin <sofia@x.com>", "sofia@x.com" — one per line, comma or semicolon */
function parseRecipients(text: string) {
	const seen = new Set<string>()
	const valid: { email: string; name?: string }[] = []
	const invalid: string[] = []
	for (const part of text.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean)) {
		const m = /^(.*?)\s*<([^>]+)>$/.exec(part)
		const email = (m ? m[2] : part).trim().toLowerCase()
		const name = m?.[1].replace(/^["']|["']$/g, '').trim() || undefined
		if (!EMAIL.test(email)) invalid.push(part)
		else if (!seen.has(email)) {
			seen.add(email)
			valid.push({ email, name })
		}
	}
	return { valid, invalid }
}

export async function POST(req: NextRequest) {
	if (!(await isOwner())) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const body = await req.json().catch(() => ({}))
	const { valid, invalid } = parseRecipients(String(body.recipients ?? ''))
	const message = String(body.message ?? '').slice(0, 2000)
	if (invalid.length) return NextResponse.json({ error: `Not an email address: ${invalid.slice(0, 3).join(', ')}` }, { status: 400 })
	if (!valid.length) return NextResponse.json({ error: 'Add at least one email address' }, { status: 400 })
	if (valid.length > MAX) return NextResponse.json({ error: `At most ${MAX} people per send` }, { status: 400 })

	const failed: { email: string; error: string }[] = []
	for (const to of valid) {
		const sent = await sendTemplate('affiliate-invite', { to, data: { name: to.name, message } })
		if (!sent.ok) failed.push({ email: to.email, error: sent.error })
	}
	return NextResponse.json({ sent: valid.length - failed.length, failed }, { status: failed.length === valid.length ? 502 : 200 })
}
