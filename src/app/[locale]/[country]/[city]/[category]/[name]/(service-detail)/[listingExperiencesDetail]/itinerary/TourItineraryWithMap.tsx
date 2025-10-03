'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from '@/lib/i18n'
import TourMap from './TourMap'
import Image from 'next/image'
import { MapPin } from 'lucide-react'

interface Day {
	name: string
	description: string
	cityId?: string
	cityName?: string
	geoCoordinates?: {
		lat: number
		log: number
	}
	stops?: {
		name: string
		description?: string
		duration?: string
		image?: string
	}[]
}

interface TourItineraryWithMapProps {
	days: Day[]
	title?: string
}

export default function TourItineraryWithMap({
	days,
	title,
}: TourItineraryWithMapProps) {
	const t = useTranslations(
		'ervicedetailListingexperiencesdetailTouritineraryWithMap',
	)

	const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0)
	const [selectedStopIndex, setSelectedStopIndex] = useState<number>(0)
	const [expandedDays, setExpandedDays] = useState<boolean[]>(
		Array(days.length).fill(false),
	)
	const mapRef = useRef(null)
	const [dotDensity, setDotDensity] = useState(8) // 8px spacing between dots
	const timelineRefs = useRef<(HTMLDivElement | null)[]>([])
	const overviewTimelineRefs = useRef<(HTMLDivElement | null)[]>([])

	// Function to handle day selection
	const handleDaySelect = (dayIndex: number) => {
		setSelectedDayIndex(dayIndex)
		setSelectedStopIndex(0) // Reset stop index when changing days
		// If we have a reference to the map component, call its zoomToDay method
		if (mapRef.current && typeof mapRef.current.zoomToDay === 'function') {
			mapRef.current.zoomToDay(dayIndex)
		}
	}

	// Toggle expansion for a specific day
	const toggleExpand = (dayIndex: number) => {
		const newExpandedDays = [...expandedDays]
		newExpandedDays[dayIndex] = !newExpandedDays[dayIndex]
		setExpandedDays(newExpandedDays)
	}

	// Ensure we have a valid day selected
	useEffect(() => {
		if (selectedDayIndex >= days.length) {
			setSelectedDayIndex(0)
		}
	}, [days, selectedDayIndex])

	// Get the currently selected day
	const selectedDay = days[selectedDayIndex] || days[0]

	// Get stops for the selected day, or create a default one if none exist
	const stops = selectedDay?.stops || [
		{
			name: selectedDay.cityName || t('Tour_Stop'),
			description: selectedDay.description || t('No_Description_Available'),
		},
	]

	// Get the currently selected stop
	const selectedStop = stops[selectedStopIndex] || stops[0]

	// Create dots for timeline
	useEffect(() => {
		// Create dots for day detail timelines
		timelineRefs.current.forEach((ref, index) => {
			if (!ref) return
			// Clear existing dots
			while (ref.firstChild) {
				ref.removeChild(ref.firstChild)
			}
			const height = ref.clientHeight
			const dotSize = 4 // Exact dot size in pixels
			const spacing = dotDensity - dotSize // Actual spacing between dots
			const totalPerDot = dotSize + spacing
			// Calculate how many dots can fit in the container
			const dotsCount = Math.floor((height - spacing) / totalPerDot) + 1
			// Create dots
			for (let i = 0; i < dotsCount; i++) {
				const dot = document.createElement('div')
				dot.style.position = 'absolute'
				dot.style.top = `${i * dotDensity}px`
				dot.style.left = '50%'
				dot.style.transform = 'translateX(-50%)'
				dot.style.width = '4px'
				dot.style.height = '4px'
				dot.style.backgroundColor = '#000000'
				dot.style.borderRadius = '50%'
				ref.appendChild(dot)
			}
		})
		// Create dots for overview timelines
		overviewTimelineRefs.current.forEach((ref, index) => {
			if (!ref) return
			// Clear existing dots
			while (ref.firstChild) {
				ref.removeChild(ref.firstChild)
			}
			const height = ref.clientHeight
			const dotSize = 4 // Exact dot size in pixels
			const spacing = dotDensity - dotSize // Actual spacing between dots
			const totalPerDot = dotSize + spacing
			// Calculate how many dots can fit in the container
			const dotsCount = Math.floor((height - spacing) / totalPerDot) + 1
			// Create dots
			for (let i = 0; i < dotsCount; i++) {
				const dot = document.createElement('div')
				dot.style.position = 'absolute'
				dot.style.top = `${i * dotDensity}px`
				dot.style.left = '50%'
				dot.style.transform = 'translateX(-50%)'
				dot.style.width = '4px'
				dot.style.height = '4px'
				dot.style.backgroundColor = '#000000'
				dot.style.borderRadius = '50%'
				ref.appendChild(dot)
			}
		})
	}, [stops, dotDensity, selectedDayIndex])

	// Set timeline ref
	const setTimelineRef = (el: HTMLDivElement | null, index: number) => {
		if (timelineRefs.current.length <= index) {
			timelineRefs.current = [
				...timelineRefs.current,
				...Array(index - timelineRefs.current.length + 1).fill(null),
			]
		}
		timelineRefs.current[index] = el
	}

	// Set overview timeline ref
	const setOverviewTimelineRef = (el: HTMLDivElement | null, index: number) => {
		if (overviewTimelineRefs.current.length <= index) {
			overviewTimelineRefs.current = [
				...overviewTimelineRefs.current,
				...Array(index - overviewTimelineRefs.current.length + 1).fill(null),
			]
		}
		overviewTimelineRefs.current[index] = el
	}

	return (
		<div className="overflow-hidden rounded-lg bg-white shadow-sm">
			{/* Top navigation tabs */}
			<div className="border-b bg-gray-50 p-4">
				<div className="flex flex-wrap gap-2">
					<button
						className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
							selectedDayIndex === -1
								? 'bg-black text-white shadow-sm'
								: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
						}`}
						onClick={() => handleDaySelect(-1)}
					>
						{t('Overview')}
					</button>
					{days.map((day, index) => (
						<button
							key={index}
							className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
								selectedDayIndex === index
									? 'bg-black text-white shadow-sm'
									: 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
							}`}
							onClick={() => handleDaySelect(index)}
						>
							{t('Day_Label')} {index + 1}
						</button>
					))}
				</div>
			</div>
			{/* Day subtitle */}
			<div className="border-b bg-gray-50 px-6 py-2 text-sm text-black">
				{selectedDayIndex === -1 ? (
					<div className="flex gap-2">
						<span>{t('Full_Map')}</span>
						<span>•</span>
						<span>
							{days.length} {t('Days_Label')}
						</span>
					</div>
				) : (
					<div>{selectedDay.name}</div>
				)}
			</div>
			{/* Main content area */}
			<div className="flex flex-col lg:flex-row">
				{/* Left side: Itinerary details */}
				<div className="w-full border-r p-6 lg:w-2/5">
					{selectedDayIndex === -1 ? (
						// Overview content
						<div>
							<h2 className="mb-4 text-xl font-bold">
								{title || t('Desert_Tour')}
							</h2>
							<p className="mb-6 text-black">
								{days.length} {t('Journey_Through')}{' '}
								{days
									.map((d) => d.cityName)
									.filter(Boolean)
									.join(', ')}
							</p>
							<div className="relative space-y-6">
								{days.map((day, index) => (
									<div key={index} className="flex items-start gap-4">
										{/* Dotted line connecting days */}
										{index < days.length - 1 && (
											<div
												ref={(el) => setOverviewTimelineRef(el, index)}
												className="absolute bottom-0 left-4 top-0 flex w-0.5 flex-col items-center"
												style={{
													transform: 'translateX(-50%)',
													top: `${index * 6 + 2.5}rem`,
													height: '4rem',
												}}
											></div>
										)}
										<div className="z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-black text-white">
											{index + 1}
										</div>
										<div>
											<h3 className="font-medium">{day.name}</h3>
											<p className="mt-1 text-sm text-black">{day.cityName}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					) : (
						// Day detail content with stops
						<div>
							<h2 className="mb-4 text-xl font-bold">{selectedDay.name}</h2>
							<div className="relative">
								{stops.map((stop, index) => (
									<div key={index} className="mb-8">
										{/* Timeline dotted line */}
										<div
											ref={(el) => setTimelineRef(el, index)}
											className="absolute bottom-0 left-4 top-0 flex w-0.5 flex-col items-center"
											style={{ transform: 'translateX(-50%)' }}
										></div>
										<div className="flex">
											<div className="relative">
												<div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
													<MapPin className="h-4 w-4 text-white" />
												</div>
											</div>
											<div className="ml-4 flex-1">
												<h3 className="font-medium">{stop.name}</h3>
												{stop.duration && (
													<p className="mt-1 text-sm text-black">
														{t('Stop_Label')} {stop.duration}
													</p>
												)}
												{stop.image && (
													<div className="mb-3 mt-3 overflow-hidden rounded-lg">
														<Image
															src={stop.image || '/placeholder.svg'}
															alt={stop.name}
															width={400}
															height={250}
															className="h-auto w-full object-cover"
														/>
													</div>
												)}
												<p className="mt-2 text-black">{stop.description}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
				{/* Right side: Map */}
				<div className="relative z-1 lg:w-3/5">
					<TourMap
						days={days}
						ref={mapRef}
						selectedDayIndex={selectedDayIndex === -1 ? null : selectedDayIndex}
						onDaySelect={handleDaySelect}
						height={600}
						monochrome={true}
					/>
				</div>
			</div>
			{/* SEO-friendly hidden content - visible to search engines but not to users */}
			<div className="sr-only">
				<h2>
					{title || t('Desert_Tour')} - {t('Complete_Itinerary')}
				</h2>
				{days.map((day, index) => (
					<div key={`seo-day-${index}`}>
						<h3>
							{t('Day_Heading')} {index + 1}: {day.name}
						</h3>
						<p>{day.description}</p>
						{day.stops &&
							day.stops.map((stop, stopIndex) => (
								<div key={`seo-stop-${index}-${stopIndex}`}>
									<h4>{stop.name}</h4>
									<p>{stop.description}</p>
									{stop.duration && (
										<p>
											{t('Duration_Label')} {stop.duration}
										</p>
									)}
								</div>
							))}
					</div>
				))}
			</div>
		</div>
	)
}
