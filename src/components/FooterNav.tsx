'use client'
// Phone tab bar: Home, Explore, Saved, Account, Menu. Hides while scrolling down.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Heart, Home, UserRound } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useAuth, useClerk } from '@clerk/nextjs'
import MenuBar from '@/shared/MenuBar'
import Avatar from '@/shared/Avatar'
import { useAppSelector } from '@/store/hooks'
import { selectUser } from '@/store/slices/user'
import { ACCOUNT_LINKS } from '@/constants/siteNav'

const tabClass = 'flex flex-1 flex-col items-center gap-1 py-1.5 text-[11px] font-medium'

export default function FooterNav() {
	const t = useTranslations('components_FooterNav')
	const tNav = useTranslations('Nav')
	const pathname = usePathname() ?? ''
	const { isSignedIn } = useAuth()
	const { openSignIn } = useClerk()
	const user = useAppSelector(selectUser)
	const [hidden, setHidden] = useState(false)

	useEffect(() => {
		let last = window.scrollY
		const onScroll = () => {
			const now = window.scrollY
			if (Math.abs(now - last) > 12) {
				setHidden(now > last && now > 120)
				last = now
			}
		}
		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	// "/en-US" and "/en-US/" are home; other tabs match by path start
	const isHome = /^\/[a-z]{2}-[A-Z]{2}\/?$/.test(pathname) || pathname === '/'
	const active = (path: string) => pathname.includes(path)
	const color = (on: boolean) =>
		on ? 'text-neutral-950 dark:text-white' : 'text-neutral-500 dark:text-neutral-400'

	// Saved and Account need an account: signed out, they open sign-in
	const needsAccount = (href: string, label: string, icon: React.ReactNode, on: boolean) =>
		isSignedIn ? (
			<Link href={href as any} className={`${tabClass} ${color(on)}`}>
				{icon}
				{label}
			</Link>
		) : (
			<button
				type="button"
				onClick={() => openSignIn({ forceRedirectUrl: window.location.origin + href })}
				className={`${tabClass} ${color(false)}`}
			>
				{icon}
				{label}
			</button>
		)

	return (
		<nav
			aria-label="Tabs"
			className={`fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-300 md:hidden dark:border-neutral-800 dark:bg-neutral-950/95 ${
				hidden ? 'translate-y-full' : ''
			}`}
		>
			<div className="mx-auto flex max-w-lg items-stretch px-2 py-1.5">
				<Link href={'/' as any} className={`${tabClass} ${color(isHome)}`}>
					<Home className="h-6 w-6" strokeWidth={isHome ? 2.2 : 1.6} />
					{t('components_FooterNav_Travsus')}
				</Link>
				<Link href={'/search?query=' as any} className={`${tabClass} ${color(active('/search'))}`}>
					<Compass className="h-6 w-6" strokeWidth={active('/search') ? 2.2 : 1.6} />
					{tNav('explore')}
				</Link>
				{needsAccount(
					ACCOUNT_LINKS.saved,
					t('components_FooterNav_Wishlists'),
					<Heart className="h-6 w-6" strokeWidth={active('savelists') ? 2.2 : 1.6} />,
					active('savelists'),
				)}
				{needsAccount(
					ACCOUNT_LINKS.account,
					isSignedIn ? user?.accountData?.firstname || tNav('account') : t('components_FooterNav_Sign_In'),
					user?.profileImage?.url ? (
						<Avatar sizeClass="h-6 w-6" imgUrl={user.profileImage.url} />
					) : (
						<UserRound className="h-6 w-6" strokeWidth={active('/account-settings') ? 2.2 : 1.6} />
					),
					active('/account-settings'),
				)}
				<div className={`${tabClass} ${color(false)}`}>
					<MenuBar className="h-6 w-6" iconClassName="h-6 w-6" />
					{tNav('menu')}
				</div>
			</div>
		</nav>
	)
}
