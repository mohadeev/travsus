'use server'
// Contact form → email to the team (via Brevo). "Reply" in the inbox answers
// the visitor directly.
import { headers } from 'next/headers'
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys, type SendSmtpEmail } from '@getbrevo/brevo'

const transactionalEmailsApi = new TransactionalEmailsApi()
transactionalEmailsApi.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY as string)

const TEAM_INBOX = { email: 'skendoulmohamed@gmail.com', name: 'TRAVSUS' }

// At most 5 messages per visitor every 10 minutes
const recent = new Map<string, number[]>()
const tooMany = (key: string) => {
	const now = Date.now()
	const times = (recent.get(key) ?? []).filter((t) => now - t < 10 * 60_000)
	recent.set(key, [...times, now])
	return times.length >= 5
}

const escape = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
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

	const msg: SendSmtpEmail = {
		sender: { email: 'form@travsus.com', name: 'TRAVSUS contact form' }, // verified sender in Brevo
		to: [TEAM_INBOX],
		replyTo: { email, name },
		subject: `Contact form: ${name.replace(/[\r\n]+/g, ' ')}`,
		htmlContent: `<p><strong>Name:</strong> ${escape(name)}</p><p><strong>Email:</strong> ${escape(email)}</p><p><strong>Message:</strong></p><p style="white-space:pre-line">${escape(message)}</p>`,
		textContent: `Name: ${name}\nEmail: ${email}\n\n${message}`,
	}

	try {
		await transactionalEmailsApi.sendTransacEmail(msg)
		return { success: true }
	} catch (error: any) {
		console.error('Contact form email failed:', error.response?.body || error.message || error)
		return { success: false, error: 'SEND_FAILED' }
	}
}
