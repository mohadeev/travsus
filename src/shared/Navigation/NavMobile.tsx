'use client'
// Mobile menu panel: search, categories, cities, account and language.
import React from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useAuth, useClerk } from '@clerk/nextjs'
import { ArrowUpRight, Instagram, Search, X } from 'lucide-react'
import Logo from '@/shared/Logo'
import { ACCOUNT_LINKS, CATEGORY_LINKS, CITY_LINKS } from '@/constants/siteNav'
import LanguagePreferencesModal from '@/app/(client-components)/(Header)/LanguagePreferencesModal'

export interface NavMobileProps {
	onClickClose?: () => void
}

const rowClass =
	'flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-medium transition hover:bg-neutral-100 dark:hover:bg-neutral-800'

const NavMobile: React.FC<NavMobileProps> = ({ onClickClose }) => {
	const t = useTranslations('Nav')
	const tHome = useTranslations('Home')
	const tAccount = useTranslations('AvatarDropdown')
	const locale = useLocale()
	const { isSignedIn } = useAuth()
	const { openSignIn, openSignUp, signOut } = useClerk()

	return (
		<div className="flex h-screen w-full flex-col overflow-y-auto bg-white text-neutral-950 dark:bg-neutral-950 dark:text-white">
			<div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-900">
				<Logo className="w-24" />
				<button
					type="button"
					onClick={onClickClose}
					aria-label={t('close')}
					className="grid h-10 w-10 place-items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
				>
					<X className="h-5 w-5" />
				</button>
			</div>

			<div className="flex-1 space-y-8 px-3 py-5">
				<form action={`/${locale}/search`} method="get" role="search" className="mx-2 flex items-center gap-3 rounded-full bg-neutral-100 px-4 dark:bg-neutral-900">
					<Search className="h-[18px] w-[18px] text-neutral-500" />
					<input
						type="search"
						name="query"
						aria-label={tHome('search_label')}
						placeholder={tHome('search_placeholder')}
						className="w-full border-0 bg-transparent p-0 py-3 text-[15px] placeholder:text-neutral-500 focus:outline-none focus:ring-0"
					/>
				</form>

				<Section title={t('explore')}>
					<Row href="/search?query=" onClick={onClickClose}>{t('all_tours')}</Row>
					{CATEGORY_LINKS.map((link) => (
						<Row key={link.href} href={link.href} onClick={onClickClose}>
							{tHome(link.label)}
						</Row>
					))}
				</Section>

				<Section title={t('destinations')}>
					<div className="flex flex-wrap gap-2 px-3">
						{CITY_LINKS.map((link) => (
							<Link
								key={link.href}
								href={link.href as any}
								onClick={onClickClose}
								className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium transition hover:border-neutral-950 dark:border-neutral-800"
							>
								{link.label}
							</Link>
						))}
					</div>
				</Section>

				<Section title={t('account')}>
					{isSignedIn ? (
						<>
							<Row href={ACCOUNT_LINKS.account} onClick={onClickClose}>{tAccount('my_account')}</Row>
							<Row href={ACCOUNT_LINKS.bookings} onClick={onClickClose}>{tAccount('my_bookings')}</Row>
							<Row href={ACCOUNT_LINKS.saved} onClick={onClickClose}>{t('saved')}</Row>
							<button
								type="button"
								onClick={() => {
									onClickClose?.()
									signOut({ redirectUrl: `/${locale}` })
								}}
								className={`${rowClass} w-full text-left`}
							>
								{tAccount('log_out')}
							</button>
						</>
					) : (
						<div className="grid grid-cols-2 gap-2 px-2">
							<button
								type="button"
								onClick={() => {
									onClickClose?.()
									openSignIn({ forceRedirectUrl: window.location.href })
								}}
								className="rounded-full bg-neutral-950 py-3 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950"
							>
								{tAccount('log_in')}
							</button>
							<button
								type="button"
								onClick={() => {
									onClickClose?.()
									openSignUp({ forceRedirectUrl: window.location.href })
								}}
								className="rounded-full border border-neutral-300 py-3 text-sm font-semibold dark:border-neutral-700"
							>
								{tAccount('sign_up')}
							</button>
						</div>
					)}
					<Row href={ACCOUNT_LINKS.blog} onClick={onClickClose}>{t('blog')}</Row>
					<Row href={ACCOUNT_LINKS.partner} onClick={onClickClose}>{t('partner')}</Row>
					<Row href={ACCOUNT_LINKS.help} onClick={onClickClose}>{t('help')}</Row>
				</Section>
			</div>

			<div className="flex items-center justify-between border-t border-neutral-100 px-5 py-4 dark:border-neutral-900">
				<LanguagePreferencesModal variant={'footer'} />
				<a
					href="https://www.instagram.com/travsusofficial"
					target="_blank"
					rel="noopener noreferrer"
					aria-label="Instagram"
					className="grid h-10 w-10 place-items-center rounded-full bg-neutral-100 dark:bg-neutral-900"
				>
					<Instagram className="h-5 w-5" />
				</a>
			</div>
		</div>
	)
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<section>
			<h2 className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">{title}</h2>
			<div className="space-y-0.5">{children}</div>
		</section>
	)
}

function Row({ href, onClick, children }: { href: string; onClick?: () => void; children: React.ReactNode }) {
	return (
		<Link href={href as any} onClick={onClick} className={rowClass}>
			{children}
			<ArrowUpRight className="h-4 w-4 text-neutral-400" />
		</Link>
	)
}

export default NavMobile
