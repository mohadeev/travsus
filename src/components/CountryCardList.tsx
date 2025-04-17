'use client'

import { type FC, useEffect, useState, useRef } from 'react'
import CountryCard, { type CountryDataType } from './CountryCard'
import ContainerExperiencesCardSkeleton from './ContainerExperiencesCardSkeleton'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Heading2 from '@/shared/Heading2'

// Default country codes to fetch
const DEFAULT_COUNTRY_CODES = [
	'MAR',
	'FRA',
	'ITA',
	'JPN',
	'PER',
	'AUS',
	'VNM',
	'USA',
	'THA',
	'ARE',
	'ZAF',
	'GRC',
	'TUR',
	'PYF',
	'ESP',
	'EGY',
	'CAN',
	'IDN',
]

export interface LocationCardListProps {
	className?: string
	itemClassName?: string
	cardSize?: 'default' | 'small'
	locationType: 'country' | 'city' | 'place'
	countryCodes?: string[] // For countries
	countryCode?: string // For cities within a country
	cityName?: string // For places within a city by name
	layout?: 'row' | 'column'
	heading?: string
	subHeading?: string
	limit?: number
}

const LocationCardList: FC<LocationCardListProps> = ({
	className = '',
	itemClassName = '',
	cardSize = 'default',
	locationType = 'country',
	countryCodes = DEFAULT_COUNTRY_CODES,
	countryCode,
	cityName,
	layout = 'column',
	heading = 'Popular Destinations',
	subHeading = 'Explore top destinations around the world',
	limit = 16,
}) => {
	const [locations, setLocations] = useState<CountryDataType[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
		}
	}

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
		}
	}

	// Mock data for fallback
	const mockLocations: CountryDataType[] = []

	useEffect(() => {
		const fetchLocations = async () => {
			try {
				setLoading(true)
				let url = ''

				// Determine which API endpoint to use based on location type
				if (locationType === 'country') {
					// Fetch countries
					const codesParam = countryCodes.join(',')
					url = `/api/countries?codes=${codesParam}&limit=${limit}`
				} else if (locationType === 'city' && countryCode) {
					// Fetch cities for a specific country
					url = `/api/cities?countryCode=${countryCode}&limit=${limit}`
				} else if (locationType === 'place' && cityName) {
					// Fetch places for a specific city by name
					url = `/api/placesByCityName?name=${encodeURIComponent(cityName)}&limit=${limit}`
				} else {
					// Default to popular cities
					url = `/api/cities/popular?limit=${limit}`
				}

				const response = await fetch(url)

				if (!response.ok) {
					throw new Error(`Failed to fetch ${locationType}s`)
				}

				const data = await response.json()

				// Process the data based on the location type and API response format
				let formattedLocations: CountryDataType[] = []

				if (locationType === 'country' && data.countries) {
					// Format country data
					formattedLocations = data.countries.map((country: any) => {
						const translation = country.content?.translations?.[0]
						const name = translation?.text || country.code3
						const imageUrl = country.image?.url || country.image?.uploadFrom

						return {
							id: country.id,
							name: name,
							image: imageUrl,
							code3: country.code3,
							url: `/destinations/${country.code3.toLowerCase()}`,
						}
					})
				} else if (locationType === 'place' && cityName && data.data) {
					// Format places data
					formattedLocations = data.data.map((place: any) => {
						return {
							id: place.id,
							name: place.name,
							image: place.image?.url || place.image?.uploadFrom,
							url: `/places/${place.id}`,
						}
					})
				} else if (data.cities || data.data) {
					// Format city data
					const cityList = data.cities || data.data || []
					formattedLocations = cityList.map((city: any) => {
						const translation = city.content?.translations?.[0]
						const name = translation?.text || city.name || 'Unknown City'
						const cityCountryCode = city.code3 || countryCode
						const imageUrl = city.image?.url || city.image?.uploadFrom

						return {
							id: city.id,
							name: name,
							image: imageUrl,
							code3: cityCountryCode,
							url: `/destinations/${cityCountryCode?.toLowerCase()}/${name.toLowerCase().replace(/\s+/g, '-')}`,
						}
					})
				}

				if (formattedLocations.length === 0) {
					setError(`No ${locationType}s found`)
					// Use mock data if no results
					setLocations(mockLocations)
				} else {
					setLocations(formattedLocations)
				}
			} catch (err) {
				console.error(`Error fetching ${locationType}s:`, err)
				// Use mock data if API fails
				setLocations(mockLocations)
				setError(`Failed to load ${locationType}s`)
			} finally {
				setLoading(false)
			}
		}

		fetchLocations()
	}, [locationType, countryCodes, countryCode, cityName, limit])

	// Customize heading based on location type
	const getDefaultHeading = () => {
		if (locationType === 'country') return 'Popular Countries'
		if (locationType === 'city')
			return countryCode ? `Cities in ${countryCode}` : 'Popular Cities'
		if (locationType === 'place')
			return cityName ? `Places in ${cityName}` : 'Places to Visit'
		return 'Popular Destinations'
	}

	// Customize subheading based on location type
	const getDefaultSubheading = () => {
		if (locationType === 'country')
			return 'Explore top countries around the world'
		if (locationType === 'city') return 'Discover amazing cities to visit'
		if (locationType === 'place') return 'Must-see attractions and experiences'
		return 'Explore top destinations around the world'
	}

	// Use custom headings if provided, otherwise use defaults
	const displayHeading = heading || getDefaultHeading()
	const displaySubheading = subHeading || getDefaultSubheading()

	return (
		<div className="my-15 px-4 md:px-0">
			{/* Heading section */}
			{loading ? (
				<div className="mb-5">
					<div className="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
					<div className="mt-2 h-4 w-96 animate-pulse rounded bg-gray-200"></div>
				</div>
			) : (
				<Heading2 heading={displayHeading} subHeading={displaySubheading} />
			)}

			{/* Content section */}
			{loading ? (
				<div
					className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${className}`}
				>
					<ContainerExperiencesCardSkeleton />
				</div>
			) : error && locations.length === 0 ? (
				<div className="rounded-lg bg-red-50 p-4 text-center text-red-700 dark:bg-red-900/20 dark:text-red-400">
					<p>{error}</p>
				</div>
			) : locations.length === 0 ? (
				<div className="rounded-lg bg-amber-50 p-4 text-center text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
					<p>No {locationType}s found</p>
				</div>
			) : (
				<>
					{/* Custom CSS for hiding scrollbars */}
					<style jsx global>{`
						.hide-scrollbar::-webkit-scrollbar {
							display: none;
						}
						.hide-scrollbar {
							-ms-overflow-style: none;
							scrollbar-width: none;
						}
					`}</style>

					{layout === 'column' ? (
						// Column layout - grid view
						<div
							className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${className}`}
						>
							{locations.map((item) => (
								<div key={item.id} className={`${itemClassName}`}>
									<CountryCard data={item} size={cardSize} />
								</div>
							))}
						</div>
					) : (
						// Row layout - horizontal scrolling with navigation arrows
						<div className="relative">
							{/* Left navigation arrow */}
							<button
								onClick={scrollLeft}
								className="absolute left-0 top-1/2 z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10"
								aria-label="Scroll left"
							>
								<ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
							</button>

							{/* Scrollable container */}
							<div
								ref={scrollContainerRef}
								className={`hide-scrollbar flex gap-5 overflow-x-auto py-0 ${className}`}
							>
								{locations.map((item) => (
									<div key={item.id} className={`flex-none ${itemClassName}`}>
										<CountryCard data={item} size="small" />
									</div>
								))}
							</div>

							{/* Right navigation arrow */}
							<button
								onClick={scrollRight}
								className="absolute right-0 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10"
								aria-label="Scroll right"
							>
								<ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
							</button>
						</div>
					)}
				</>
			)}
		</div>
	)
}

export default LocationCardList
