'use client'

import {
	HeartIcon,
	MagnifyingGlassIcon,
	UserCircleIcon,
} from '@heroicons/react/24/outline'
import React, { useEffect, useRef } from 'react'
import { PathName } from '@/routers/types'
import MenuBar from '@/shared/MenuBar'
import isInViewport from '@/utils/isInViewport'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { House } from '@phosphor-icons/react'
import { useSession } from 'next-auth/react'
import { useAuthAction } from '@/app/hooks/useAuthAction'
import Avatar from '@/shared/Avatar'
import { useSelector } from 'react-redux'
import { useTranslations } from '@/lib/i18n'

let WIN_PREV_POSITION = 0
if (typeof window !== 'undefined') {
	WIN_PREV_POSITION = window.pageYOffset
}

interface NavItem {
	name: string
	link?: PathName
	icon: any
	authRequired?: boolean
}

const NAV: NavItem[] = [
	{
		name: 'Travsus',
		link: '/',
		icon: House,
	},
	{
		name: 'Wishlists',
		link: '/account-settings-savelists',
		icon: HeartIcon,
		authRequired: true,
	},
	{
		name: 'Log in',
		link: '/account-settings',
		icon: UserCircleIcon,
		authRequired: true,
	},
	{
		name: 'Menu',
		icon: MenuBar,
	},
]

const FooterNav = () => {
	const t = useTranslations('components_FooterNav')
	const containerRef = useRef<HTMLDivElement>(null)
	const pathname = usePathname()
	const Router = useRouter()
	const { data: session } = useSession()
	const user = useSelector((state: any) => state.userReducer.userData)
	const profileImageUrl = user?.profileImage?.url
	const isUserLoggedIn = !!user

	const handleSignIn = useAuthAction(async () => {
		// Add your sign-in logic here
		console.log('Sign in action')
	})

	useEffect(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('scroll', handleEvent)
		}

		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('scroll', handleEvent)
			}
		}
	}, [])

	const handleEvent = () => {
		if (typeof window !== 'undefined') {
			window.requestAnimationFrame(showHideHeaderMenu)
		}
	}

	const showHideHeaderMenu = () => {
		let currentScrollPos = window.pageYOffset
		if (!containerRef.current) return

		// SHOW _ HIDE MAIN MENU
		if (currentScrollPos > WIN_PREV_POSITION) {
			if (
				isInViewport(containerRef.current) &&
				currentScrollPos - WIN_PREV_POSITION < 80
			) {
				return
			}

			containerRef.current.classList.add('FooterNav--hide')
		} else {
			if (
				!isInViewport(containerRef.current) &&
				WIN_PREV_POSITION - currentScrollPos < 80
			) {
				return
			}
			containerRef.current.classList.remove('FooterNav--hide')
		}

		WIN_PREV_POSITION = currentScrollPos
	}

	const renderItem = (item: NavItem, index: number) => {
		const isActive = pathname === item.link
		const isAuthenticated = !!session

		if (item.name === 'Log in' && isAuthenticated) {
			return (
				<div
					onMouseDown={() => Router.push('/account-settings')}
					key={index}
					className={`flex flex-col items-center justify-between text-neutral-500 dark:text-neutral-300/90`}
				>
					<Avatar
						sizeClass="h-6 w-6"
						imgUrl={profileImageUrl}
						userName={user?.accountData?.firstname || 'User'}
					/>
					<span className="mt-1 text-[11px] leading-none">
						{user?.accountData?.firstname
							? user.accountData.firstname.slice(0, 6) + '...'
							: t('components_FooterNav_User')}
					</span>
				</div>
			)
		}
		// console.log('isAuthenticated:', isAuthenticated)
		if (item.authRequired && !isAuthenticated) {
			return (
				<button
					key={index}
					onClick={handleSignIn}
					className={`flex flex-col items-center justify-between text-neutral-500 dark:text-neutral-300/90`}
				>
					<item.icon className={`h-6 w-6`} />
					<span className="mt-1 text-[11px] leading-none">
						{item.name === 'Log in'
							? t('components_FooterNav_Sign_In')
							: t(`components_FooterNav_${item.name.replace(' ', '_')}`)}
					</span>
				</button>
			)
		}

		return item.link ? (
			<Link
				key={index}
				href={item.link}
				className={`flex flex-col items-center justify-between text-neutral-500 dark:text-neutral-300/90 ${
					isActive ? 'text-neutral-900 dark:text-neutral-100' : ''
				}`}
			>
				<item.icon className={`h-6 w-6 ${isActive ? 'text-red-600' : ''}`} />
				<span
					className={`mt-1 text-[11px] leading-none ${
						isActive ? 'text-red-600' : ''
					}`}
				>
					{t(`components_FooterNav_${item.name.replace(' ', '_')}`)}
				</span>
			</Link>
		) : (
			<div
				key={index}
				className={`flex flex-col items-center justify-between text-neutral-500 dark:text-neutral-300/90 ${
					isActive ? 'text-neutral-900 dark:text-neutral-100' : ''
				}`}
			>
				<item.icon iconClassName="w-6 h-6" className={``} />
				<span className="mt-1 text-[11px] leading-none">
					{t(`components_FooterNav_${item.name.replace(' ', '_')}`)}
				</span>
			</div>
		)
	}

	return (
		<div
			ref={containerRef}
			className="FooterNav fixed inset-x-0 bottom-0 top-auto z-1 block border-t border-neutral-300 bg-white p-2 transition-transform duration-300 ease-in-out dark:border-neutral-700 dark:bg-neutral-800 md:!hidden"
		>
			<div className="mx-auto flex w-full max-w-lg justify-around text-center text-sm">
				{/* MENU */}
				{NAV.map(renderItem)}
			</div>
		</div>
	)
}

export default FooterNav
