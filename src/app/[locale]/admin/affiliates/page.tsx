// Affiliate requests: accept or decline them, set a custom commission, see
// each affiliate's earnings and record payouts; and the invitations sent.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db, T } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'
import { affiliateReport, affiliateSummary, type AffiliateSummary } from '@/lib/affiliates'
import { emailConfigured } from '@/lib/email/send'
import { listInvites } from '@/lib/affiliateInvites'
import { TIERS } from '../../affiliates/tiers'
import AffiliatesPanel, { type Affiliate } from './AffiliatesPanel'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Affiliates | TRAVSUS', robots: { index: false, follow: false } }

export default async function AffiliatesPage() {
	if (!(await isOwner())) notFound()
	const { data, error } = await db.from(T.affiliates).select('*').order('created_at', { ascending: false }).limit(1000)
	const rows = (data ?? []) as Affiliate[]
	const invites = await listInvites().catch(() => [])
	// Earnings of everyone who has (or had) a link
	const stats: Record<string, AffiliateSummary> = Object.fromEntries(
		await Promise.all(
			rows.filter((r) => r.code).map(async (r) => [r.id, affiliateSummary(await affiliateReport(r as any))] as const),
		).catch(() => []),
	)
	return <AffiliatesPanel initial={rows} stats={stats} tiers={TIERS.map((t) => ({ ...t }))} loadError={error ? 'Could not load the requests.' : ''} emailReady={emailConfigured()}
			invites={invites.map(({ id, email, name, created_at, accepted_at, accepted_email, sends, last_sent_at, message }) => ({ id, email, name, created_at, accepted_at, accepted_email, sends: sends ?? null, last_sent_at: last_sent_at ?? null, message: message ?? null }))}
		/>
}
