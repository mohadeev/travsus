// Database export viewer: turns the Supabase dashboard export (CSV or JSON)
// into one JSON file and shows every table. Everything happens in the
// browser: nothing is uploaded or saved.
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isOwner } from '@/lib/admin/owner'
import MigratePanel from './MigratePanel'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Database export | TRAVSUS', robots: { index: false, follow: false } }

export default async function MigrateDbPage() {
	if (!(await isOwner())) notFound()
	return <MigratePanel />
}
