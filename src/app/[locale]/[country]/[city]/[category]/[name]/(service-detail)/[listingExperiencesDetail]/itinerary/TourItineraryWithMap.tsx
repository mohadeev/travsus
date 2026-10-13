'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from '@/lib/i18n'
import TourMap from './TourMap'
import Image from 'next/image'
import { ChevronDown, MapPin } from 'lucide-react'

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

	const tabClass = (active: boolean) =>
		`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
			active
				? 'bg-brand-500 text-white'
				: 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
		}`

	return (
		<div className="overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800">
			{/* Day tabs: pick a day to see it on the map */}
			<div className="flex gap-1 overflow-x-auto border-b border-neutral-200 p-2 [scrollbar-width:none] dark:border-neutral-800 [&::-webkit-scrollbar]:hidden">
				<button type="button" className={tabClass(selectedDayIndex === -1)} onClick={() => handleDaySelect(-1)}>
					{t('Overview')}
				</button>
				{days.map((_, index) => (
					<button key={index} type="button" className={tabClass(selectedDayIndex === index)} onClick={() => handleDaySelect(index)}>
						{t('Day_Label')} {index + 1}
					</button>
				))}
			</div>

			<div className="relative z-1">
				<TourMap
					days={days}
					ref={mapRef}
					selectedDayIndex={selectedDayIndex === -1 ? null : selectedDayIndex}
					onDaySelect={handleDaySelect}
					height={420}
					monochrome={true}
				/>
			</div>

			{/* Day-by-day text: visible, collapsible, and fully in the HTML.
			    Opening a day also shows it on the map. */}
			<ol className="divide-y divide-neutral-200 border-t border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
				{days.map((day, index) => {
					const label = /^(day|día|jour|tag|giorno|dia)\s*\d/i.test(day.name || '')
						? day.name
						: `${t('Day_Heading')} ${index + 1}: ${day.name}`
					return (
						<li key={`day-${index}`}>
							<details
								className="group px-5 py-4 sm:px-6"
								open={index === 0}
								onToggle={(e) => (e.currentTarget as HTMLDetailsElement).open && handleDaySelect(index)}
							>
								<summary className="flex cursor-pointer list-none items-center gap-4 [&::-webkit-details-marker]:hidden">
									<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white">
										{index + 1}
									</span>
									<h3 className="flex-1 font-semibold">{label}</h3>
									<ChevronDown className="h-5 w-5 shrink-0 text-neutral-500 transition-transform group-open:rotate-180" />
								</summary>
								<div className="ml-12 mt-3 space-y-4">
									{day.description && (
										<p className="whitespace-pre-line text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
											{day.description}
										</p>
									)}
									{day.stops?.map((stop, stopIndex) => (
										<div key={`stop-${index}-${stopIndex}`} className="flex gap-3">
											<MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
											<div className="min-w-0">
												<h4 className="font-semibold">{stop.name}</h4>
												{stop.duration && (
													<p className="text-sm text-neutral-500">
														{t('Duration_Label')} {stop.duration}
													</p>
												)}
												{stop.image && (
													<div className="relative mt-2 aspect-[16/9] max-w-md overflow-hidden rounded-xl">
														<Image src={stop.image} alt={stop.name} fill sizes="448px" className="object-cover" />
													</div>
												)}
												{stop.description && (
													<p className="mt-1 text-[15px] text-neutral-700 dark:text-neutral-300">{stop.description}</p>
												)}
											</div>
										</div>
									))}
								</div>
							</details>
						</li>
					)
				})}
			</ol>
		</div>
	)
}
