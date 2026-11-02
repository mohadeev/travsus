// Password vault: the owner's passwords, grouped by project / website. Opens
// with the owner's sign-in plus a long unlock code; everything is encrypted
// and decrypted in the browser (see VaultPanel).
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isOwner } from '@/lib/admin/owner'
import VaultPanel from './VaultPanel'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Passwords | TRAVSUS', robots: { index: false, follow: false }, referrer: 'no-referrer' }

export default async function VaultPage() {
	if (!(await isOwner())) notFound()
	return <VaultPanel />
}
