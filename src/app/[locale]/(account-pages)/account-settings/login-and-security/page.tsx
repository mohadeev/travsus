'use client'
// Login & security: email, password, connected Google account and signed-in
// devices are all managed by Clerk's profile panel.
import Link from 'next/link'
import { UserProfile } from '@clerk/nextjs'
import { useLocale, useTranslations } from 'next-intl'

export default function LoginAndSecurityPage() {
	const t = useTranslations('Account')
	const locale = useLocale()

	return (
		<div>
			<h1 className="text-2xl font-bold tracking-tight sm:text-5xl">{t('nav_security')}</h1>
			<p className="mt-2 max-w-2xl text-neutral-500">{t('security_text')}</p>

			<div className="mt-8 overflow-hidden rounded-3xl ring-1 ring-neutral-200 sm:mt-10 dark:ring-neutral-800">
				<UserProfile
					routing="hash"
					appearance={{
						variables: { colorPrimary: '#0a0a0a', borderRadius: '0.9rem', fontFamily: 'inherit' },
						elements: {
							rootBox: 'w-full',
							// Full width of the page, never wider than the screen (phones)
							cardBox: 'w-full max-w-full shadow-none rounded-none',
							scrollBox: 'rounded-none',
							pageScrollBox: 'px-4 py-6 sm:px-8 sm:py-8',
							navbar: 'hidden md:flex',
							navbarMobileMenuRow: 'md:hidden',
						},
					}}
				/>
			</div>

			<div className="mt-10 flex flex-col gap-3 rounded-3xl bg-neutral-100 p-6 sm:flex-row sm:items-center sm:justify-between dark:bg-neutral-900">
				<div>
					<p className="font-semibold">{t('delete_title')}</p>
					<p className="text-sm text-neutral-500">{t('delete_text')}</p>
				</div>
				<Link
					href={`/${locale}/account-settings/deactivate` as any}
					className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-red-300 px-5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
				>
					{t('delete_link')}
				</Link>
			</div>
		</div>
	)
}
