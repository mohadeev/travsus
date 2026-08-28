export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import {
	ArrowRight,
	Bell,
	Calendar,
	Check,
	MapPin,
	RefreshCw,
	Search,
	User,
	Sparkles,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion'
import { CountUp } from '@/components/count-up'
import { useMobile } from '@/hooks/use-mobile'

export default function ReferralProgramPage() {
	const isMobile = useMobile()
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
	const [isHovering, setIsHovering] = useState(false)
	const [calculatorValues, setCalculatorValues] = useState({
		bookingValue: 500,
		monthlyReferrals: 10,
		commissionTier: 10,
	})
	const [earnings, setEarnings] = useState({
		monthly: 500,
		annual: 6000,
	})

	const heroRef = useRef(null)
	const benefitsRef = useRef(null)
	const stepsRef = useRef(null)
	const commissionRef = useRef(null)
	const testimonialsRef = useRef(null)
	const faqRef = useRef(null)
	const ctaRef = useRef(null)

	const heroInView = useInView(heroRef, { once: false, amount: 0.2 })
	const benefitsInView = useInView(benefitsRef, { once: false, amount: 0.2 })
	const stepsInView = useInView(stepsRef, { once: false, amount: 0.2 })
	const commissionInView = useInView(commissionRef, {
		once: false,
		amount: 0.2,
	})
	const testimonialsInView = useInView(testimonialsRef, {
		once: false,
		amount: 0.2,
	})
	const faqInView = useInView(faqRef, { once: false, amount: 0.2 })
	const ctaInView = useInView(ctaRef, { once: false, amount: 0.2 })

	const { scrollYProgress } = useScroll()
	const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

	useEffect(() => {
		const handleMouseMove = (e) => {
			setCursorPosition({ x: e.clientX, y: e.clientY })
		}

		window.addEventListener('mousemove', handleMouseMove)
		return () => window.removeEventListener('mousemove', handleMouseMove)
	}, [])

	const calculateEarnings = () => {
		const monthly =
			calculatorValues.bookingValue *
			calculatorValues.monthlyReferrals *
			(calculatorValues.commissionTier / 100)
		setEarnings({
			monthly: monthly,
			annual: monthly * 12,
		})
	}

	useEffect(() => {
		calculateEarnings()
	}, [calculatorValues])

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setCalculatorValues((prev) => ({
			...prev,
			[name]: Number(value),
		}))
	}

	return (
		<div className="relative flex min-h-screen flex-col overflow-hidden">
			{!isMobile && isHovering && (
				<div
					className="pointer-events-none fixed z-50 h-8 w-8 rounded-full bg-[#1a1a1a] mix-blend-difference transition-transform duration-100 ease-out"
					style={{
						left: cursorPosition.x - 16,
						top: cursorPosition.y - 16,
						transform: `scale(${isHovering ? 1.5 : 1})`,
					}}
				/>
			)}

			<div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#f8f9fa] to-white opacity-50">
				<div
					className="absolute inset-0 bg-[url('/placeholder.svg?height=1000&width=1000')] bg-repeat opacity-5"
					style={{ backgroundPosition: `0 ${backgroundY.get()}px` }}
				/>
			</div>
			<main className="flex-1">
				<section
					ref={heroRef}
					className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32"
				>
					<div className="absolute inset-0 -z-10">
						<div className="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-[#f8f9fa] via-white to-[#f8f9fa] opacity-70" />
						<div className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1a1a1a]/5 blur-3xl" />
						<div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-[#1a1a1a]/5 blur-3xl" />
					</div>

					<div className="container relative px-4 md:px-6">
						<motion.div
							className="flex flex-col items-center justify-center space-y-4 text-center"
							initial={{ opacity: 0, y: 50 }}
							animate={
								heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
							}
							transition={{ duration: 0.7, delay: 0.2 }}
						>
							<motion.div
								className="space-y-2"
								initial={{ opacity: 0, y: 20 }}
								animate={
									heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
								}
								transition={{ duration: 0.7, delay: 0.4 }}
							>
								<motion.h1
									className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
									initial={{ opacity: 0, y: 20 }}
									animate={
										heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.7, delay: 0.6 }}
								>
									Share{' '}
									<span className="relative inline-block">
										Flexible
										<motion.span
											className="absolute -bottom-2 left-0 h-1 w-full bg-[#1a1a1a]"
											initial={{ width: 0 }}
											animate={heroInView ? { width: '100%' } : { width: 0 }}
											transition={{ duration: 0.8, delay: 1.2 }}
										/>
									</span>{' '}
									Travel, <br className="hidden sm:inline" />
									Earn{' '}
									<span className="bg-gradient-to-r from-[#1a1a1a] to-[#666666] bg-clip-text text-transparent">
										Rewards
									</span>
								</motion.h1>
								<motion.p
									className="text-muted-foreground mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
									initial={{ opacity: 0 }}
									animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
									transition={{ duration: 0.7, delay: 0.8 }}
								>
									Join the Travsus Affiliate Program and earn commission for
									every flexible booking you refer.
								</motion.p>
							</motion.div>
							<motion.div
								className="flex flex-col gap-3 min-[400px]:flex-row"
								initial={{ opacity: 0, y: 20 }}
								animate={
									heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
								}
								transition={{ duration: 0.7, delay: 1 }}
							>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onMouseEnter={() => setIsHovering(true)}
									onMouseLeave={() => setIsHovering(false)}
								>
									<Button
										size="lg"
										className="group relative w-full overflow-hidden bg-[#1a1a1a] hover:bg-[#333333] min-[400px]:w-auto"
									>
										<span className="relative z-10">Join Our Program</span>
										<motion.span
											className="absolute inset-0 z-0 bg-gradient-to-r from-[#333] to-[#666]"
											initial={{ x: '-100%' }}
											whileHover={{ x: 0 }}
											transition={{ duration: 0.4 }}
										/>
										<ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
									</Button>
								</motion.div>
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onMouseEnter={() => setIsHovering(true)}
									onMouseLeave={() => setIsHovering(false)}
								>
									<Button
										size="lg"
										variant="outline"
										className="group relative w-full overflow-hidden min-[400px]:w-auto"
									>
										<span className="relative z-10">Learn More</span>
										<motion.span
											className="absolute inset-0 z-0 bg-[#f8f9fa]"
											initial={{ y: '100%' }}
											whileHover={{ y: 0 }}
											transition={{ duration: 0.4 }}
										/>
									</Button>
								</motion.div>
							</motion.div>
						</motion.div>

						<motion.div
							className="mt-16 grid gap-8 md:grid-cols-3"
							initial={{ opacity: 0, y: 50 }}
							animate={
								heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
							}
							transition={{ duration: 0.7, delay: 1.2 }}
						>
							{[
								{
									title: 'Book Easily',
									description:
										'Your referrals enjoy our simple booking process with no hidden fees.',
									icon: (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="h-6 w-6"
										>
											<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
											<circle cx="12" cy="10" r="3" />
										</svg>
									),
									delay: 0,
								},
								{
									title: 'Cancel Anytime',
									description:
										'Flexible cancellation policy that your network will appreciate.',
									icon: <Calendar className="h-6 w-6" />,
									delay: 0.2,
								},
								{
									title: 'Full Refunds',
									description:
										'100% money-back guarantee gives travelers complete peace of mind.',
									icon: <RefreshCw className="h-6 w-6" />,
									delay: 0.4,
								},
							].map((item, index) => (
								<motion.div
									key={index}
									className="bg-background/80 flex flex-col items-center space-y-2 rounded-lg border p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md"
									initial={{ opacity: 0, y: 20 }}
									animate={
										heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.5, delay: 1.2 + item.delay }}
									whileHover={{
										y: -5,
										boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
									}}
									onMouseEnter={() => setIsHovering(true)}
									onMouseLeave={() => setIsHovering(false)}
								>
									<motion.div
										className="rounded-full bg-[#f8f9fa] p-3"
										whileHover={{ rotate: 360 }}
										transition={{ duration: 0.7 }}
									>
										{item.icon}
									</motion.div>
									<h3 className="text-xl font-bold">{item.title}</h3>
									<p className="text-muted-foreground">{item.description}</p>
								</motion.div>
							))}
						</motion.div>
					</div>
				</section>

				<section
					ref={benefitsRef}
					className="relative w-full py-12 md:py-24 lg:py-32"
				>
					<div className="absolute inset-0 -z-10">
						<div className="absolute inset-0 bg-[#f8f9fa]/50" />
						<div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#f8f9fa] to-white opacity-70 blur-3xl" />
					</div>

					<div className="container relative px-4 md:px-6">
						<motion.div
							className="flex flex-col items-center justify-center space-y-4 text-center"
							initial={{ opacity: 0, y: 50 }}
							animate={
								benefitsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
							}
							transition={{ duration: 0.7 }}
						>
							<div className="space-y-2">
								<motion.div
									className="relative inline-block overflow-hidden rounded-lg bg-[#f8f9fa] px-3 py-1 text-sm"
									initial={{ opacity: 0, y: 20 }}
									animate={
										benefitsInView
											? { opacity: 1, y: 0 }
											: { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.5, delay: 0.2 }}
									whileHover={{ scale: 1.05 }}
								>
									<span className="relative z-10">Why Partner With Us</span>
									<motion.div
										className="absolute inset-0 z-0 bg-gradient-to-r from-[#f8f9fa] via-white to-[#f8f9fa]"
										animate={{ x: ['100%', '-100%'] }}
										transition={{
											repeat: Number.POSITIVE_INFINITY,
											duration: 3,
											ease: 'linear',
										}}
									/>
								</motion.div>
								<motion.h2
									className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
									initial={{ opacity: 0, y: 20 }}
									animate={
										benefitsInView
											? { opacity: 1, y: 0 }
											: { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.5, delay: 0.3 }}
								>
									Benefits of Our Affiliate Program
								</motion.h2>
								<motion.p
									className="text-muted-foreground mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
									initial={{ opacity: 0, y: 20 }}
									animate={
										benefitsInView
											? { opacity: 1, y: 0 }
											: { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.5, delay: 0.4 }}
								>
									Join thousands of partners who are earning by sharing Travsus
									with their audience.
								</motion.p>
							</div>
						</motion.div>

						<div className="mx-auto grid max-w-5xl gap-8 pt-12 md:grid-cols-2 lg:grid-cols-3">
							{benefits.map((benefit, index) => (
								<motion.div
									key={index}
									className="bg-background/80 group relative flex flex-col items-start space-y-3 overflow-hidden rounded-lg border p-6 shadow-sm backdrop-blur-sm"
									initial={{ opacity: 0, y: 30 }}
									animate={
										benefitsInView
											? { opacity: 1, y: 0 }
											: { opacity: 0, y: 30 }
									}
									transition={{ duration: 0.5, delay: 0.1 * index }}
									whileHover={{
										y: -5,
										boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
										backgroundColor: 'rgba(255,255,255,1)',
									}}
									onMouseEnter={() => setIsHovering(true)}
									onMouseLeave={() => setIsHovering(false)}
								>
									<motion.div
										className="absolute right-0 top-0 z-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f8f9fa] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
										animate={benefitsInView ? { scale: [0.8, 1.2, 1] } : {}}
										transition={{ duration: 1, delay: 0.2 * index }}
									/>
									<motion.div
										className="relative z-10 rounded-full bg-[#f8f9fa] p-3"
										whileHover={{
											rotate: 360,
											backgroundColor: '#1a1a1a',
											color: 'white',
										}}
										transition={{ duration: 0.7 }}
									>
										{benefit.icon}
									</motion.div>
									<h3 className="relative z-10 text-xl font-bold">
										{benefit.title}
									</h3>
									<p className="text-muted-foreground relative z-10">
										{benefit.description}
									</p>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				<section
					ref={stepsRef}
					className="relative w-full overflow-hidden bg-[#f8f9fa] py-12 md:py-24 lg:py-32"
				>
					<motion.div
						className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent"
						animate={{ opacity: [0, 1, 0] }}
						transition={{
							duration: 3,
							repeat: Number.POSITIVE_INFINITY,
							repeatType: 'reverse',
						}}
					/>

					<div className="container relative px-4 md:px-6">
						<motion.div
							className="flex flex-col items-center justify-center space-y-4 text-center"
							initial={{ opacity: 0, y: 50 }}
							animate={
								stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
							}
							transition={{ duration: 0.7 }}
						>
							<div className="space-y-2">
								<motion.div
									className="bg-background inline-block rounded-lg px-3 py-1 text-sm"
									initial={{ opacity: 0, y: 20 }}
									animate={
										stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.5, delay: 0.2 }}
									whileHover={{ scale: 1.05 }}
								>
									Simple Process
								</motion.div>
								<motion.h2
									className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
									initial={{ opacity: 0, y: 20 }}
									animate={
										stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.5, delay: 0.3 }}
								>
									How Our Affiliate Program Works
								</motion.h2>
								<motion.p
									className="text-muted-foreground mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
									initial={{ opacity: 0, y: 20 }}
									animate={
										stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.5, delay: 0.4 }}
								>
									Start earning in three simple steps.
								</motion.p>
							</div>
						</motion.div>

						<div className="mx-auto grid max-w-5xl gap-8 pt-12 md:grid-cols-3">
							{steps.map((step, index) => (
								<motion.div
									key={index}
									className="relative flex flex-col items-center text-center"
									initial={{ opacity: 0, y: 30 }}
									animate={
										stepsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
									}
									transition={{ duration: 0.5, delay: 0.3 * index }}
									whileHover={{ y: -5 }}
									onMouseEnter={() => setIsHovering(true)}
									onMouseLeave={() => setIsHovering(false)}
								>
									<div className="relative">
										<motion.div
											className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#1a1a1a] text-xl font-bold text-white"
											whileHover={{ scale: 1.1 }}
											transition={{ type: 'spring', stiffness: 300 }}
										>
											{index + 1}
											<motion.div
												className="absolute -inset-1 z-0 rounded-full bg-[#1a1a1a]/20"
												animate={{ scale: [1, 1.2, 1] }}
												transition={{
													duration: 2,
													repeat: Number.POSITIVE_INFINITY,
													repeatType: 'reverse',
												}}
											/>
										</motion.div>
										{index < steps.length - 1 && (
											<motion.div
												className="absolute left-16 top-8 hidden h-0.5 w-full -translate-y-1/2 bg-[#1a1a1a]/30 md:block"
												initial={{ width: 0 }}
												animate={stepsInView ? { width: '100%' } : { width: 0 }}
												transition={{ duration: 0.8, delay: 0.5 + 0.2 * index }}
											/>
										)}
									</div>
									<motion.h3
										className="mt-4 text-xl font-bold"
										initial={{ opacity: 0 }}
										animate={stepsInView ? { opacity: 1 } : { opacity: 0 }}
										transition={{ duration: 0.5, delay: 0.4 + 0.3 * index }}
									>
										{step.title}
									</motion.h3>
									<motion.p
										className="text-muted-foreground mt-2"
										initial={{ opacity: 0 }}
										animate={stepsInView ? { opacity: 1 } : { opacity: 0 }}
										transition={{ duration: 0.5, delay: 0.5 + 0.3 * index }}
									>
										{step.description}
									</motion.p>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				<section
					ref={commissionRef}
					className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32"
				>
					<div className="absolute inset-0 -z-10">
						<div className="absolute inset-0 bg-gradient-to-br from-white to-[#f8f9fa]/50" />
						<motion.div
							className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#1a1a1a]/5 blur-3xl"
							animate={{
								x: [50, 0, 50],
								y: [0, 50, 0],
							}}
							transition={{
								duration: 20,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: 'reverse',
							}}
						/>
						<motion.div
							className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#1a1a1a]/5 blur-3xl"
							animate={{
								x: [0, 50, 0],
								y: [50, 0, 50],
							}}
							transition={{
								duration: 15,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: 'reverse',
							}}
						/>
					</div>

					<div className="container relative px-4 md:px-6">
						<div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_800px]">
							<motion.div
								className="flex flex-col justify-center space-y-4"
								initial={{ opacity: 0, x: -50 }}
								animate={
									commissionInView
										? { opacity: 1, x: 0 }
										: { opacity: 0, x: -50 }
								}
								transition={{ duration: 0.7 }}
							>
								<div className="space-y-2">
									<motion.div
										className="mb-2 inline-block rounded-lg bg-[#f8f9fa] px-3 py-1 text-sm"
										initial={{ opacity: 0, y: 20 }}
										animate={
											commissionInView
												? { opacity: 1, y: 0 }
												: { opacity: 0, y: 20 }
										}
										transition={{ duration: 0.5, delay: 0.2 }}
										whileHover={{ scale: 1.05 }}
									>
										Commission Structure
									</motion.div>
									<motion.h2
										className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
										initial={{ opacity: 0, y: 20 }}
										animate={
											commissionInView
												? { opacity: 1, y: 0 }
												: { opacity: 0, y: 20 }
										}
										transition={{ duration: 0.5, delay: 0.3 }}
									>
										Earn Up To{' '}
										<motion.span
											className="relative inline-block"
											whileHover={{ scale: 1.1 }}
											transition={{ type: 'spring', stiffness: 300 }}
										>
											15%
											<motion.span
												className="absolute -bottom-1 left-0 h-1 w-full bg-[#1a1a1a]"
												initial={{ width: 0 }}
												animate={
													commissionInView ? { width: '100%' } : { width: 0 }
												}
												transition={{ duration: 0.8, delay: 0.6 }}
											/>
										</motion.span>{' '}
										On Every Booking
									</motion.h2>
									<motion.p
										className="text-muted-foreground max-w-[600px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
										initial={{ opacity: 0, y: 20 }}
										animate={
											commissionInView
												? { opacity: 1, y: 0 }
												: { opacity: 0, y: 20 }
										}
										transition={{ duration: 0.5, delay: 0.4 }}
									>
										Our tiered commission structure rewards your performance.
										The more bookings you refer, the higher your commission
										rate.
									</motion.p>
								</div>
								<motion.ul
									className="grid gap-2"
									initial={{ opacity: 0, y: 20 }}
									animate={
										commissionInView
											? { opacity: 1, y: 0 }
											: { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.5, delay: 0.5 }}
								>
									{[
										'10% commission on your first 10 bookings',
										'12% commission on bookings 11-50',
										'15% commission on all bookings after 50',
										'Additional bonuses for high-performing affiliates',
									].map((item, index) => (
										<motion.li
											key={index}
											className="flex items-center gap-2"
											initial={{ opacity: 0, x: -20 }}
											animate={
												commissionInView
													? { opacity: 1, x: 0 }
													: { opacity: 0, x: -20 }
											}
											transition={{ duration: 0.5, delay: 0.6 + 0.1 * index }}
											whileHover={{ x: 5 }}
										>
											<motion.div
												whileHover={{ scale: 1.2, rotate: 360 }}
												transition={{ duration: 0.5 }}
											>
												<Check className="h-5 w-5 text-[#1a1a1a]" />
											</motion.div>
											<span>{item}</span>
										</motion.li>
									))}
								</motion.ul>
								<motion.div
									className="flex flex-col gap-3 pt-4 min-[400px]:flex-row"
									initial={{ opacity: 0, y: 20 }}
									animate={
										commissionInView
											? { opacity: 1, y: 0 }
											: { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.5, delay: 0.8 }}
								>
									<motion.div
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onMouseEnter={() => setIsHovering(true)}
										onMouseLeave={() => setIsHovering(false)}
									>
										<Button className="group relative w-full overflow-hidden bg-[#1a1a1a] hover:bg-[#333333] min-[400px]:w-auto">
											<span className="relative z-10">
												Calculate Your Earnings
											</span>
											<motion.span
												className="absolute inset-0 z-0 bg-gradient-to-r from-[#333] to-[#666]"
												initial={{ x: '-100%' }}
												whileHover={{ x: 0 }}
												transition={{ duration: 0.4 }}
											/>
										</Button>
									</motion.div>
								</motion.div>
							</motion.div>

							<motion.div
								className="flex items-center justify-center"
								initial={{ opacity: 0, x: 50 }}
								animate={
									commissionInView
										? { opacity: 1, x: 0 }
										: { opacity: 0, x: 50 }
								}
								transition={{ duration: 0.7, delay: 0.2 }}
							>
								<motion.div
									className="relative w-full max-w-[600px]"
									whileHover={{ y: -5 }}
									transition={{ type: 'spring', stiffness: 300 }}
									onMouseEnter={() => setIsHovering(true)}
									onMouseLeave={() => setIsHovering(false)}
								>
									<motion.div
										className="absolute -inset-1 -z-10 rounded-xl bg-gradient-to-r from-[#f8f9fa] via-[#1a1a1a]/10 to-[#f8f9fa] opacity-70 blur-md"
										animate={{
											background: [
												'linear-gradient(to right, #f8f9fa, rgba(26,26,26,0.1), #f8f9fa)',
												'linear-gradient(to right, rgba(26,26,26,0.1), #f8f9fa, rgba(26,26,26,0.1))',
												'linear-gradient(to right, #f8f9fa, rgba(26,26,26,0.1), #f8f9fa)',
											],
										}}
										transition={{
											duration: 5,
											repeat: Number.POSITIVE_INFINITY,
										}}
									/>
									<motion.div
										className="bg-background/90 relative rounded-xl border p-6 shadow-lg backdrop-blur-sm"
										initial={{ y: 20 }}
										animate={commissionInView ? { y: 0 } : { y: 20 }}
										transition={{ duration: 0.5, delay: 0.4 }}
									>
										<motion.div
											className="mb-6 space-y-2"
											initial={{ opacity: 0 }}
											animate={
												commissionInView ? { opacity: 1 } : { opacity: 0 }
											}
											transition={{ duration: 0.5, delay: 0.5 }}
										>
											<h3 className="flex items-center text-xl font-bold">
												<Sparkles className="mr-2 h-5 w-5 text-[#1a1a1a]" />
												Earnings Calculator
											</h3>
											<p className="text-muted-foreground text-sm">
												Estimate your potential earnings as a Travsus affiliate.
											</p>
										</motion.div>
										<motion.div
											className="space-y-4"
											initial={{ opacity: 0 }}
											animate={
												commissionInView ? { opacity: 1 } : { opacity: 0 }
											}
											transition={{ duration: 0.5, delay: 0.6 }}
										>
											<div className="space-y-2">
												<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Average booking value ($)
												</label>
												<Input
													type="number"
													name="bookingValue"
													value={calculatorValues.bookingValue}
													onChange={handleInputChange}
													className="transition-all duration-300 focus:ring-2 focus:ring-[#1a1a1a]/20"
												/>
											</div>
											<div className="space-y-2">
												<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Estimated monthly referrals
												</label>
												<Input
													type="number"
													name="monthlyReferrals"
													value={calculatorValues.monthlyReferrals}
													onChange={handleInputChange}
													className="transition-all duration-300 focus:ring-2 focus:ring-[#1a1a1a]/20"
												/>
											</div>
											<div className="space-y-2">
												<label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
													Your commission tier
												</label>
												<select
													className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
													name="commissionTier"
													value={calculatorValues.commissionTier}
													onChange={handleInputChange}
												>
													<option value="10">10% (1-10 bookings)</option>
													<option value="12">12% (11-50 bookings)</option>
													<option value="15">15% (50+ bookings)</option>
												</select>
											</div>
											<motion.div
												whileHover={{ scale: 1.03 }}
												whileTap={{ scale: 0.97 }}
											>
												<Button
													className="w-full bg-[#1a1a1a] hover:bg-[#333333]"
													onClick={calculateEarnings}
												>
													Calculate
												</Button>
											</motion.div>
										</motion.div>
										<motion.div
											className="mt-6 rounded-lg border bg-[#f8f9fa] p-4"
											initial={{ opacity: 0, y: 20 }}
											animate={
												commissionInView
													? { opacity: 1, y: 0 }
													: { opacity: 0, y: 20 }
											}
											transition={{ duration: 0.5, delay: 0.7 }}
										>
											<div className="flex items-center justify-between">
												<span className="font-medium">
													Potential Monthly Earnings:
												</span>
												<span className="text-xl font-bold">
													<CountUp
														start={0}
														end={earnings.monthly}
														prefix="$"
														decimals={2}
														duration={1.5}
														enableScrollSpy
														scrollSpyOnce
													/>
												</span>
											</div>
											<div className="mt-2 flex items-center justify-between">
												<span className="font-medium">Annual Earnings:</span>
												<span className="text-xl font-bold">
													<CountUp
														start={0}
														end={earnings.annual}
														prefix="$"
														decimals={2}
														duration={2}
														enableScrollSpy
														scrollSpyOnce
													/>
												</span>
											</div>
										</motion.div>
									</motion.div>
								</motion.div>
							</motion.div>
						</div>
					</div>
				</section>

				<section
					ref={testimonialsRef}
					className="relative w-full overflow-hidden bg-[#f8f9fa] py-12 md:py-24 lg:py-32"
				>
					<motion.div
						className="absolute inset-0 -z-10 bg-[url('/')] bg-repeat opacity-5"
						style={{ backgroundPosition: `0 ${backgroundY.get()}px` }}
					/>

					<div className="container relative px-4 md:px-6">
						<motion.div
							className="flex flex-col items-center justify-center space-y-4 text-center"
							initial={{ opacity: 0, y: 50 }}
							animate={
								testimonialsInView
									? { opacity: 1, y: 0 }
									: { opacity: 0, y: 50 }
							}
							transition={{ duration: 0.7 }}
						>
							<div className="space-y-2">
								<motion.div
									className="bg-background inline-block rounded-lg px-3 py-1 text-sm"
									initial={{ opacity: 0, y: 20 }}
									animate={
										testimonialsInView
											? { opacity: 1, y: 0 }
											: { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.5, delay: 0.2 }}
									whileHover={{ scale: 1.05 }}
								>
									Testimonials
								</motion.div>
								<motion.h2
									className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
									initial={{ opacity: 0, y: 20 }}
									animate={
										testimonialsInView
											? { opacity: 1, y: 0 }
											: { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.5, delay: 0.3 }}
								>
									What Our Affiliates Say
								</motion.h2>
								<motion.p
									className="text-muted-foreground mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
									initial={{ opacity: 0, y: 20 }}
									animate={
										testimonialsInView
											? { opacity: 1, y: 0 }
											: { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.5, delay: 0.4 }}
								>
									Hear from partners who are already succeeding with our
									program.
								</motion.p>
							</div>
						</motion.div>

						<div className="mx-auto grid max-w-5xl gap-6 pt-12 md:grid-cols-2 lg:grid-cols-3">
							{testimonials.map((testimonial, index) => (
								<motion.div
									key={index}
									className="bg-background/80 relative flex flex-col justify-between overflow-hidden rounded-lg border p-6 shadow-sm backdrop-blur-sm"
									initial={{ opacity: 0, y: 30 }}
									animate={
										testimonialsInView
											? { opacity: 1, y: 0 }
											: { opacity: 0, y: 30 }
									}
									transition={{ duration: 0.5, delay: 0.2 * index }}
									whileHover={{
										y: -5,
										boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
										backgroundColor: 'rgba(255,255,255,1)',
									}}
									onMouseEnter={() => setIsHovering(true)}
									onMouseLeave={() => setIsHovering(false)}
								>
									<motion.div
										className="absolute right-0 top-0 z-0 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f8f9fa]"
										animate={testimonialsInView ? { scale: [0.8, 1.2, 1] } : {}}
										transition={{ duration: 1, delay: 0.2 * index }}
									/>
									<div>
										<motion.div
											className="flex gap-0.5"
											initial={{ opacity: 0 }}
											animate={
												testimonialsInView ? { opacity: 1 } : { opacity: 0 }
											}
											transition={{ duration: 0.5, delay: 0.3 + 0.1 * index }}
										>
											{[...Array(5)].map((_, i) => (
												<motion.svg
													key={i}
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													className="text-[#1a1a1a]"
													initial={{ opacity: 0, scale: 0 }}
													animate={
														testimonialsInView
															? { opacity: 1, scale: 1 }
															: { opacity: 0, scale: 0 }
													}
													transition={{
														duration: 0.3,
														delay: 0.4 + 0.1 * i + 0.2 * index,
													}}
													whileHover={{ scale: 1.2, rotate: 360 }}
												>
													<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
												</motion.svg>
											))}
										</motion.div>
										<motion.p
											className="text-muted-foreground relative z-10 mt-4"
											initial={{ opacity: 0 }}
											animate={
												testimonialsInView ? { opacity: 1 } : { opacity: 0 }
											}
											transition={{ duration: 0.5, delay: 0.5 + 0.1 * index }}
										>
											"{testimonial.content}"
										</motion.p>
									</div>
									<motion.div
										className="mt-6 flex items-center"
										initial={{ opacity: 0 }}
										animate={
											testimonialsInView ? { opacity: 1 } : { opacity: 0 }
										}
										transition={{ duration: 0.5, delay: 0.6 + 0.1 * index }}
									>
										<motion.div
											whileHover={{ scale: 1.1, rotate: 10 }}
											transition={{ type: 'spring', stiffness: 300 }}
										>
											<Image
												src={`/placeholder.svg?height=40&width=40&text=${testimonial.name.charAt(0)}`}
												width={40}
												height={40}
												alt={testimonial.name}
												className="rounded-full border-2 border-[#1a1a1a]/10"
											/>
										</motion.div>
										<div className="ml-3">
											<h4 className="text-sm font-medium">
												{testimonial.name}
											</h4>
											<p className="text-muted-foreground text-xs">
												{testimonial.role}
											</p>
										</div>
									</motion.div>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				<section
					ref={faqRef}
					className="relative w-full overflow-hidden py-12 md:py-24 lg:py-32"
				>
					<div className="absolute inset-0 -z-10">
						<div className="absolute inset-0 bg-gradient-to-br from-white to-[#f8f9fa]/50" />
						<motion.div
							className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#f8f9fa] to-white opacity-70 blur-3xl"
							animate={{
								scale: [1, 1.1, 1],
								opacity: [0.7, 0.5, 0.7],
							}}
							transition={{
								duration: 10,
								repeat: Number.POSITIVE_INFINITY,
								repeatType: 'reverse',
							}}
						/>
					</div>

					<div className="container relative px-4 md:px-6">
						<motion.div
							className="flex flex-col items-center justify-center space-y-4 text-center"
							initial={{ opacity: 0, y: 50 }}
							animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
							transition={{ duration: 0.7 }}
						>
							<div className="space-y-2">
								<motion.div
									className="inline-block rounded-lg bg-[#f8f9fa] px-3 py-1 text-sm"
									initial={{ opacity: 0, y: 20 }}
									animate={
										faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.5, delay: 0.2 }}
									whileHover={{ scale: 1.05 }}
								>
									Frequently Asked Questions
								</motion.div>
								<motion.h2
									className="text-3xl font-bold tracking-tighter md:text-4xl/tight"
									initial={{ opacity: 0, y: 20 }}
									animate={
										faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.5, delay: 0.3 }}
								>
									Got Questions? We've Got Answers
								</motion.h2>
								<motion.p
									className="text-muted-foreground mx-auto max-w-[700px] md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
									initial={{ opacity: 0, y: 20 }}
									animate={
										faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
									}
									transition={{ duration: 0.5, delay: 0.4 }}
								>
									Everything you need to know about our affiliate program.
								</motion.p>
							</div>
						</motion.div>

						<motion.div
							className="mx-auto max-w-3xl pt-12"
							initial={{ opacity: 0, y: 30 }}
							animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
							transition={{ duration: 0.7, delay: 0.5 }}
						>
							<Accordion type="single" collapsible className="w-full">
								{faqs.map((faq, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, y: 20 }}
										animate={
											faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
										}
										transition={{ duration: 0.5, delay: 0.5 + 0.1 * index }}
										whileHover={{ backgroundColor: 'rgba(248,249,250,0.5)' }}
										className="rounded-lg"
										onMouseEnter={() => setIsHovering(true)}
										onMouseLeave={() => setIsHovering(false)}
									>
										<AccordionItem
											value={`item-${index}`}
											className="mb-2 border-b-0"
										>
											<AccordionTrigger className="bg-background/80 rounded-lg border px-4 py-4 text-left backdrop-blur-sm hover:no-underline">
												{faq.question}
											</AccordionTrigger>
											<AccordionContent className="px-4 pb-4 pt-2">
												<motion.div
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ duration: 0.3 }}
												>
													{faq.answer}
												</motion.div>
											</AccordionContent>
										</AccordionItem>
									</motion.div>
								))}
							</Accordion>
						</motion.div>
					</div>
				</section>
			</main>
		</div>
	)
}

const benefits = [
	{
		title: 'Competitive Commission',
		description:
			'Earn up to 15% commission on every booking made through your referral link.',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="h-5 w-5"
			>
				<circle cx="12" cy="12" r="10" />
				<path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
				<path d="M12 18V6" />
			</svg>
		),
	},
	{
		title: '60-Day Cookie',
		description:
			'Our 60-day cookie duration ensures you get credit even if bookings happen weeks after the initial click.',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="h-5 w-5"
			>
				<circle cx="12" cy="12" r="10" />
				<polyline points="12 6 12 12 16 14" />
			</svg>
		),
	},
	{
		title: 'Real-Time Tracking',
		description:
			'Monitor your performance with our advanced dashboard showing clicks, conversions, and earnings.',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="h-5 w-5"
			>
				<path d="M3 3v18h18" />
				<path d="m19 9-5 5-4-4-3 3" />
			</svg>
		),
	},
	{
		title: 'Monthly Payments',
		description:
			'Get paid reliably every month with multiple payout options including PayPal and bank transfer.',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="h-5 w-5"
			>
				<rect width="20" height="14" x="2" y="5" rx="2" />
				<line x1="2" x2="22" y1="10" y2="10" />
			</svg>
		),
	},
	{
		title: 'Marketing Resources',
		description:
			'Access professionally designed banners, email templates, and content to promote Travsus effectively.',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="h-5 w-5"
			>
				<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
				<polyline points="14 2 14 8 20 8" />
			</svg>
		),
	},
	{
		title: 'Dedicated Support',
		description:
			'Get personalized assistance from our affiliate team to help you maximize your earnings.',
		icon: (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="h-5 w-5"
			>
				<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
			</svg>
		),
	},
]

const steps = [
	{
		title: 'Apply',
		description:
			'Complete our simple application form to join the Travsus affiliate program.',
	},
	{
		title: 'Promote',
		description:
			'Share your unique referral link with your audience through your preferred channels.',
	},
	{
		title: 'Earn',
		description:
			'Earn commission on every booking made through your referral link.',
	},
]

const testimonials = [
	{
		content:
			'The Travsus affiliate program has been a perfect fit for my travel blog. My readers love the flexibility, and I love the consistent commissions.',
		name: 'Emma Rodriguez',
		role: 'Travel Blogger',
	},
	{
		content:
			'What sets Travsus apart is their tracking system. I never have to worry about missing a commission, and the dashboard makes it easy to monitor performance.',
		name: 'David Chen',
		role: 'Digital Marketer',
	},
	{
		content:
			'My audience appreciates the flexibility Travsus offers, especially the full refund policy. It makes promoting their service so much easier.',
		name: 'Sarah Johnson',
		role: 'Content Creator',
	},
]

const faqs = [
	{
		question: 'Who can join the Travsus affiliate program?',
		answer:
			'Our program is open to travel bloggers, content creators, influencers, and anyone with an audience interested in flexible travel options. We review all applications to ensure alignment with our brand values.',
	},
	{
		question: 'How much can I earn as a Travsus affiliate?',
		answer:
			"You can earn up to 15% commission on every booking made through your referral link. The commission rate increases as you refer more customers, starting at 10% and going up to 15% for our top performers. The average affiliate earns between $500-$2,000 per month, but there's no upper limit to what you can earn.",
	},
	{
		question: 'When and how do I get paid?',
		answer:
			"We process payments on a monthly basis. Once your account reaches the minimum payout threshold of $50, you'll receive payment by the 15th of the following month. We offer multiple payment methods including PayPal, direct bank transfer, and in some regions, cryptocurrency.",
	},
	{
		question: 'How long does the cookie last?',
		answer:
			"Our tracking cookie has a 60-day duration. This means if someone clicks on your referral link, you'll receive credit for any booking they make within the next 60 days, even if they don't complete their booking immediately.",
	},
	{
		question: 'What marketing materials do you provide?',
		answer:
			'We provide a comprehensive set of marketing materials including banners in various sizes, email templates, social media posts, and detailed product descriptions. All materials are professionally designed and regularly updated to reflect our latest offerings and promotions.',
	},
	{
		question: 'Can I promote Travsus on multiple websites?',
		answer:
			'Yes, you can promote Travsus across multiple websites and platforms that you own or manage. However, each affiliate account should represent one individual or company. If you have multiple distinct businesses, please contact us to discuss your specific situation.',
	},
]
