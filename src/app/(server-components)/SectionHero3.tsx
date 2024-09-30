import React, { FC } from 'react'
import imagePng from '@/images/travelhero2.png'
import Image from 'next/image'
import ButtonPrimary from '@/shared/ButtonPrimary'
import css from './css.module.css'

export interface SectionHero3Props {
	className?: string
}

const SectionHero3: FC<SectionHero3Props> = ({ className = '' }) => {
	return (
		<div
			className={`nc-PageHome3 relative ${css.className}`}
			data-nc-id="SectionHero3"
		>
			{/* Content Section */}
			<div className="absolute inset-x-0 top-[10%] z-10 mx-auto flex max-w-2xl flex-col items-center space-y-4 text-center sm:top-[12%] lg:space-y-5 xl:space-y-6">
				<span className="font-semibold text-neutral-900 sm:text-lg md:text-xl">
					Booking tax-free from {process.env.NEXT_PUBLIC_PLATFROM_NAME} platform
				</span>
				<h2 className="text-3xl font-bold !leading-[115%] text-black sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
					New generation <br /> of booking
				</h2>
				<ButtonPrimary
					sizeClass="px-6 py-3 lg:px-8 lg:py-4 rounded-xl"
					fontSize="text-sm sm:text-base lg:text-lg font-medium"
				>
					Keep calm & travel on
				</ButtonPrimary>
			</div>

			{/* Image Section */}
			<div className="aspect-h-3 aspect-w-4 relative sm:aspect-h-7 sm:aspect-w-16 lg:aspect-h-8 lg:aspect-w-16 xl:aspect-h-7">
				<Image
					className={`${css.img} absolute inset-0 rounded-xl object-cover`}
					src={imagePng}
					alt="hero"
					priority
				/>
			</div>
		</div>
	)
}

export default SectionHero3
