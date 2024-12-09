'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const transportTypes = [
	{
		name: 'Prado',
		image: '/images/transports/prado.png',
		minPeople: 1,
		maxPeople: 5,
	},
	{
		name: 'Mercedes Vito',
		image: '/images/transports/vito.png',
		minPeople: 6,
		maxPeople: 8,
	},
	{
		name: 'Mercedes Minivan',
		image: '/images/transports/mercedes-minivan.png',
		minPeople: 9,
		maxPeople: 19,
	},
	{
		name: 'Big Bus',
		image: '/images/transports/bus.png',
		minPeople: 20,
		maxPeople: 40,
	},
]

export default function TransportTypes({
	peopleCount,
	transportLineItem,
}: any) {
	// const peopleCount

	const [selectedType, setSelectedType] = useState(null)
	// const [peopleCount, setPeopleCount] = useState(1)
	const [currentIndex, setCurrentIndex] = useState(0)

	const handlePeopleCountChange = (e) => {
		const count = parseInt(e.target.value, 10)
		// setPeopleCount(count)
	}

	const getRecommendedTransport = () => {
		return transportTypes.find(
			(type) => peopleCount >= type.minPeople && peopleCount <= type.maxPeople,
		)
	}

	useEffect(() => {
		const recommended = getRecommendedTransport()
		if (recommended) {
			setSelectedType(recommended)
			setCurrentIndex(transportTypes.indexOf(recommended))
		}
	}, [peopleCount])

	const handlePrev = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex > 0 ? prevIndex - 1 : transportTypes.length - 1,
		)
	}

	const handleNext = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex < transportTypes.length - 1 ? prevIndex + 1 : 0,
		)
	}

	return (
		<div className="space-y-0 p-0">
			<div className="relative h-[200px] overflow-hidden">
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
						className="absolute inset-0 flex items-center justify-center"
					>
						{(() => {
							const type = transportTypes[currentIndex]
							const isRecommended =
								getRecommendedTransport()?.name === type.name
							const isSelected = selectedType === type
							return (
								<div
									className={`flex w-full flex-col items-center justify-between rounded-lg p-4 transition-colors ${
										isSelected
											? 'border-2 border-black'
											: isRecommended
												? 'border-2 border-green-500 bg-green-100'
												: 'bg-muted hover:bg-muted/80 border-2 border-transparent'
									}`}
								>
									<Image
										src={type.image}
										alt={type.name}
										width={80}
										height={80}
										className="mb-2"
									/>
									<span className="text-sm font-medium">{type.name}</span>
									<span className="mt-1 text-xs">
										{type.minPeople} - {type.maxPeople}
										{/* {peopleCount} */}
									</span>
									{isRecommended && (
										<span className="mt-2 text-xs font-semibold text-green-700">
											Recommended
										</span>
									)}
								</div>
							)
						})()}
					</motion.div>
				</AnimatePresence>
				<button
					onClick={handlePrev}
					className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
					aria-label="Previous transport type"
				>
					<ChevronLeft className="h-6 w-6" />
				</button>
				<button
					onClick={handleNext}
					className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md"
					aria-label="Next transport type"
				>
					<ChevronRight className="h-6 w-6" />
				</button>
			</div>

			<div className="mt-4 flex justify-center space-x-2">
				{transportTypes.map((_, index) => (
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
