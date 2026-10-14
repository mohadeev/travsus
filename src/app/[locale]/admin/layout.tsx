// Every page under /admin is for the owner only; for anyone else it doesn't
// exist. (Each panel checks again on its own, and so do the admin APIs.)
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { isOwner } from '@/lib/admin/owner'
import AdminNav from './_components/AdminNav'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Admin | TRAVSUS', robots: { index: false, follow: false } }

export default async function AdminLayout({ children }: { children: ReactNode }) {
	if (!(await isOwner())) notFound()
	return (
		<>
			<AdminNav />
			{children}
		</>
	)
}
