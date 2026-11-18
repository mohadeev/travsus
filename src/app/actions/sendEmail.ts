'use server'
// Contact form → email to the team (template "contact-team"). "Reply" in the
// inbox answers the visitor directly.
// Two steps, so a mistyped address can't get through: the first call emails a
// 6-digit code to the visitor (returns CODE_SENT with a signed token); the form
// is sent only when the second call brings that code back.
import { headers } from 'next/headers'
import { OWNER_EMAIL } from '@/lib/admin/owner'
import { SUPPORT_EMAIL } from '@/constants/contact'
import { sendTemplate } from '@/lib/email/send'
import { cleanEmail, hasEmailFormat } from '@/lib/emailCheck'
import { domainReceivesMail } from '@/lib/emailDomain'
import { checkEmailCode, newEmailCode } from '@/lib/emailCode'

// At most 8 attempts per visitor every 10 minutes (sending a code counts)
const recent = new Map<string, number[]>()
const tooMany = (key: string) => {
	const now = Date.now()
	const times = (recent.get(key) ?? []).filter((t) => now - t < 10 * 60_000)
	recent.set(key, [...times, now])
	return times.length >= 8
}

const field = (form: FormData, name: string, max: number) => String(form.get(name) ?? '').trim().slice(0, max)

export async function sendEmail(formData: FormData) {
	// Bots fill in the hidden "website" field; pretend all is well
	if (field(formData, 'website', 200)) return { success: true }

	const name = field(formData, 'name', 120)
	const email = cleanEmail(field(formData, 'email', 160))
	const message = field(formData, 'message', 5000)
	if (!name || !hasEmailFormat(email) || message.length < 5) {
		return { success: false, error: 'INVALID' }
	}
	// An address whose domain can't receive mail: we could never answer
	if ((await domainReceivesMail(email.slice(email.lastIndexOf('@') + 1))) === 'no_mail') {
		return { success: false, error: 'BAD_EMAIL' }
	}

	const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
	if (tooMany(ip)) return { success: false, error: 'TOO_MANY' }

	// Step 1: email a code to the address, to prove it receives mail
	const code = field(formData, 'code', 12)
	const token = field(formData, 'codeToken', 200)
	if (!code || !token) {
		const fresh = newEmailCode(email)
		const sent = await sendTemplate('email-code', { to: { email, name }, data: { code: fresh.code } })
		// Keep the message even if they never enter the code: a copy marked unverified
		// (not again when they only ask for a new code)
		if (!field(formData, 'resend', 2)) {
			await sendTemplate('contact-team', { to: { email: OWNER_EMAIL, name: 'TRAVSUS' }, cc: [SUPPORT_EMAIL], data: { name, email, message, unverified: true } })
		}
		return sent.ok ? { success: false, error: 'CODE_SENT', token: fresh.token, email } : { success: false, error: 'SEND_FAILED' }
	}
	// Step 2: the code they received
	const verdict = checkEmailCode(email, code, token)
	if (verdict !== 'ok') return { success: false, error: verdict === 'expired' ? 'CODE_EXPIRED' : 'CODE_WRONG' }

	// To the owner, with a copy to the shared contact inbox
	const sent = await sendTemplate('contact-team', { to: { email: OWNER_EMAIL, name: 'TRAVSUS' }, cc: [SUPPORT_EMAIL], data: { name, email, message } })
	return sent.ok ? { success: true } : { success: false, error: 'SEND_FAILED' }
}
