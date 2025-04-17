'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Plane, Calendar, RefreshCcw, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function HomeBanner() {
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		setIsVisible(true)

		// const handleScroll = () => {
		// 	const scrollPosition = window.scrollY
		// 	if (scrollPosition > 100) {
		// 		setIsVisible(false)
		// 	} else {
		// 		setIsVisible(true)
		// 	}
		// }

		// window.addEventListener('scroll', handleScroll)
		// return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	const handlePageChange = () => {
		const experiencesContainer = document.getElementById(
			'experiences_container',
		)
		if (experiencesContainer) {
			experiencesContainer.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		}
	}

	return (
		<div className="relative w-full py-12">
			<div className="relative z-20 flex min-h-[auto] flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
				<div
					className={cn(
						'max-w-5xl transition-all duration-1000',
						isVisible
							? 'translate-y-0 opacity-100'
							: 'translate-y-10 opacity-0',
					)}
				>
					<h1 className="font-serif mb-6 text-7xl font-extrabold tracking-tight text-black sm:text-5xl md:text-6xl lg:text-[80px] lg:font-extrabold">
						Travel with <span className="text-primary">Ultimate</span>{' '}
						Flexibility
					</h1>
					<p className="mx-auto mb-10 max-w-2xl text-lg text-black sm:text-xl md:text-2xl">
						Book, Cancel, Refund - Anytime, Anywhere in the World.
					</p>
				</div>

				{/* Features */}
				{/* <div
					className={cn(
						'mb-12 flex w-full max-w-4xl flex-col items-center justify-center gap-8 transition-all delay-300 duration-1000 sm:flex-row',
						isVisible
							? 'translate-y-0 opacity-100'
							: 'translate-y-10 opacity-0',
					)}
				>
					<FeatureItem
						icon={<Plane className="h-8 w-8" />}
						title="Book Easily"
						description="Simple booking process"
						onClick={handlePageChange}
					/>
					<FeatureItem
						icon={<Calendar className="h-8 w-8" />}
						title="Cancel Anytime"
						description="No questions asked"
						onClick={handlePageChange}
					/>
					<FeatureItem
						icon={<RefreshCcw className="h-8 w-8" />}
						title="Full Refunds"
						description="100% money back guarantee"
						onClick={handlePageChange}
					/>
				</div> */}

				{/* CTA Button */}
				<div
					className={cn(
						'transition-all delay-500 duration-1000',
						isVisible
							? 'translate-y-0 opacity-100'
							: 'translate-y-10 opacity-0',
					)}
				>
					<Button
						size="lg"
						className="rounded-full bg-primary text-lg font-medium shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
						onClick={handlePageChange}
					>
						Plan Your Flexible Trip
					</Button>
				</div>

				{/* Scroll indicator */}
				{/* <div
					className={cn(
						'absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer text-black transition-all delay-700 duration-1000',
						isVisible ? 'opacity-100' : 'opacity-0',
					)}
					onClick={handlePageChange}
				>
					<ChevronDown className="h-8 w-8" />
				</div> */}
			</div>
		</div>
	)
}

function FeatureItem({
	icon,
	title,
	description,
	onClick,
}: {
	icon: React.ReactNode
	title: string
	description: string
	onClick: () => void
}) {
	return (
		<div
			className="group flex cursor-pointer flex-col items-center gap-3 rounded-xl bg-gray-50 p-6 transition-all hover:bg-gray-100 hover:shadow-lg"
			onClick={onClick}
		>
			<div className="rounded-full bg-primary/20 p-3 text-primary transition-all group-hover:bg-primary/30">
				{icon}
			</div>
			<div className="flex flex-col items-center">
				<span className="text-xl font-semibold text-black">{title}</span>
				<span className="text-sm text-gray-600">{description}</span>
			</div>
		</div>
	)
}
