'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

export default function pricingTiers({
	peopleCount,
	transportLineItem,
	pricingTiers,
}: any) {
	const t = useTranslations('listingExperiencesDetailTransportTypes')

	// const peopleCount

	const [selectedType, setSelectedType] = useState(null)
	// const [peopleCount, setPeopleCount] = useState(1)
	const [currentIndex, setCurrentIndex] = useState(0)

	const handlePeopleCountChange = (e) => {
		const count = parseInt(e.target.value, 10)
		// setPeopleCount(count)
	}

	const getRecommendedTransport = () => {
		return pricingTiers.find(
			(type) => peopleCount >= type.minSeats && peopleCount <= type.maxSeats,
		)
	}

	useEffect(() => {
		const recommended = getRecommendedTransport()
		if (recommended) {
			setSelectedType(recommended)
			setCurrentIndex(pricingTiers.indexOf(recommended))
		}
	}, [peopleCount])

	const handlePrev = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex > 0 ? prevIndex - 1 : pricingTiers.length - 1,
		)
	}

	const handleNext = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex < pricingTiers.length - 1 ? prevIndex + 1 : 0,
		)
	}

	return (
		<div
			className={t('listingExperiencesDetailTransportTypes_Container_Classes')}
		>
			<div
				className={t(
					'listingExperiencesDetailTransportTypes_Carousel_Container_Classes',
				)}
			>
				<AnimatePresence initial={false} custom={currentIndex}>
					<motion.div
						key={currentIndex}
						custom={currentIndex}
						variants={{
							enter: (direction) => ({
								x: direction > 0 ? '100%' : '-100%',
								opacity: 0,
							}),
							center: { x: 0, opacity: 1 },
							exit: (direction) => ({
								x: direction < 0 ? '100%' : '-100%',
								opacity: 0,
							}),
						}}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
						className={t(
							'listingExperiencesDetailTransportTypes_Motion_Container_Classes',
						)}
					>
						{(() => {
							const type = pricingTiers[currentIndex]
							const isRecommended =
								getRecommendedTransport()?.name === type.transportType
							const isSelected = selectedType === type
							return (
								<div
									className={`flex w-full flex-col items-center justify-between rounded-lg p-4 transition-colors ${
										isSelected
											? t(
													'listingExperiencesDetailTransportTypes_Selected_Border_Classes',
												)
											: isRecommended
												? 'border-2 border-green-500 bg-green-100'
												: 'bg-muted hover:bg-muted/80 border-2 border-transparent'
									}`}
								>
									<Image
										src={type.transportImage}
										alt={type.transportType}
										width={80}
										height={80}
										className={t(
											'listingExperiencesDetailTransportTypes_Image_Classes',
										)}
									/>
									<span
										className={t(
											'listingExperiencesDetailTransportTypes_Title_Classes',
										)}
									>
										{type.transportType}
									</span>
									<span
										className={t(
											'listingExperiencesDetailTransportTypes_Capacity_Classes',
										)}
									>
										{type.minSeats} - {type.maxSeats}
										{/* {peopleCount} */}
									</span>
									{isRecommended && (
										<span
											className={t(
												'listingExperiencesDetailTransportTypes_Recommended_Classes',
											)}
										>
											{t(
												'listingExperiencesDetailTransportTypes_Recommended_Text',
											)}
										</span>
									)}
								</div>
							)
						})()}
					</motion.div>
				</AnimatePresence>
				<button
					onClick={handlePrev}
					className={t(
						'listingExperiencesDetailTransportTypes_Prev_Button_Classes',
					)}
					aria-label={t(
						'listingExperiencesDetailTransportTypes_Previous_Transport_Type',
					)}
				>
					<ChevronLeft
						className={t('listingExperiencesDetailTransportTypes_Icon_Classes')}
					/>
				</button>
				<button
					onClick={handleNext}
					className={t(
						'listingExperiencesDetailTransportTypes_Next_Button_Classes',
					)}
					aria-label={t(
						'listingExperiencesDetailTransportTypes_Next_Transport_Type',
					)}
				>
					<ChevronRight
						className={t('listingExperiencesDetailTransportTypes_Icon_Classes')}
					/>
				</button>
			</div>

			<div
				className={t(
					'listingExperiencesDetailTransportTypes_Dots_Container_Classes',
				)}
			>
				{pricingTiers.map((_, index) => (
					<button
						key={index}
						onClick={() => setCurrentIndex(index)}
						className={`h-2 w-2 rounded-full ${
							currentIndex === index ? 'bg-black' : 'bg-gray-300'
						}`}
						aria-label={`Go to transport type ${index + 1}`}
					/>
				))}
			</div>

			{selectedType && <></>}
		</div>
	)
}
