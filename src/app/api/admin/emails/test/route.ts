// Send one email template, with its example data, to the owner's inbox
// (owner only). Booking emails come with the example PDF attached.
import { NextResponse, type NextRequest } from 'next/server'
import { isOwner, OWNER_EMAIL } from '@/lib/admin/owner'
import { TEMPLATES, type TemplateId } from '@/lib/email/templates'
import { sendTemplate } from '@/lib/email/send'
import { bookingPdf, bookingPdfName } from '@/lib/email/bookingPdf'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
	if (!(await isOwner())) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const { id } = await req.json().catch(() => ({}))
	if (!(id in TEMPLATES)) return NextResponse.json({ error: 'Unknown email' }, { status: 400 })
	const t = TEMPLATES[id as TemplateId]
	const attachments = 'pdf' in t && t.pdf ? [{ name: bookingPdfName(t.sample as any), content: await bookingPdf(t.sample as any) }] : undefined
	const sent = await sendTemplate(id as TemplateId, { to: OWNER_EMAIL, data: t.sample as never, attachments, subjectPrefix: '[Test] ' })
	return sent.ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: sent.error }, { status: 502 })
}
