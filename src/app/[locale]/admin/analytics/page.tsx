// Private analytics panel: only the owner's account can open it; for anyone
// else the page doesn't exist.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isOwner } from '@/lib/admin/owner'
import AnalyticsPanel from './AnalyticsPanel'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Analytics | TRAVSUS', robots: { index: false, follow: false } }

export default async function AnalyticsPage() {
	if (!(await isOwner())) notFound()
	return <AnalyticsPanel />
}
