'use client'

import { useLanguage } from './language-provider'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function HeroSection() {
	const { t, getLocalizedHref } = useLanguage()

	return (
		<div className="relative h-[70vh] min-h-[600px] w-full overflow-hidden">
			{/* Hero Image */}
			<Image
				src="https://images.pexels.com/photos/1001435/pexels-photo-1001435.jpeg"
				alt="Morocco desert with camels and sunset"
				fill
				priority
				className="object-cover"
			/>

			{/* Dark overlay */}
			<div className="absolute inset-0 bg-black/40" />

			{/* Content */}
			<div className="container relative z-10 flex h-full flex-col items-center justify-center px-4 text-center text-white md:px-6">
				<motion.h1
					className="mb-4 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					{t('hero.title')}
				</motion.h1>

				<motion.p
					className="mb-6 max-w-2xl text-lg text-gray-200 sm:text-xl"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					{t('hero.subtitle')}
				</motion.p>

				{/* Price highlight */}
				<motion.div
					className="mb-8 flex items-center justify-center"
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
					<div className="rounded-full bg-white px-6 py-3 text-black shadow-lg">
						<span className="text-xl font-bold sm:text-2xl">80€</span>
						<span className="ml-1 text-sm sm:text-base"> per person</span>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<Link href={getLocalizedHref('#pricing')}>
						<Button
							size="lg"
							className="rounded-full bg-black px-8 text-white hover:bg-gray-800"
						>
							{t('hero.cta')}
						</Button>
					</Link>
				</motion.div>
			</div>
		</div>
	)
}
