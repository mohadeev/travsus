'use server'
// Contact form → email to the team (template "contact-team"). "Reply" in the
// inbox answers the visitor directly.
import { headers } from 'next/headers'
import { OWNER_EMAIL } from '@/lib/admin/owner'
import { sendTemplate } from '@/lib/email/send'

// At most 5 messages per visitor every 10 minutes
const recent = new Map<string, number[]>()
const tooMany = (key: string) => {
	const now = Date.now()
	const times = (recent.get(key) ?? []).filter((t) => now - t < 10 * 60_000)
	recent.set(key, [...times, now])
	return times.length >= 5
}

const field = (form: FormData, name: string, max: number) => String(form.get(name) ?? '').trim().slice(0, max)

export async function sendEmail(formData: FormData) {
	// Bots fill in the hidden "website" field; pretend all is well
	if (field(formData, 'website', 200)) return { success: true }

	const name = field(formData, 'name', 120)
	const email = field(formData, 'email', 160)
	const message = field(formData, 'message', 5000)
	if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5) {
		return { success: false, error: 'INVALID' }
	}

	const ip = headers().get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
	if (tooMany(ip)) return { success: false, error: 'TOO_MANY' }

	const sent = await sendTemplate('contact-team', { to: { email: OWNER_EMAIL, name: 'TRAVSUS' }, data: { name, email, message } })
	return sent.ok ? { success: true } : { success: false, error: 'SEND_FAILED' }
}
