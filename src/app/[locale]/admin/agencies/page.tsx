// Agency requests from the agencies page: accept or decline them.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db, T } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'
import { emailConfigured } from '@/lib/email/send'
import AgenciesPanel, { type Agency } from './AgenciesPanel'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Agencies | TRAVSUS', robots: { index: false, follow: false } }

export default async function AgenciesPage() {
	if (!(await isOwner())) notFound()
	const { data, error } = await db.from(T.agencies).select('*').order('created_at', { ascending: false }).limit(1000)
	return <AgenciesPanel initial={(data ?? []) as Agency[]} loadError={error ? 'Could not load the requests.' : ''} emailReady={emailConfigured()} />
}
