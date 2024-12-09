'use client'

import React, { FC, useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import css from './css.module.css'
import gradientNoisePurpleAzure from '@/images/6580a563d237ee85c9237ccb_gradient-noise-purple-azure.png'

export interface SectionHero3Props {
	className?: string
}

const SectionHero3: FC<SectionHero3Props> = ({ className = '' }) => {
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 100)

		return () => clearTimeout(timer)
	}, [])

	const handlePageChange = (newPage: number) => {
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
		<div
			className={`nc-PageHome3 relative ${css.className} h-[600px] w-full overflow-hidden`}
			data-nc-id="SectionHero3"
		>
			{/* Gradient Background */}
			<div className="absolute inset-0 z-0">
				<Image
					src={gradientNoisePurpleAzure}
					alt="Background gradient"
					layout="fill"
					objectFit="cover"
					priority
				/>
			</div>

			{/* Content Section */}
			<div className="relative z-10 flex h-full items-center justify-center">
				<div className="mx-auto max-w-2xl px-4 text-center">
					{isLoading ? (
						<>
							<Skeleton className="mx-auto h-6 w-3/4 sm:h-7 md:h-8" />
							<Skeleton className="mt-4 h-10 w-full sm:h-12 md:h-14 lg:h-16 xl:h-20" />
							<Skeleton className="mt-4 h-10 w-full sm:h-12 md:h-14 lg:h-16 xl:h-20" />
							<Skeleton className="mx-auto mt-6 h-12 w-48 rounded-xl sm:h-14 md:h-16 lg:h-[4.5rem]" />
						</>
					) : (
						<>
							<h2 className="mx-auto max-w-4xl text-3xl font-extrabold leading-tight text-black sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
								Your Journey, <br />
								<span className="bg-gradient-to-r from-[#7b212b] to-[#28048b] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
									You
								</span>{' '}
								<br />
								Deserve the Best
							</h2>
							<Button
								onClick={handlePageChange}
								className="mt-8 rounded-full px-6 py-2 text-base font-semibold sm:px-8 sm:py-3 sm:text-lg"
							>
								Plan My Trip
							</Button>
						</>
					)}
				</div>
			</div>
		</div>
	)
}

export default SectionHero3
