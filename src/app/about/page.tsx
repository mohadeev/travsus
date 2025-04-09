'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
	Smartphone,
	Calendar,
	Clock,
	CreditCard,
	TrendingUp,
	RefreshCcw,
} from 'lucide-react'
import { useRef } from 'react'
import AnimatedFeatures from '@/components/AnimatedFeatures'
// import AnimatedFeatures from '@/components/AnimatedFeatures'

function AnimatedSection({ children, className }) {
	const ref = useRef(null)
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'end start'],
	})

	const y = useTransform(scrollYProgress, [0, 1], [100, -100])
	const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.05, 0.9])
	const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.6, 1, 0.6])

	return (
		<motion.div ref={ref} style={{ y, scale, opacity }} className={className}>
			{children}
		</motion.div>
	)
}

export default function PageAbout() {
	return (
		<div className="relative overflow-hidden bg-white">
			{/* Hero Section */}
			<AnimatedSection className="pb-8 pt-16">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-5xl text-center">
						<motion.h1
							initial={{ opacity: 0, y: -50 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="mb-6 text-7xl font-black tracking-tight md:text-8xl"
						>
							Simplicity <span className="">in travel.</span>
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="mx-auto mb-8 max-w-3xl text-2xl font-medium leading-tight text-[#1d1d1f] md:text-3xl"
						>
							Travsus revolutionizes your journey from dream to destination.
						</motion.p>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.6 }}
							className="mx-auto max-w-4xl text-xl leading-relaxed text-[#86868b] md:text-2xl"
						>
							From flights to accommodations, activities to local insights —
							everything is quick to arrange, intuitive to manage, and comes
							with advanced protection built in. When you need guidance, our
							Travel Experts are available at no cost. It's everything you need
							for your journey — all in one place.
						</motion.p>
					</div>
				</div>
			</AnimatedSection>

			{/* Image Section 1 */}
			<AnimatedSection className="py-8">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-[1000px]">
						<div className="relative h-0 overflow-hidden rounded-3xl pb-[75%] md:pb-[56.25%]">
							<Image
								src="https://www.travsus.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Ftravsus%2Fimage%2Fupload%2Fv1743069126%2Fcountries%2Fcountry_67e120a234623c9e568da2a9.jpg&w=1920&q=75"
								alt="Dramatic mountain landscape with person"
								fill
								className="object-cover"
								priority
							/>
							<div className="absolute inset-0 flex items-end bg-black bg-opacity-30 p-4 md:p-8 lg:p-12">
								<motion.h2
									initial={{ opacity: 0, x: -50 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.8, delay: 0.4 }}
									className="text-2xl font-bold leading-tight text-white md:text-3xl lg:text-5xl"
								>
									Discover breathtaking destinations with expert guidance
								</motion.h2>
							</div>
						</div>
					</div>
				</div>
			</AnimatedSection>

			{/* Features Section */}
			<AnimatedSection className="bg-gradient-to-b from-white to-gray-50 py-24">
				<div className="container mx-auto px-4">
					<AnimatedFeatures />
				</div>
			</AnimatedSection>

			{/* Expert Section */}
			<AnimatedSection className="bg-[#f5f5f7] py-16">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-5xl">
						<div className="mb-12 text-center">
							<motion.h2
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.2 }}
								className="mb-6 text-7xl font-black tracking-tight text-[#1d1d1f]"
							>
								Real experts.
							</motion.h2>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.4 }}
								className="mb-4 text-2xl font-medium text-[#1d1d1f]"
							>
								Our travel experts bring years of experience to create your
								perfect trip.
							</motion.p>
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.6 }}
								className="mx-auto max-w-4xl text-xl text-[#86868b]"
							>
								With Travsus, you're not just getting a travel app – you're
								gaining access to a team of passionate travel experts with deep
								knowledge of destinations worldwide. Our experts curate unique
								experiences, provide insider tips, and ensure your journey is
								nothing short of extraordinary.
							</motion.p>
						</div>
						<div className="grid gap-8 md:grid-cols-2">
							<motion.div
								initial={{ opacity: 0, x: -50 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.8, delay: 0.4 }}
								className="relative h-[400px] overflow-hidden rounded-3xl md:h-[600px] lg:h-[800px]"
							>
								<Image
									src="https://images.pexels.com/photos/13923489/pexels-photo-13923489.jpeg"
									alt="Beautiful destination"
									fill
									className="object-cover"
								/>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, x: 50 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.8, delay: 0.6 }}
								className="relative h-[400px] overflow-hidden rounded-3xl md:h-[600px] lg:h-[800px]"
							>
								<Image
									src="https://images.pexels.com/photos/17087507/pexels-photo-17087507/free-photo-of-tourists-with-a-tour-guide.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
									alt="Scenic travel location"
									fill
									className="object-cover"
								/>
							</motion.div>
						</div>
					</div>
				</div>
			</AnimatedSection>

			{/* Stats Section */}
			<AnimatedSection className="py-16">
				<div className="container mx-auto px-4">
					<div className="mx-auto grid max-w-6xl gap-12 text-center md:grid-cols-3">
						{[
							{
								number: '150+',
								text: 'Destinations',
								description:
									'Explore a world of possibilities with our extensive network of destinations.',
							},
							{
								number: '24/7',
								text: 'Expert Support',
								description:
									"Round-the-clock assistance ensures you're never alone on your journey.",
							},
							{
								number: '1M+',
								text: 'Happy Travelers',
								description:
									'Join our community of satisfied globetrotters and create lasting memories.',
							},
						].map((stat, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 50 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 0.2 * index }}
							>
								<h3 className="mb-4 text-6xl font-black text-[#1d1d1f]">
									{stat.number}
								</h3>
								<p className="mb-2 text-xl font-medium text-[#86868b]">
									{stat.text}
								</p>
								<p className="text-lg text-[#1d1d1f]">{stat.description}</p>
							</motion.div>
						))}
					</div>
				</div>
			</AnimatedSection>

			{/* Testimonial Section */}
			<AnimatedSection className="bg-[#f5f5f7] py-16">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-4xl text-center">
						<motion.h2
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.2 }}
							className="mb-8 text-5xl font-bold text-[#1d1d1f]"
						>
							What Our Travelers Say
						</motion.h2>
						<motion.blockquote
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.4 }}
							className="mb-6 text-2xl italic text-[#1d1d1f]"
						>
							"Travsus transformed the way I travel. Their expert
							recommendations and seamless booking process made my trip to Bali
							unforgettable. I can't imagine planning a vacation without them
							now!"
						</motion.blockquote>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, delay: 0.6 }}
							className="text-xl font-medium text-[#86868b]"
						>
							- Sarah T., Adventure Enthusiast
						</motion.p>
					</div>
				</div>
			</AnimatedSection>

			{/* CTA Section */}
			<AnimatedSection className="py-16">
				<div className="container mx-auto px-4 text-center">
					<motion.h2
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="mb-6 text-5xl font-black text-[#1d1d1f]"
					>
						Ready to start your journey?
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="mx-auto mb-8 max-w-2xl text-xl text-[#86868b]"
					>
						Join thousands of satisfied travelers who have discovered the ease
						and joy of exploring the world with Travsus. Your next adventure is
						just a click away.
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.6 }}
						className="flex justify-center"
					>
						<Button asChild>
							<Link href="/contact">Get in touch</Link>
						</Button>
					</motion.div>
				</div>
			</AnimatedSection>
		</div>
	)
}
