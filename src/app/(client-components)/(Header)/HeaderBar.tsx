'use client'
// Site header, TripAdvisor-style and minimal: one row with the logo, a glowing
// "Become a partner" pill, a couple of links and the account icons. The
// categories live in the home page chips and the mobile menu. Rendered on the
// server too, so links are crawlable.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Search, Sparkles } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Logo from '@/shared/Logo'
import MenuBar from '@/shared/MenuBar'
import { ACCOUNT_LINKS } from '@/constants/siteNav'
import AvatarDropdown from './AvatarDropdown'
import LanguagePreferencesModal from './LanguagePreferencesModal'

const icon = 'grid h-10 w-10 place-items-center rounded-full transition hover:bg-neutral-100 dark:hover:bg-neutral-800'

export default function HeaderBar() {
	const t = useTranslations('Nav')
	const tHome = useTranslations('Home')
	const locale = useLocale()
	const pathname = usePathname()
	const [scrolled, setScrolled] = useState(false)
	// The home page has its own big search right below
	const home = pathname === `/${locale}` || pathname === '/'

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8)
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	const link = (href: string, label: string, active: boolean) => (
		<Link
			href={href as any}
			className={`rounded-full px-3 py-2 text-[15px] font-semibold transition hover:bg-neutral-100 dark:hover:bg-neutral-800 ${active ? 'text-neutral-950 dark:text-white' : 'text-neutral-800 dark:text-neutral-200'}`}
		>
			{label}
		</Link>
	)

	return (
		<header
			className={`sticky top-0 z-40 bg-white/90 backdrop-blur-xl transition-shadow dark:bg-neutral-950/90 ${
				scrolled ? 'shadow-[0_1px_12px_rgba(0,0,0,0.08)]' : ''
			}`}
		>
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-black focus:px-4 focus:py-2 focus:text-white"
			>
				{t('skip')}
			</a>

			<div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-5 sm:h-[72px]">
				<Logo className="w-24 shrink-0 sm:w-28" />

				<nav aria-label={t('explore')} className="ml-auto hidden items-center gap-1 lg:flex">
					<Link
						href={ACCOUNT_LINKS.partner as any}
						className="mr-3 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[15px] font-semibold text-neutral-950 shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_0_22px_-2px_rgba(0,0,0,0.28)] transition hover:shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_0_28px_0_rgba(0,0,0,0.35)] dark:bg-neutral-900 dark:text-white"
					>
						<Sparkles className="h-[18px] w-[18px]" />
						{t('partner')}
					</Link>
					{link('/search?query=', t('all_tours'), !!pathname?.includes('/search'))}
					{link(ACCOUNT_LINKS.blog, t('blog'), !!pathname?.includes('/blog'))}
				</nav>

				<div className="ml-auto flex items-center gap-0.5 text-neutral-900 lg:ml-3 dark:text-white">
					{!home && (
						<Link href={`/search?query=` as any} aria-label={tHome('search_cta')} className={icon}>
							<Search className="h-5 w-5" />
						</Link>
					)}
					<div className="hidden sm:block">
						<LanguagePreferencesModal variant={'nav'} />
					</div>
					<Link href={ACCOUNT_LINKS.saved as any} aria-label={t('saved')} className={`hidden sm:grid ${icon}`}>
						<Heart className="h-5 w-5" />
					</Link>
					<AvatarDropdown />
					<MenuBar className={`lg:hidden ${icon}`} iconClassName="h-5 w-5" />
				</div>
			</div>
		</header>
	)
}
