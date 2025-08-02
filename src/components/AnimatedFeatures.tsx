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
import { useTranslations } from '@/lib/i18n'

const features = [
	{
		title: 'components_AnimatedFeatures_Personal_Travel_Assistant',
		description: 'components_AnimatedFeatures_Personal_Travel_Assistant_Description',
		items: [
			{ icon: Clock, text: 'components_AnimatedFeatures_24_7_Personalized_Support' },
			{ icon: Smartphone, text: 'components_AnimatedFeatures_AI_Driven_Recommendations' },
			{ icon: RefreshCcw, text: 'components_AnimatedFeatures_Real_Time_Itinerary_Updates' },
		],
		image: 'https://res.cloudinary.com/travsus/image/upload/v1744151941/brandmoment2_size-desktop_zcojix.jpg',
		alt: 'components_AnimatedFeatures_AI_Powered_Travel_Assistant',
	},
	{
		title: 'components_AnimatedFeatures_Smart_Booking',
		description: 'components_AnimatedFeatures_Smart_Booking_Description',
		items: [
			{ icon: CreditCard, text: 'components_AnimatedFeatures_One_Tap_Booking_For_All_Your_Needs' },
			{ icon: TrendingUp, text: 'components_AnimatedFeatures_Price_Prediction_And_Alerts' },
			{ icon: Calendar, text: 'components_AnimatedFeatures_Flexible_Cancellation_Options' },
		],
		image: 'https://images.pexels.com/photos/7412069/pexels-photo-7412069.jpeg',
		alt: 'components_AnimatedFeatures_Smart_Booking_System',
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
	const t = useTranslations("components_AnimatedFeatures")

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
						className={`mb-4 text-4xl font-bold text-gray-900 ${t(feature.title) === 'Smart Booking' ? 'font-extrabold' : ''}`}
					>
						{t(feature.title)}
					</motion.h2>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="mb-8 text-sm font-normal leading-relaxed text-black"
					>
						{t(feature.description)}
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
								<span className="text-sm">{t(item.text)}</span>
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
							alt={t(feature.alt)}
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