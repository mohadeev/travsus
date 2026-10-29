// Outreach tracker: the people we talk to about becoming affiliates (mostly in
// Instagram DMs), their status and the timeline of each conversation.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db, T } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'
import type { OutreachContact } from '@/lib/admin/outreach'
import OutreachPanel from './OutreachPanel'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Outreach | TRAVSUS', robots: { index: false, follow: false } }

export default async function OutreachPage() {
	if (!(await isOwner())) notFound()
	const { data, error } = await db.from(T.outreach).select('*').order('created_at', { ascending: false }).limit(5000)
	const rows = ((data ?? []) as OutreachContact[]).map((r) => ({ ...r, log: r.log ?? [] }))
	return <OutreachPanel initial={rows} loadError={error ? 'Could not load the list.' : ''} />
}
