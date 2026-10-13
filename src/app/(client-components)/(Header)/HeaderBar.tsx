'use client'
// Site header (Zalando / Mobbin style): logo, search and account icons on top,
// a category bar underneath. Rendered on the server too, so links are crawlable.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Search } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import Logo from '@/shared/Logo'
import MenuBar from '@/shared/MenuBar'
import { ACCOUNT_LINKS, CATEGORY_LINKS, CITY_LINKS } from '@/constants/siteNav'
import AvatarDropdown from './AvatarDropdown'
import LanguagePreferencesModal from './LanguagePreferencesModal'

export default function HeaderBar() {
	const t = useTranslations('Nav')
	const tHome = useTranslations('Home')
	const locale = useLocale()
	const pathname = usePathname()
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8)
		onScroll()
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	return (
		<header
			className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur-xl transition-shadow dark:bg-neutral-950/90 ${
				scrolled
					? 'border-neutral-200 shadow-[0_1px_12px_rgba(0,0,0,0.06)] dark:border-neutral-800'
					: 'border-neutral-100 dark:border-neutral-900'
			}`}
		>
			<a
				href="#main"
				className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-black focus:px-4 focus:py-2 focus:text-white"
			>
				{t('skip')}
			</a>

			{/* Top row */}
			<div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-5 lg:gap-8">
				<Logo className="w-24 shrink-0" />

				<form
					action={`/${locale}/search`}
					method="get"
					role="search"
					className="hidden flex-1 items-center gap-3 rounded-full bg-neutral-100 px-4 ring-neutral-950 transition focus-within:bg-white focus-within:ring-2 md:flex lg:max-w-xl dark:bg-neutral-900"
				>
					<Search className="h-[18px] w-[18px] shrink-0 text-neutral-500" />
					<label className="flex-1">
						<span className="sr-only">{tHome('search_label')}</span>
						<input
							type="search"
							name="query"
							placeholder={tHome('search_placeholder')}
							className="w-full border-0 bg-transparent p-0 py-2.5 text-sm placeholder:text-neutral-500 focus:outline-none focus:ring-0"
						/>
					</label>
				</form>

				<div className="ml-auto flex items-center gap-1 text-neutral-900 dark:text-white">
					<Link
						href={`/search?query=` as any}
						aria-label={tHome('search_cta')}
						className="grid h-10 w-10 place-items-center rounded-full hover:bg-neutral-100 md:hidden dark:hover:bg-neutral-800"
					>
						<Search className="h-5 w-5" />
					</Link>
					<div className="hidden sm:block">
						<LanguagePreferencesModal variant={'nav'} />
					</div>
					<Link
						href={ACCOUNT_LINKS.saved as any}
						aria-label={t('saved')}
						className="hidden h-10 w-10 place-items-center rounded-full hover:bg-neutral-100 sm:grid dark:hover:bg-neutral-800"
					>
						<Heart className="h-5 w-5" />
					</Link>
					<AvatarDropdown />
					<MenuBar className="grid h-10 w-10 place-items-center rounded-full hover:bg-neutral-100 lg:hidden dark:hover:bg-neutral-800" iconClassName="h-5 w-5" />
				</div>
			</div>

			{/* Category bar */}
			<nav aria-label={t('explore')} className="mx-auto max-w-7xl px-5">
				<ul className="-mb-px flex items-center gap-6 overflow-x-auto text-sm font-medium [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
					<NavItem href="/search?query=" active={pathname?.includes('/search')}>
						{t('all_tours')}
					</NavItem>
					{CATEGORY_LINKS.map((link) => (
						<NavItem key={link.href} href={link.href}>
							{tHome(link.label)}
						</NavItem>
					))}
					<li aria-hidden className="h-4 w-px shrink-0 bg-neutral-200 dark:bg-neutral-800" />
					{CITY_LINKS.map((link) => (
						<NavItem key={link.href} href={link.href}>
							{link.label}
						</NavItem>
					))}
					<li className="ml-auto hidden shrink-0 lg:block">
						<Link
							href={ACCOUNT_LINKS.blog as any}
							className="py-3 text-neutral-500 transition hover:text-neutral-950 dark:hover:text-white"
						>
							{t('blog')}
						</Link>
					</li>
					<li className="hidden shrink-0 lg:block">
						<Link
							href={ACCOUNT_LINKS.partner as any}
							className="rounded-full bg-neutral-950 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
						>
							{t('partner')}
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	)
}

function NavItem({
	href,
	active = false,
	children,
}: {
	href: string
	active?: boolean
	children: React.ReactNode
}) {
	return (
		<li className="shrink-0">
			<Link
				href={href as any}
				className={`block border-b-2 py-3 transition ${
					active
						? 'border-neutral-950 text-neutral-950 dark:border-white dark:text-white'
						: 'border-transparent text-neutral-600 hover:border-neutral-300 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
				}`}
			>
				{children}
			</Link>
		</li>
	)
}
