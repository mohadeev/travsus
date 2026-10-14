'use client'
// Account menu in the header: avatar button, then account links or sign in/up.
// Signed in or not comes from Clerk itself (the Redux user, loaded a moment
// later, only adds the TRAVSUS profile photo and name).
import { Fragment } from 'react'
import Link from 'next/link'
import { Popover, Transition } from '@headlessui/react'
import { useClerk, useUser } from '@clerk/nextjs'
import { useLocale } from 'next-intl'
import {
	CalendarCheck,
	Heart,
	LifeBuoy,
	LogIn,
	LogOut,
	UserRound,
	UserPlus,
	type LucideIcon,
} from 'lucide-react'
import Avatar from '@/shared/Avatar'
import { useAppSelector } from '@/store/hooks'
import { selectUser } from '@/store/slices/user'
import { useTranslations } from '@/lib/i18n'
import { ACCOUNT_LINKS } from '@/constants/siteNav'

const itemClass =
	'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-800 transition hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800'

export default function AvatarDropdown({ className = '' }: { className?: string }) {
	const t = useTranslations('AvatarDropdown')
	const locale = useLocale()
	const { isLoaded, isSignedIn, user: clerkUser } = useUser()
	const user = useAppSelector(selectUser)
	const { openSignIn, openSignUp, signOut } = useClerk()
	const isLoggedIn = isLoaded && !!isSignedIn
	const email = clerkUser?.primaryEmailAddress?.emailAddress ?? user?.email
	const imageUrl = user?.profileImage?.url || clerkUser?.imageUrl
	const name =
		[user?.accountData?.firstname, user?.accountData?.lastname].filter(Boolean).join(' ') || clerkUser?.fullName || ''

	// After signing in, stay on this page
	const returnHere = () => ({ forceRedirectUrl: window.location.href })

	const links: [string, string, LucideIcon][] = [
		['my_account', ACCOUNT_LINKS.account, UserRound],
		['my_bookings', ACCOUNT_LINKS.bookings, CalendarCheck],
		['wishlist', ACCOUNT_LINKS.saved, Heart],
		['help', ACCOUNT_LINKS.help, LifeBuoy],
	]

	return (
		<Popover className={`relative ${className}`}>
			{({ close }) => (
				<>
					<Popover.Button
						aria-label={t('my_account')}
						className="grid h-10 w-10 place-items-center rounded-full hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:hover:bg-neutral-800"
					>
						{isLoggedIn && imageUrl ? (
							<Avatar sizeClass="h-8 w-8" imgUrl={imageUrl} />
						) : (
							<UserRound className="h-5 w-5" />
						)}
					</Popover.Button>

					<Transition
						as={Fragment}
						enter="transition ease-out duration-150"
						enterFrom="opacity-0 translate-y-1"
						enterTo="opacity-100 translate-y-0"
						leave="transition ease-in duration-100"
						leaveFrom="opacity-100 translate-y-0"
						leaveTo="opacity-0 translate-y-1"
					>
						<Popover.Panel className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-neutral-200 bg-white p-2 shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:border-neutral-800 dark:bg-neutral-900">
							{isLoggedIn ? (
								<>
									<div className="flex items-center gap-3 px-3 py-3">
										<Avatar imgUrl={imageUrl} sizeClass="h-10 w-10" userName={name || email || 'T'} />
										<div className="min-w-0">
											<p className="truncate text-sm font-semibold">{name || email}</p>
											{name && <p className="truncate text-xs text-neutral-500">{email}</p>}
										</div>
									</div>
									<div className="my-1 h-px bg-neutral-100 dark:bg-neutral-800" />
									{links.map(([label, href, Icon]) => (
										<Link key={label} href={href as any} onClick={() => close()} className={itemClass}>
											<Icon className="h-[18px] w-[18px] text-neutral-500" />
											{t(label)}
										</Link>
									))}
									<div className="my-1 h-px bg-neutral-100 dark:bg-neutral-800" />
									<button
										type="button"
										onClick={() => {
											close()
											signOut({ redirectUrl: `/${locale}` })
										}}
										className={itemClass}
									>
										<LogOut className="h-[18px] w-[18px] text-neutral-500" />
										{t('log_out')}
									</button>
								</>
							) : (
								<>
									<div className="space-y-2 p-2">
										<button
											type="button"
											onClick={() => {
												close()
												openSignIn(returnHere())
											}}
											className="flex w-full items-center justify-center gap-2 rounded-full bg-neutral-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950"
										>
											<LogIn className="h-4 w-4" />
											{t('log_in')}
										</button>
										<button
											type="button"
											onClick={() => {
												close()
												openSignUp(returnHere())
											}}
											className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-300 px-4 py-2.5 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700"
										>
											<UserPlus className="h-4 w-4" />
											{t('sign_up')}
										</button>
									</div>
									<div className="my-1 h-px bg-neutral-100 dark:bg-neutral-800" />
									<Link href={ACCOUNT_LINKS.help as any} onClick={() => close()} className={itemClass}>
										<LifeBuoy className="h-[18px] w-[18px] text-neutral-500" />
										{t('help')}
									</Link>
								</>
							)}
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	)
}
