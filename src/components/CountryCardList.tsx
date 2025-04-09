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
	'USA',
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

export interface CountryCardListProps {
	className?: string
	itemClassName?: string
	cardSize?: 'default' | 'small'
	countryCodes?: string[]
	layout?: 'row' | 'column'
	heading?: string
	subHeading?: string
}

const CountryCardList: FC<CountryCardListProps> = ({
	className = '',
	itemClassName = '',
	cardSize = 'default',
	countryCodes = DEFAULT_COUNTRY_CODES,
	layout = 'column',
	heading = 'Popular Destinations',
	subHeading = 'Explore top destinations around the world',
}) => {
	const [countries, setCountries] = useState<CountryDataType[]>([])
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

	// For testing/development - use this mock data if API fails
	const mockCountries: CountryDataType[] = [
		{
			id: '1',
			name: 'Morocco',
			image:
				'https://images.pexels.com/photos/3889986/pexels-photo-3889986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			code3: 'MAR',
		},
		{
			id: '2',
			name: 'France',
			image:
				'https://images.pexels.com/photos/3889986/pexels-photo-3889986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			code3: 'FRA',
		},
		{
			id: '3',
			name: 'Italy',
			image:
				'https://images.pexels.com/photos/3889986/pexels-photo-3889986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			code3: 'ITA',
		},
		{
			id: '4',
			name: 'Japan',
			image:
				'https://images.pexels.com/photos/3889986/pexels-photo-3889986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			code3: 'JPN',
		},
		{
			id: '5',
			name: 'United States',
			image:
				'https://images.pexels.com/photos/3889986/pexels-photo-3889986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			code3: 'USA',
		},
		{
			id: '5',
			name: 'United States',
			image:
				'https://images.pexels.com/photos/3889986/pexels-photo-3889986.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
			code3: 'IDA',
		},
	]

	useEffect(() => {
		const fetchCountries = async () => {
			try {
				setLoading(true)
				// Join the country codes with commas for the API query
				const codesParam = countryCodes.join(',')
				const response = await fetch(`/api/countries?codes=${codesParam}`)

				if (!response.ok) {
					throw new Error('Failed to fetch countries')
				}

				const data = await response.json()

				if (!data.countries || data.countries.length === 0) {
					setError('No countries found')
					setLoading(false)
					return
				}

				// Transform API data to match CountryDataType
				const formattedCountries = data.countries.map((country: any) => {
					// Get the English name from translations
					const translation = country.content.translations[0]
					const name = translation?.text || country.code3

					// Get image URL from the country data
					const imageUrl = country.image?.url || country.image?.uploadFrom

					return {
						id: country.id,
						name: name,
						image: imageUrl, // Pass the image URL to the CountryCard
						year: '2025',
						code3: country.code3,
						url: `/destinations/${country.code3.toLowerCase()}`,
					}
				})

				setCountries(formattedCountries)
			} catch (err) {
				console.error('Error fetching countries:', err)
				// Use mock data if API fails
				setCountries(mockCountries)
			} finally {
				setLoading(false)
			}
		}

		fetchCountries()
	}, [countryCodes])

	return (
		<div>
			{/* Heading section */}
			{loading ? (
				<div className="mb-5">
					<div className="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
					<div className="mt-2 h-4 w-96 animate-pulse rounded bg-gray-200"></div>
				</div>
			) : (
				<Heading2 heading={heading} subHeading={subHeading} />
			)}

			{/* Content section */}
			{loading ? (
				<div
					className={`nc-CountryCardList grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${className}`}
				>
					<ContainerExperiencesCardSkeleton />
				</div>
			) : error && countries.length === 0 ? (
				<div className="rounded-lg bg-red-50 p-4 text-center text-red-700 dark:bg-red-900/20 dark:text-red-400">
					<p>{error}</p>
				</div>
			) : countries.length === 0 ? (
				<div className="rounded-lg bg-amber-50 p-4 text-center text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
					<p>No destinations found</p>
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
							className={`nc-CountryCardList grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${className}`}
						>
							{countries.map((item) => (
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
								{countries.map((item) => (
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

export default CountryCardList
