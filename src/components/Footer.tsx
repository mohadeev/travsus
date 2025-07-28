'use client'

import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '@/shared/Logo'
import { footerLinks } from '@/constants/footerLinks'
import type { Route } from 'next'
import LanguagePreferencesModal from '@/app/(client-components)/(Header)/LanguagePreferencesModal'
import { useTranslations } from 'next-intl'

export default function Footer() {
	const currentYear = new Date().getFullYear()
	const t = useTranslations('footer')
	const to = useTranslations('UserProfile')

	return (
		<footer className="bg-[#f5f5f7] text-black">
			<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8 flex flex-col items-center justify-center">
					<Link href="/" className="inline-block">
						<Logo />
					</Link>
					<br />
					<LanguagePreferencesModal variant={'footer'} />
				</div>

				<nav
					className="flex flex-wrap justify-center gap-2 sm:gap-4"
					aria-label="Footer"
				>
					{footerLinks.map((link) => (
						<motion.div
							key={link.name}
							className="m-1"
							whileHover={{ y: -2 }}
							transition={{ duration: 0.2 }}
						>
							<Link
								href={link.href as Route}
								className="text-xs transition-colors duration-300 hover:text-gray-700"
							>
								{link.name}
							</Link>
						</motion.div>
					))}
				</nav>

				<div className="mt-8 flex justify-center">
					<motion.div
						whileHover={{ scale: 1.1 }}
						transition={{ duration: 0.2 }}
					>
						<Link
							href="https://www.instagram.com/travsusofficial"
							target="_blank"
							rel="noopener noreferrer"
							className="text-black transition-colors duration-300 hover:text-gray-700"
						>
							<span className="sr-only">{t('footer_Instagram')}</span>
							<Instagram className="h-6 w-6" aria-hidden="true" />
						</Link>
					</motion.div>
				</div>

				<p className="mt-8 text-center text-xs leading-5">
					{t('footer_Copyright', { year: 'sss' })}
				</p>
				{to('title')}

				<p className="mt-4 text-center text-[10px] leading-4 text-gray-600">
					{t('footer_Disclaimer')}
				</p>
				<p>{t('key', { name: "slkdvslkdv" })}</p>
			</div>
		</footer>
	)
}
