'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from './language-provider'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Logo from '@/shared/Logo'

export default function TourHeader() {
	const { language, setLanguage, t, getLocalizedHref } = useLanguage()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

	const languages = [
		{ code: 'en', name: 'English' },
		{ code: 'es', name: 'Español' },
		{ code: 'it', name: 'Italiano' },
		{ code: 'pt', name: 'Português' },
		{ code: 'zh', name: '中文' },
		{ code: 'eu', name: 'Euskara' },
	]

	return (
		<header className="w-full bg-white">
			{/* Bottom navigation bar */}
			<div className="border-b border-t border-gray-200">
				<div className="container mx-auto flex items-center justify-between px-4 py-3">
					<div className="flex items-center">
						<div className="relative z-10 mr-12 hidden flex-1 items-center md:flex">
							<Logo />
						</div>

						<nav className="hidden gap-10 md:flex">
							<Link
								href={getLocalizedHref('#itinerary')}
								className="text-sm font-medium transition-colors hover:text-black"
							>
								{t('nav.itinerary')}
							</Link>
							<Link
								href={getLocalizedHref('#pricing')}
								className="text-sm font-medium transition-colors hover:text-black"
							>
								{t('nav.pricing')}
							</Link>
							<Link
								href={getLocalizedHref('#faq')}
								className="text-sm font-medium transition-colors hover:text-black"
							>
								{t('nav.faq')}
							</Link>
							<Link
								href={getLocalizedHref('#contact')}
								className="text-sm font-medium transition-colors hover:text-black"
							>
								{t('nav.contact')}
							</Link>
						</nav>
					</div>

					<div className="flex items-center gap-4">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button
									type="button"
									className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white focus:outline-none"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="h-5 w-5"
									>
										<circle cx="12" cy="12" r="10"></circle>
										<line x1="2" y1="12" x2="22" y2="12"></line>
										<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
									</svg>
									<span className="sr-only">Change language</span>
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="bg-white">
								{languages.map((lang) => (
									<DropdownMenuItem
										key={lang.code}
										className={language === lang.code ? 'bg-muted' : ''}
										onClick={() => setLanguage(lang.code as any)}
									>
										{lang.name}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>

						<Link href={getLocalizedHref('#pricing')}>
							<Button
								className="rounded-full bg-black px-6 hover:bg-gray-800"
							>
								{t('nav.book')}
							</Button>
						</Link>
					</div>
				</div>
			</div>

			{/* Mobile menu - hidden by default */}
			{mobileMenuOpen && (
				<div className="border-t border-gray-200 md:hidden">
					<div className="space-y-1 px-4 py-3">
						<Link
							href={getLocalizedHref('#itinerary')}
							className="hover:bg-muted block rounded-md px-3 py-2 text-base font-medium"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t('nav.itinerary')}
						</Link>
						<Link
							href={getLocalizedHref('#pricing')}
							className="hover:bg-muted block rounded-md px-3 py-2 text-base font-medium"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t('nav.pricing')}
						</Link>
						<Link
							href={getLocalizedHref('#faq')}
							className="hover:bg-muted block rounded-md px-3 py-2 text-base font-medium"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t('nav.faq')}
						</Link>
						<Link
							href={getLocalizedHref('#contact')}
							className="hover:bg-muted block rounded-md px-3 py-2 text-base font-medium"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t('nav.contact')}
						</Link>
					</div>
				</div>
			)}
		</header>
	)
}
