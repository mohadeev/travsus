'use client'

import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { motion } from 'framer-motion'
import Logo from '@/shared/Logo'
import { footerLinks } from '@/constants/footerLinks'
import type { Route } from 'next'

export default function Footer() {
	const currentYear = new Date().getFullYear()

	return (
		<footer className="bg-[#f5f5f7] text-black">
			<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
				<div className="mb-8 flex justify-center">
					<Link href="/" className="inline-block">
						<Logo />
					</Link>
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
							<span className="sr-only">Instagram</span>
							<Instagram className="h-6 w-6" aria-hidden="true" />
						</Link>
					</motion.div>
				</div>

				<p className="mt-8 text-center text-xs leading-5">
					Copyright © {currentYear} TRAVSUS LTD. All rights reserved.
				</p>

				<p className="mt-4 text-center text-[10px] leading-4 text-gray-600">
					All prices are subject to availability and may change without notice.
					Additional taxes and fees may apply. Travel insurance is highly
					recommended.
					<br /> We are not responsible for unforeseen cancellations or delays.
					Passports and visas are the responsibility of the traveler. <br />
					Please check entry requirements before booking. Airline schedules and
					hotel availability are subject to change. We do not guarantee specific
					accommodations or flight times. We are not liable for any losses,
					damages, or injuries incurred during travel. Special promotions and
					discounts are subject to terms and conditions.
					<br /> Blackout dates may apply. <br />
					We act solely as an agent for airlines, hotels, and tour operators and
					are not responsible for their actions or policies. Cancellation and
					refund policies vary by provider. <br />
					Please review terms before booking.
				</p>
			</div>
		</footer>
	)
}
