'use client'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Heading2 from '@/shared/Heading2'

interface Collection {
	id: string
	title: string
	description: string
	imageUrl: string
}

interface CollectionsGridProps {
	layout?: 'row' | 'column'
	countryCode?: string // Country code like "MAR"
	cityName?: string // City name like "Marrakech"
	cityId?: string
	heading?: string
	subHeading?: string
	limit?: number
	showArrowsIconsInPhone?: boolean // New parameter - opposite of hideArrowsIconsInPhone
}

export default function CollectionsGrid({
	layout = 'column',
	countryCode,
	cityName,
	cityId,
	heading = 'Browse collections',
	subHeading = 'Get ideas on what to do, see, and eat',
	limit = 16,
	showArrowsIconsInPhone = false, // Default to false - arrows hidden on mobile by default
}: CollectionsGridProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null)
	const [collections, setCollections] = useState<Collection[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [locationName, setLocationName] = useState('')

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

	useEffect(() => {
		const fetchCollections = async () => {
			try {
				setLoading(true)
				let url = ''

				// Determine which API endpoint to use
				if (countryCode) {
					// Fetch places by country code
					url = `/api/placesByCountry?countryCode=${countryCode}&limit=${limit}`
				} else if (cityName) {
					// Fetch places by city name
					url = `/api/placesByCityId?cityId=${cityId}&limit=${limit}`
				} else {
					// Default to Marrakech if no location specified
					url = `/api/placesByCityId?cityId=${cityId}&limit=${limit}`
				}

				const response = await fetch(url)

				if (!response.ok) {
					throw new Error(`Failed to fetch collections`)
				}

				const data = await response.json()

				if (!data.found || !data.data || data.data.length === 0) {
					setError(`No collections found`)
					setCollections([])
					return
				}

				// Update location name from response
				if (data.city && data.city.name) {
					setLocationName(data.city.name)
				} else if (data.country && data.country.name) {
					setLocationName(data.country.name)
				}

				// Process the data based on the API response format
				let newCollections: Collection[] = []

				// Use categorized data from the API
				if (data.categorized) {
					newCollections = Object.entries(data.categorized)
						.map(([category, places]) => {
							// Get a representative place and image
							const placesArray = Array.isArray(places) ? places : [places]
							const firstPlace = placesArray[0]

							if (!firstPlace) return null

							const imageUrl =
								firstPlace.image?.url || firstPlace.image?.uploadFrom || '/'
							const name = firstPlace.name || category

							let description = ''
							if (countryCode) {
								const cityCount = new Set(placesArray.map((p) => p.cityId)).size
								description = `Discover ${placesArray.length} places across ${cityCount} cities in ${locationName}`
							} else {
								description = `Discover ${placesArray.length} places in ${locationName}`
							}

							return {
								id: category,
								title: name,
								description: description,
								imageUrl: imageUrl,
							}
						})
						.filter(Boolean)
				}

				setCollections(newCollections)
			} catch (err) {
				console.error('Error fetching collections:', err)
				setError(
					err instanceof Error ? err.message : 'An unknown error occurred',
				)
				setCollections([])
			} finally {
				setLoading(false)
			}
		}

		fetchCollections()
	}, [countryCode, cityId, limit])

	// Collection card component to avoid duplication
	const CollectionCard = ({ collection }: { collection: Collection }) => (
		<Link
			href={`/collections/${collection.id}${cityName ? `?city=${encodeURIComponent(cityName)}` : countryCode ? `?country=${countryCode}` : ''}`}
			className="group relative overflow-hidden transition-all duration-300"
		>
			<div
				className={`relative overflow-hidden rounded-md ${
					layout === 'row' ? 'w-[220px] sm:w-[250px] md:w-[280px]' : 'w-full'
				} ${layout === 'column' ? 'aspect-[1/1.1]' : 'aspect-[1/1.3]'}`}
			>
				<img
					src={collection.imageUrl || '/placeholder.svg'}
					alt={collection.title}
					fill
					className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					sizes={
						layout === 'row'
							? '(max-width: 640px) 220px, (max-width: 768px) 250px, 280px'
							: '(max-width: 640px) 100%, (max-width: 1024px) 50vw, 33vw'
					}
				/>

				{/* Black gradient from bottom for text visibility */}
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div>

				{/* White top hover effect */}
				<div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

				<h2 className="absolute bottom-0 left-0 z-10 pb-[12px] pl-[12px] text-[18px] font-bold text-white sm:text-[20px]">
					{collection.title}
				</h2>
			</div>
			<div
				className={`pt-3 ${layout === 'row' ? 'w-[220px] sm:w-[250px] md:w-[280px]' : 'w-full'}`}
			>
				<p className="line-clamp-2 text-sm text-gray-700">
					{collection.description}
				</p>
			</div>
		</Link>
	)

	return (
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

			<div className="my-10 px-4 md:px-0">
				<Heading2
					heading={heading}
					subHeading={
						locationName ? `${subHeading} in ${locationName}` : subHeading
					}
				/>

				{loading ? (
					// Loading state
					<div className="flex justify-center py-12">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
					</div>
				) : error ? (
					// Error state
					<div className="rounded-md bg-red-50 p-4 text-center">
						<p className="text-red-800">{error}</p>
					</div>
				) : collections.length === 0 ? (
					// Empty state
					<div className="rounded-md bg-gray-50 p-8 text-center">
						<p className="text-gray-600">
							No collections found for this location.
						</p>
					</div>
				) : layout === 'column' ? (
					// Column layout - stacked vertically with smaller cards
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
						{collections.map((collection) => (
							<CollectionCard key={collection.id} collection={collection} />
						))}
					</div>
				) : (
					// Row layout - horizontal scrolling with navigation arrows
					<div className="relative">
						{/* Left navigation arrow */}
						<button
							onClick={scrollLeft}
							className={`absolute left-0 top-1/2 z-10 ${showArrowsIconsInPhone ? 'flex' : 'hidden md:flex'} h-7 w-7 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10`}
							aria-label="Scroll left"
						>
							<ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
						</button>

						{/* Scrollable container */}
						<div
							ref={scrollContainerRef}
							className="hide-scrollbar flex gap-5 overflow-x-auto py-0"
						>
							{collections.map((collection) => (
								<div key={collection.id} className="flex-none">
									<CollectionCard collection={collection} />
								</div>
							))}
						</div>

						{/* Right navigation arrow */}
						<button
							onClick={scrollRight}
							className={`absolute right-0 top-1/2 z-10 ${showArrowsIconsInPhone ? 'flex' : 'hidden md:flex'} h-7 w-7 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10`}
							aria-label="Scroll right"
						>
							<ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
						</button>
					</div>
				)}
			</div>
		</>
	)
}
