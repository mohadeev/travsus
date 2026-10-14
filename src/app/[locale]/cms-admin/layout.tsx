// The places editor (countries, cities, places) is part of the admin: owner
// only. Its APIs check too (adminOnly).
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { isOwner } from '@/lib/admin/owner'
import AdminNav from '../admin/_components/AdminNav'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Places | TRAVSUS', robots: { index: false, follow: false } }

export default async function CmsAdminLayout({ children }: { children: ReactNode }) {
	if (!(await isOwner())) notFound()
	return (
		<>
			<AdminNav />
			{children}
		</>
	)
}
