// Every email the site sends: preview with example data, who gets it and
// when, and a test send to the owner's inbox.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isOwner, OWNER_EMAIL } from '@/lib/admin/owner'
import { renderTemplate, TEMPLATES, type TemplateId } from '@/lib/email/templates'
import { emailConfigured } from '@/lib/email/send'
import { mailrelayConfigured } from '@/lib/email/mailrelay'
import EmailsPanel from './EmailsPanel'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Emails | TRAVSUS', robots: { index: false, follow: false } }

export default async function EmailsPage() {
	if (!(await isOwner())) notFound()
	const emails = (Object.keys(TEMPLATES) as TemplateId[]).map((id) => {
		const t = TEMPLATES[id]
		const { subject, html } = renderTemplate(id, t.sample as never)
		return { id, name: t.name, category: t.category, to: t.to, from: `${t.from.name} <${t.from.email}>`, when: t.when, connected: t.connected, pdf: !!('pdf' in t && t.pdf), subject, html }
	})
	return <EmailsPanel emails={emails} brevo={emailConfigured()} mailrelay={mailrelayConfigured()} owner={OWNER_EMAIL} />
}
