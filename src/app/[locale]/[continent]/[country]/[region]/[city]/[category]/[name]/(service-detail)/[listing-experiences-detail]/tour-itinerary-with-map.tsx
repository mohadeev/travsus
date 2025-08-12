'use client'

import { useState, useRef } from 'react'
import { useTranslations } from '@/lib/i18n'
import TourMap from './tour-map'

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
		'app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_touritinerarywithmap',
	)

	const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0)
	const mapRef = useRef(null)

	// Function to handle day selection
	const handleDaySelect = (dayIndex: number) => {
		setSelectedDayIndex(dayIndex)
		if (mapRef.current && typeof mapRef.current.zoomToDay === 'function') {
			mapRef.current.zoomToDay(dayIndex)
		}
	}

	return (
		<div className="bg-white">
			{/* Header */}
			<div className="mb-6">
				<h2 className="mb-6 text-2xl font-bold text-gray-900">Itinerario</h2>
			</div>

			{/* Main Content - Side by side layout */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* Left Side - Timeline */}
				<div className="space-y-0">
					{/* Start Point */}
					<div className="relative mb-8 flex items-start gap-4">
						<div className="relative flex-shrink-0">
							<div className="relative rounded-full bg-yellow-400 px-4 py-2 text-sm font-bold text-black">
								Inicio
								{/* Speech bubble tail */}
								<div className="absolute left-4 top-full h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-yellow-400"></div>
							</div>
							{/* Dotted line */}
							<div className="absolute left-1/2 top-12 h-12 w-0.5 -translate-x-0.5 transform border-l-2 border-dotted border-gray-400"></div>
						</div>
						<div className="flex-1 pt-2">
							<h3 className="mb-1 font-medium text-gray-900">Empezará en</h3>
							<p className="mb-2 font-medium text-gray-700">
								Pl. de San Miguel, 7
							</p>
							<button className="text-sm text-blue-600 hover:underline">
								Ver dirección y detalles
							</button>
						</div>
					</div>

					{/* Days Loop */}
					<div className="space-y-0">
						{days.map((day, index) => (
							<div key={index} className="relative mb-8 flex items-start gap-4">
								<div className="relative flex-shrink-0">
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-sm font-bold text-white">
										{index + 1}
									</div>
									{/* Dotted line - only show if not last item */}
									{index < days.length - 1 && (
										<div className="absolute left-1/2 top-10 h-12 w-0.5 -translate-x-0.5 transform border-l-2 border-dotted border-gray-400"></div>
									)}
								</div>
								<div className="flex-1 pt-2">
									<h3 className="mb-1 font-medium text-gray-900">
										{day.cityName || day.name}
									</h3>
									<p className="mb-2 text-sm text-gray-600">
										Parada: 60 minutos
										{day.description && ` - ${day.description}`}
									</p>
									<button className="text-sm text-blue-600 hover:underline">
										{day.stops && day.stops.length > 0
											? 'Ver detalles y foto'
											: 'Ver detalles'}
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Right Side - Map */}
				<div className="relative">
					<div className="sticky top-4">
						<div className="relative h-96 overflow-hidden rounded-lg bg-gray-100">
							<TourMap
								days={days}
								ref={mapRef}
								selectedDayIndex={selectedDayIndex}
								onDaySelect={handleDaySelect}
								height={384}
								monochrome={false}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* SEO-friendly hidden content */}
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
