// Sends TRAVSUS emails through Brevo's SMTP relay (transactional emails: free
// up to 300 a day). Newsletters go through MailRelay instead (./mailrelay).
// Needs SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASS. Without them nothing is
// sent and the reason is logged.
import 'server-only'
import nodemailer, { type Transporter } from 'nodemailer'
import { renderTemplate, type Sender, type TemplateData, type TemplateId } from './templates'

export type Attachment = { name: string; content: Buffer }
export type SendResult = { ok: true; id?: string } | { ok: false; error: string }

/** True when sending is set up (for the admin page; never exposes the login) */
export const emailConfigured = () => !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)

let transporter: Transporter | undefined
function smtp() {
	if (!transporter) {
		const port = Number(process.env.SMTP_PORT || 587)
		transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port,
			secure: port === 465, // 587 upgrades to TLS with STARTTLS
			auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
			connectionTimeout: 20_000,
			greetingTimeout: 20_000,
			socketTimeout: 20_000,
		})
	}
	return transporter
}

const address = (s: Sender | { email: string; name?: string }) => ({ name: s.name ?? '', address: s.email })

/** Send one template. Never throws: returns { ok: false, error } instead. */
export async function sendTemplate<K extends TemplateId>(
	id: K,
	{ to, data, attachments, subjectPrefix }: { to: string | { email: string; name?: string }; data: TemplateData<K>; attachments?: Attachment[]; subjectPrefix?: string },
): Promise<SendResult> {
	if (!emailConfigured()) {
		console.error(`Email "${id}" not sent: SMTP login is missing`)
		return { ok: false, error: 'Email sending is not set up (SMTP_HOST, SMTP_USER or SMTP_PASS missing)' }
	}
	try {
		const { subject, html, from, replyTo } = renderTemplate(id, data)
		const info = await smtp().sendMail({
			from: address(from),
			to: typeof to === 'string' ? to : address(to),
			...(replyTo ? { replyTo: address(replyTo) } : {}),
			subject: (subjectPrefix ?? '') + subject,
			html,
			...(attachments?.length ? { attachments: attachments.map((a) => ({ filename: a.name, content: a.content })) } : {}),
			headers: { 'X-Mailin-Tag': id },
		})
		return { ok: true, id: info.messageId }
	} catch (error: any) {
		console.error(`Email "${id}" failed:`, error?.message ?? error)
		return { ok: false, error: error?.message || 'Could not send' }
	}
}
