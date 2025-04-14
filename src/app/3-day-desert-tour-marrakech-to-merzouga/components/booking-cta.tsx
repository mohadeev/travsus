'use client'

import { useLanguage } from './language-provider'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function BookingCTA() {
	const { t, getLocalizedHref } = useLanguage()

	return (
		<section className="relative flex items-center justify-center overflow-hidden bg-black py-16 md:py-20">
			<div className="container max-w-3xl px-4 md:px-6">
				<div className="text-center text-white">
					<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
						{t('booking.title')}
					</h2>
					<p className="mb-8 text-lg text-gray-300">{t('booking.subtitle')}</p>
					<div className="flex justify-center">
						<Link href={getLocalizedHref('#pricing')}>
							<button
								className="rounded-full bg-white px-8 py-3 font-medium text-black hover:bg-gray-100"
							>
								{t('booking.button')}
							</button>
						</Link>
					</div>
				</div>
			</div>

			{/* Background pattern */}
			<div className="absolute inset-0 -z-10 opacity-20">
				<svg
					width="100%"
					height="100%"
					viewBox="0 0 100 100"
					xmlns="http://www.w3.org/2000/svg"
				>
					<defs>
						<pattern
							id="pattern"
							width="10"
							height="10"
							patternUnits="userSpaceOnUse"
						>
							<circle cx="1" cy="1" r="1" fill="white" />
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#pattern)" />
				</svg>
			</div>
		</section>
	)
}
