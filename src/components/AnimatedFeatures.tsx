'use client'

import Image from 'next/image'
import {
	Smartphone,
	Calendar,
	Clock,
	CreditCard,
	TrendingUp,
	RefreshCcw,
} from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const features = [
	{
		title: 'Personal Travel Assistant',
		description:
			'Experience travel like never before with our AI-powered personal assistant. Get real-time recommendations, instant support, and tailored itineraries.',
		items: [
			{ icon: Clock, text: '24/7 personalized support' },
			{ icon: Smartphone, text: 'AI-driven recommendations' },
			{ icon: RefreshCcw, text: 'Real-time itinerary updates' },
		],
		image: 'https://res.cloudinary.com/travsus/image/upload/v1744151941/brandmoment2_size-desktop_zcojix.jpg',
		alt: 'AI-powered travel assistant',
	},
	{
		title: 'Smart Booking',
		description:
			'Say goodbye to complicated booking processes. Our smart booking system leverages cutting-edge technology to find you the best deals and options.',
		items: [
			{ icon: CreditCard, text: 'One-tap booking for all your needs' },
			{ icon: TrendingUp, text: 'Price prediction and alerts' },
			{ icon: Calendar, text: 'Flexible cancellation options' },
		],
		image: 'https://images.pexels.com/photos/7412069/pexels-photo-7412069.jpeg',
		alt: 'Smart booking system',
	},
]

function FeatureSection({ feature, index }) {
	const ref = useRef(null)
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'end start'],
	})

	const y = useTransform(scrollYProgress, [0, 1], [100, -100])
	const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.9])
	const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6])

	return (
		<motion.div
			ref={ref}
			style={{ y, scale, opacity }}
			className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${index === features.length - 1 ? '' : 'mb-20'}`}
		>
			<div className="lg:flex lg:items-center lg:justify-between">
				<div className="mb-10 lg:mb-0 lg:w-1/2 lg:pr-12">
					<motion.h2
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className={`mb-4 text-4xl font-bold text-gray-900 ${feature.title === 'Smart Booking' ? 'font-extrabold' : ''}`}
					>
						{feature.title}
					</motion.h2>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="mb-8 text-sm font-normal leading-relaxed text-black"
					>
						{feature.description}
					</motion.p>
					<ul className="space-y-4">
						{feature.items.map((item, itemIndex) => (
							<motion.li
								key={itemIndex}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.5, delay: 0.6 + itemIndex * 0.1 }}
								className="flex items-center space-x-4 text-gray-700"
							>
								<div className="rounded-full bg-black p-2">
									<item.icon className="h-5 w-5 text-white" />
								</div>
								<span className="text-sm">{item.text}</span>
							</motion.li>
						))}
					</ul>
				</div>
				<motion.div
					initial={{ opacity: 0, x: 50 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="lg:w-1/2"
				>
					<div className="relative h-[400px] overflow-hidden rounded-2xl shadow-lg">
						<Image
							src={feature.image || '/placeholder.svg'}
							alt={feature.alt}
							fill
							className="object-cover"
						/>
					</div>
				</motion.div>
			</div>
		</motion.div>
	)
}

export default function AnimatedFeatures() {
	return (
		<div className="bg-white py-20">
			{features.map((feature, index) => (
				<FeatureSection key={index} feature={feature} index={index} />
			))}
		</div>
	)
}
