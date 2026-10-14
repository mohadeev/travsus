// Business dashboard: sign-in check, the menu, and the page.
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { dashboardScope } from '@/lib/dashboard'
import SignInPrompt from '../(account-pages)/_components/SignInPrompt'
import DashboardNav from './_components/DashboardNav'

// The dashboard shows each user their own data: always per request, never indexed
export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Dashboard | TRAVSUS', robots: { index: false, follow: false } }

export default async function DashboardLayout({ children }: { children: ReactNode }) {
	const scope = await dashboardScope()

	return (
		<main className="mx-auto max-w-7xl px-5 pb-24 pt-8 text-neutral-950 sm:pt-12 dark:text-white">
			{scope ? (
				<div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
					<DashboardNav scopeLabel={scope.label} />
					<div className="min-w-0">{children}</div>
				</div>
			) : (
				<div className="py-10 sm:py-16">
					<SignInPrompt />
				</div>
			)}
		</main>
	)
}
