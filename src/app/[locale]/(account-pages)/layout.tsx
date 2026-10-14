// Account area: sign-in check, then the section menu next to the page.
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { getSessionUser } from '@/lib/session'
import AccountNav from './_components/AccountNav'
import SignInPrompt from './_components/SignInPrompt'

// Personal pages: never in search results
export const metadata: Metadata = { robots: { index: false, follow: false } }

// Grid columns use minmax(0,1fr) so they can shrink to a phone's width (the
// menu then scrolls inside its own row instead of widening the page).
export default async function AccountLayout({ children }: { children: ReactNode }) {
	const user = await getSessionUser().catch(() => null)

	return (
		<main className="mx-auto max-w-7xl px-5 pb-20 pt-8 text-neutral-950 sm:pt-12 lg:pb-28 dark:text-white">
			{user ? (
				<div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">
					<AccountNav />
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
