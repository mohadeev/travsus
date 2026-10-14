// Affiliate requests: accept or decline them, set a custom commission.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db, T } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'
import { TIERS } from '../../affiliates/tiers'
import AffiliatesPanel, { type Affiliate } from './AffiliatesPanel'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Affiliates | TRAVSUS', robots: { index: false, follow: false } }

export default async function AffiliatesPage() {
	if (!(await isOwner())) notFound()
	const { data, error } = await db.from(T.affiliates).select('*').order('created_at', { ascending: false }).limit(1000)
	return <AffiliatesPanel initial={(data ?? []) as Affiliate[]} tiers={TIERS.map((t) => ({ ...t }))} loadError={error ? 'Could not load the requests.' : ''} />
}
