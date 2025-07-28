'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import Logo from '@/shared/Logo'
import useOutsideAlerter from '@/hooks/useOutsideAlerter'
import NotifyDropdown from './NotifyDropdown'
import AvatarDropdown from './AvatarDropdown'
import MenuBar from '@/shared/MenuBar'
import { SearchTab } from '../(HeroSearchForm)/HeroSearchForm'
import HeroSearchForm2MobileFactory from '../(HeroSearchForm2Mobile)/HeroSearchForm2MobileFactory'
import { useTranslations } from '@/lib/i18n'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import HeroSearchFormSmall from '../(HeroSearchFormSmall)/HeroSearchFormSmall'
import { StaySearchFormFields } from '../type'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import LanguagePreferencesModal from './LanguagePreferencesModal'

interface Header3Props {
	className?: string
}

let WIN_PREV_POSITION = 0
if (typeof window !== 'undefined') {
	WIN_PREV_POSITION = (window as any).pageYOffset
}

const Header3: FC<Header3Props> = ({ className = '' }) => {
	const headerT = useTranslations('header')
	const headerInnerRef = useRef<HTMLDivElement>(null)
	const [showHeroSearch, setShowHeroSearch] =
		useState<StaySearchFormFields | null>()
	const [currentTab, setCurrentTab] = useState<SearchTab>('Experiences')

	useOutsideAlerter(headerInnerRef, () => {
		setShowHeroSearch(null)
		setCurrentTab('Experiences')
	})

	let pathname = usePathname()

	useEffect(() => {
		setShowHeroSearch(null)
	}, [pathname])

	useEffect(() => {
		window.addEventListener('scroll', handleEvent)
		return () => {
			window.removeEventListener('scroll', handleEvent)
		}
	}, [])

	const handleEvent = () => {
		window.requestAnimationFrame(handleHideSearchForm)
	}

	const handleHideSearchForm = () => {
		if (!document.querySelector('#nc-Header-3-anchor')) return
		let currentScrollPos = window.pageYOffset
		if (
			WIN_PREV_POSITION - currentScrollPos > 100 ||
			WIN_PREV_POSITION - currentScrollPos < -100
		) {
			setShowHeroSearch(null)
		}
		WIN_PREV_POSITION = currentScrollPos
	}

	const renderHeroSearch = () => (
		<div
			className={`absolute inset-x-0 top-0 transition-all will-change-[transform,opacity] ${
				showHeroSearch
					? 'visible'
					: 'pointer-events-none invisible -translate-x-0 -translate-y-[90px] scale-x-[0.395] scale-y-[0.6] opacity-0'
			}`}
		>
			<div className="mx-auto w-full max-w-4xl pb-6">
				<HeroSearchFormSmall
					defaultFieldFocus={showHeroSearch || undefined}
					onTabChange={setCurrentTab}
					defaultTab={currentTab}
				/>
			</div>
		</div>
	)

	const renderButtonOpenHeroSearch = () => (
		<div
			className={`dark:border-neutral-6000 relative flex w-full items-center justify-between rounded-full border border-neutral-200 bg-white shadow transition-all hover:shadow-md ${
				showHeroSearch
					? 'pointer-events-none invisible -translate-x-0 translate-y-20 scale-x-[2.55] scale-y-[1.8] opacity-0'
					: 'visible'
			}`}
		>
			<div className="flex items-center text-sm font-medium">
				<span
					onClick={() => setShowHeroSearch('location')}
					className="block cursor-pointer py-3 pl-5 pr-4"
				>
					{headerT('header_Location')}
				</span>
				<span className="h-5 w-[1px] bg-neutral-300 dark:bg-neutral-700"></span>
				<span
					onClick={() => setShowHeroSearch('dates')}
					className="block cursor-pointer px-4 py-3"
				>
					{headerT('header_CheckIn')}
				</span>
				<span className="h-5 w-[1px] bg-neutral-300 dark:bg-neutral-700"></span>
				<span
					onClick={() => setShowHeroSearch('guests')}
					className="block cursor-pointer px-4 py-3 font-normal"
				>
					{headerT('header_AddGuests')}
				</span>
			</div>
			<div
				className="ml-auto flex-shrink-0 cursor-pointer pr-2"
				onClick={() => setShowHeroSearch('location')}
			>
				<span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
					<MagnifyingGlassIcon className="h-5 w-5" />
				</span>
			</div>
		</div>
	)

	const [showDiv, setShowDiv] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setShowDiv(window.scrollY >= 50)
		}

		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<>
			<div
				className={`nc-Header nc-Header-3 fixed inset-0 top-0 z-40 bg-black/30 transition-opacity will-change-[opacity] dark:bg-black/50 ${
					showHeroSearch ? 'visible' : 'pointer-events-none invisible opacity-0'
				}`}
			></div>
			{showHeroSearch && <div id="nc-Header-3-anchor"></div>}
			<header ref={headerInnerRef} className={`sticky top-0 z-40 ${className}`}>
				<div
					className={`absolute inset-x-0 top-0 h-full transition-transform will-change-[transform,opacity] dark:bg-neutral-900 ${
						showHeroSearch ? 'duration-75' : ''
					} ${
						showHeroSearch
							? currentTab === 'Cars' || currentTab === 'Flights'
								? 'scale-y-[4.4]'
								: 'scale-y-[3.4]'
							: ''
					} ${showDiv && 'bg-white'} ${showHeroSearch && 'bg-white'}`}
				></div>

				<div className="relative flex h-[88px] px-4 lg:container">
					<div className="flex flex-1 justify-between">
						<div className="relative z-10 hidden flex-1 items-center md:flex">
							<Logo />
						</div>

						<div className="mx-auto flex flex-[2] lg:flex-none">
							<div className="hidden flex-1 self-center lg:flex">
								{renderButtonOpenHeroSearch()}
							</div>
							<div className="mx-auto w-full max-w-lg flex-1 self-center md:hidden">
								<HeroSearchForm2MobileFactory />
							</div>
							{renderHeroSearch()}
						</div>

						<div className="relative z-10 hidden flex-1 justify-end text-neutral-700 dark:text-neutral-100 md:flex">
							<div className="flex space-x-1">
								<LanguagePreferencesModal variant={'nav'} />
								<NotifyDropdown />
								<AvatarDropdown />
								<MenuBar />
							</div>
						</div>
					</div>
				</div>
			</header>
		</>
	)
}

export default Header3
