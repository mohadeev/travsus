'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { useTranslations } from '@/lib/i18n'

interface Day {
	name: string
	description: string
}

interface DotsContainerProps {
	days: Day[]
	onDayClick?: (dayIndex: number) => void
	selectedDayIndex?: number | null
}

export default function DotsContainer({
	days,
	onDayClick,
	selectedDayIndex,
}: DotsContainerProps) {
	const t = useTranslations(
		'newServicedetailListingExperiencesDetaildotscontainer',
	)
	const [dotDensity, setDotDensity] = useState(8) // 8px or 4px spacing between dots
	const [dotsPerDay, setDotsPerDay] = useState<number[][]>(
		Array(days.length).fill([]),
	)
	// Track expanded state for each day individually
	const [expandedDays, setExpandedDays] = useState<boolean[]>(
		Array(days.length).fill(false),
	)
	const dotsContainerRefs = useRef<(HTMLDivElement | null)[]>(
		Array(days.length).fill(null),
	)
	const contentRefs = useRef<(HTMLDivElement | null)[]>(
		Array(days.length).fill(null),
	)

	// Sample itinerary items
	const itineraryItems = [
		t(
			'newServicedetailListingExperiencesDetaildotscontainer_Arrival_At_Marrakech',
		),
		t(
			'newServicedetailListingExperiencesDetaildotscontainer_Visit_Jemaa_El_Fnaa',
		),
		t(
			'newServicedetailListingExperiencesDetaildotscontainer_Explore_Bahia_Palace',
		),
		t(
			'newServicedetailListingExperiencesDetaildotscontainer_Day_Trip_To_Ouzoud_Falls',
		),
		t(
			'newServicedetailListingExperiencesDetaildotscontainer_Travel_To_Essaouira',
		),
		t(
			'newServicedetailListingExperiencesDetaildotscontainer_Beach_Day_Seafood_Dinner',
		),
		t(
			'newServicedetailListingExperiencesDetaildotscontainer_Visit_Ait_Ben_Haddou',
		),
		t(
			'newServicedetailListingExperiencesDetaildotscontainer_Cross_The_Atlas_Mountains',
		),
		t(
			'newServicedetailListingExperiencesDetaildotscontainer_Explore_Merzouga_Desert',
		),
		t(
			'newServicedetailListingExperiencesDetaildotscontainer_Camel_Trek_At_Sunset',
		),
		t('newServicedetailListingExperiencesDetaildotscontainer_Visit_Fes_Medina'),
		t(
			'newServicedetailListingExperiencesDetaildotscontainer_Explore_Fes_Tanneries',
		),
		t(
			'newServicedetailListingExperiencesDetaildotscontainer_Shopping_In_Fes_Souks',
		),
		t(
			'newServicedetailListingExperiencesDetaildotscontainer_Departure_From_Fes',
		),
	]

	// Toggle expansion for a specific day
	const toggleExpand = (dayIndex: number) => {
		const newExpandedDays = [...expandedDays]
		newExpandedDays[dayIndex] = !newExpandedDays[dayIndex]
		setExpandedDays(newExpandedDays)
	}

	// Handle day click - both toggle expand and notify parent
	const handleDayClick = (dayIndex: number) => {
		toggleExpand(dayIndex)

		// Notify parent component if callback is provided
		if (onDayClick) {
			onDayClick(dayIndex)
		}
	}

	// Calculate dots for each day independently
	useEffect(() => {
		const calculateDotsForDay = (index: number) => {
			const ref = dotsContainerRefs.current[index]
			if (!ref) return []

			const containerHeight = ref.clientHeight
			const dotSize = 4 // Exact dot size in pixels
			const spacing = dotDensity - dotSize // Actual spacing between dots
			const totalPerDot = dotSize + spacing

			// Calculate how many dots can fit in the container
			const dotsCount =
				Math.floor((containerHeight - spacing) / totalPerDot) + 1

			// Create an array with the calculated number of dots
			return Array.from({ length: dotsCount }, (_, i) => i)
		}

		const updateAllDots = () => {
			const newDotsPerDay = days.map((_, index) => calculateDotsForDay(index))
			setDotsPerDay(newDotsPerDay)
		}

		updateAllDots()

		// Add resize observer to recalculate when container size changes
		const resizeObserver = new ResizeObserver(updateAllDots)

		dotsContainerRefs.current.forEach((ref) => {
			if (ref) {
				resizeObserver.observe(ref)
			}
		})

		return () => {
			dotsContainerRefs.current.forEach((ref) => {
				if (ref) {
					resizeObserver.unobserve(ref)
				}
			})
		}
	}, [dotDensity, expandedDays, days.length])

	// Set ref for a specific day
	const setDotsContainerRef = (el: HTMLDivElement | null, index: number) => {
		dotsContainerRefs.current[index] = el
	}

	// Set content ref for a specific day
	const setContentRef = (el: HTMLDivElement | null, index: number) => {
		contentRefs.current[index] = el
	}

	return (
		<div className="flex flex-col">
			{days.map((day, index) => {
				const isExpanded = expandedDays[index]
				const isSelected = selectedDayIndex === index
				const truncatedText = day.description.substring(0, 100) + '...'
				const dayDots = dotsPerDay[index] || []

				return (
					<div key={index} className="flex flex-row items-stretch gap-2">
						{/* Dots Component with Button */}
						<div className="flex flex-col items-center">
							<Button
								onClick={() => handleDayClick(index)}
								className={`mb-0 flex h-10 w-10 items-center justify-center rounded-full p-0 ${
									isSelected
										? 'bg-black hover:bg-gray-800'
										: 'bg-black hover:bg-gray-800'
								}`}
							>
								{index + 1}
							</Button>

							<div
								ref={(el) => setDotsContainerRef(el, index)}
								className="relative flex w-6 flex-grow flex-col items-center transition-all duration-300"
								style={{ height: '100%', marginTop: '0' }}
							>
								<TooltipProvider>
									{dayDots.map((dotIndex) => (
										<Tooltip key={dotIndex}>
											<TooltipTrigger asChild>
												<div
													style={{
														position: 'absolute',
														top: `${dotIndex * dotDensity}px`,
														width: '4px',
														height: '4px',
														minWidth: '4px',
														minHeight: '4px',
														maxWidth: '4px',
														maxHeight: '4px',
														backgroundColor: '#000000',
														borderRadius: '50%',
														cursor: 'pointer',
													}}
												/>
											</TooltipTrigger>
											{dotIndex < itineraryItems.length && (
												<TooltipContent side="right">
													<p>{itineraryItems[dotIndex]}</p>
												</TooltipContent>
											)}
										</Tooltip>
									))}
								</TooltipProvider>
							</div>
						</div>

						{/* Paragraph Component with Title and Show More */}
						<div
							ref={(el) => setContentRef(el, index)}
							className={`flex-1 ${isExpanded ? 'pb-[50px]' : ''} ${isSelected ? 'rounded-lg bg-gray-50 p-2' : ''}`}
							onClick={() => handleDayClick(index)}
						>
							<h3 className="mb-2 mt-2 text-lg font-medium text-black">
								{day.name}
							</h3>
							<div className="text-base">
								<p>
									{isExpanded ? day.description : truncatedText}
									{!isExpanded && (
										<span
											className="ml-1 cursor-pointer font-bold text-black hover:underline"
											onClick={(e) => {
												e.stopPropagation()
												toggleExpand(index)
											}}
										>
											{t(
												'newServicedetailListingExperiencesDetaildotscontainer_See_More',
											)}
										</span>
									)}
								</p>
								{isExpanded && (
									<span
										className="ml-1 mt-2 block cursor-pointer font-bold text-black hover:underline"
										onClick={(e) => {
											e.stopPropagation()
											toggleExpand(index)
										}}
									>
										{t(
											'newServicedetailListingExperiencesDetaildotscontainer_Show_Less',
										)}
									</span>
								)}
							</div>
						</div>

						{/* Hidden SEO-friendly content */}
						<div className="sr-only">
							<h3>{day.name}</h3>
							<p>{day.description}</p>
						</div>
					</div>
				)
			})}
		</div>
	)
}
