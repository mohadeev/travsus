'use client'
// Site header, TripAdvisor layout: the logo on the left, the travelers' links
// in the middle (bold pills), language and a black "Log In" pill on the right
// (the account menu once signed in). White, with a soft shadow once the page
// scrolls. Rendered on the server too, so links are crawlable.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useClerk, useUser } from '@clerk/nextjs'
import { useTranslations } from 'next-intl'
import Logo from '@/shared/Logo'
import MenuBar from '@/shared/MenuBar'
import { ACCOUNT_LINKS } from '@/constants/siteNav'
import { useTranslations as useOldTranslations } from '@/lib/i18n'
import AvatarDropdown from './AvatarDropdown'
import LanguagePreferencesModal from './LanguagePreferencesModal'

export default function HeaderBar() {
	const t = useTranslations('Nav')
	const tAccount = useOldTranslations('AvatarDropdown')
	const pathname = usePathname()
	const { isLoaded, isSignedIn } = useUser()
	const { openSignIn } = useClerk()
	const [scrolled, setScrolled] = useState(false)
	// Tour pages (address ends in the tour id): the header scrolls away with the
	// page, so the tour's own tabs can stay at the top of the screen
	const onTourPage = /\/[0-9a-f]{24}\/?$/.test(pathname ?? '')

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 4)
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	const link = (href: string, label: string, active: boolean) => (
		<Link
			href={href as any}
			aria-current={active ? 'page' : undefined}
			className="rounded-full px-3.5 py-2.5 text-base font-bold text-black transition hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-800"
		>
			{label}
		</Link>
	)

	return (
		<header
			className={`${onTourPage ? 'relative' : 'sticky top-0'} z-40 bg-white transition-shadow duration-200 dark:bg-neutral-950 ${
				scrolled && !onTourPage ? 'shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : ''
			}`}
		>
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-black focus:px-4 focus:py-2 focus:text-white"
			>
				{t('skip')}
			</a>

			<div className="mx-auto grid h-[60px] max-w-7xl grid-cols-[1fr_auto] items-center px-6 sm:h-[72px] lg:grid-cols-[1fr_auto_1fr]">
				<Logo className="w-24 shrink-0 justify-self-start sm:w-28" />

				<nav aria-label={t('explore')} className="hidden items-center gap-1 lg:flex">
					{link('/search?query=', t('all_tours'), !!pathname?.includes('/search'))}
					{link(ACCOUNT_LINKS.blog, t('blog'), !!pathname?.includes('/blog'))}
					{link(ACCOUNT_LINKS.help, t('help'), !!pathname?.includes('/contact'))}
					{link(ACCOUNT_LINKS.partner, t('partner'), !!pathname?.includes('/affiliates'))}
				</nav>

				<div className="flex items-center gap-1 justify-self-end text-black dark:text-white">
					{/* Language, beside the account: on phones too */}
					<LanguagePreferencesModal variant={'nav'} />
					{/* Most visitors aren't signed in: the pill shows from the first paint */}
					{!(isLoaded && isSignedIn) ? (
						<button
							type="button"
							onClick={() => openSignIn({ forceRedirectUrl: window.location.href })}
							className="ml-1 rounded-full bg-black px-[18px] py-3 text-base font-bold leading-none text-white transition hover:bg-neutral-800 dark:bg-white dark:text-black"
						>
							{tAccount('log_in')}
						</button>
					) : (
						<AvatarDropdown />
					)}
					<MenuBar className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-neutral-100 lg:hidden dark:hover:bg-neutral-800" iconClassName="h-5 w-5" />
				</div>
			</div>
		</header>
	)
}
