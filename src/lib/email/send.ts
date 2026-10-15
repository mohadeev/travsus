// Sends TRAVSUS emails through Brevo (transactional emails: free up to 300 a
// day). Newsletters go through MailRelay instead (./mailrelay).
// Needs BREVO_API_KEY. Without it nothing is sent and the reason is logged.
import 'server-only'
import { renderTemplate, type TemplateData, type TemplateId } from './templates'

export type Attachment = { name: string; content: Buffer }
export type SendResult = { ok: true; id?: string } | { ok: false; error: string }

/** True when sending is set up (for the admin page; never exposes the key) */
export const emailConfigured = () => !!process.env.BREVO_API_KEY

/** Send one template. Never throws: returns { ok: false, error } instead. */
export async function sendTemplate<K extends TemplateId>(
	id: K,
	{ to, data, attachments, subjectPrefix }: { to: string | { email: string; name?: string }; data: TemplateData<K>; attachments?: Attachment[]; subjectPrefix?: string },
): Promise<SendResult> {
	const key = process.env.BREVO_API_KEY
	if (!key) {
		console.error(`Email "${id}" not sent: BREVO_API_KEY is missing`)
		return { ok: false, error: 'Email sending is not set up (BREVO_API_KEY missing)' }
	}
	try {
		const { subject, html, from, replyTo } = renderTemplate(id, data)
		const res = await fetch('https://api.brevo.com/v3/smtp/email', {
			method: 'POST',
			headers: { 'api-key': key, 'content-type': 'application/json', accept: 'application/json' },
			body: JSON.stringify({
				sender: from,
				to: [typeof to === 'string' ? { email: to } : to],
				...(replyTo ? { replyTo } : {}),
				subject: (subjectPrefix ?? '') + subject,
				htmlContent: html,
				...(attachments?.length ? { attachment: attachments.map((a) => ({ name: a.name, content: a.content.toString('base64') })) } : {}),
				tags: [id],
			}),
			signal: AbortSignal.timeout(20_000),
		})
		const body = await res.json().catch(() => ({}))
		if (!res.ok) {
			console.error(`Email "${id}" failed:`, res.status, body?.message ?? body)
			return { ok: false, error: body?.message || `Brevo error ${res.status}` }
		}
		return { ok: true, id: body?.messageId }
	} catch (error: any) {
		console.error(`Email "${id}" failed:`, error?.message ?? error)
		return { ok: false, error: error?.message || 'Could not send' }
	}
}
