// Private translations panel: only the owner's account can open it; for
// anyone else the page doesn't exist.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isOwner } from '@/lib/admin/owner'
import TranslationsPanel from './TranslationsPanel'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Translations | TRAVSUS', robots: { index: false, follow: false } }

export default async function TranslationsPage() {
	if (!(await isOwner())) notFound()
	return <TranslationsPanel />
}
