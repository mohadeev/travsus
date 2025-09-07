'use client'
import { type FC, useEffect, useState, useRef } from 'react'
import CountryCard, { type CountryDataType } from './CountryCard'
import ContainerExperiencesCardSkeleton from './ContainerExperiencesCardSkeleton'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Heading2 from '@/shared/Heading2'
import ExperiencesCard from '@/components/ExperiencesCard'
import allToursFetch from '@/utils/allToursFetch'
import Heading from '@/shared/Heading'
import { useTranslations } from '@/lib/i18n'
import fetchRelatedTours from '@/utils/fetchRelatedTours'

// Default country codes to fetch
export interface ItemsCardListProps {
	className?: string
	itemClassName?: string
	cardSize?: 'default' | 'small'
	locationType: 'country' | 'city' | 'place' | 'tour' | 'relatedTours'
	countryId?: string // For cities within a country
	cityId?: string // For places within a city by name
	id?: string
	layout?: 'row' | 'column'
	heading?: string
	subHeading?: string
	limit?: number
	locationName?: string
	showArrowsIconsInPhone?: boolean // New parameter - opposite of hideArrowsIconsInPhone
	currentPage?: number // For tour pagination
}

const ItemsCardList: FC<ItemsCardListProps> = ({
	className = '',
	itemClassName = '',
	cardSize = 'default',
	locationType = 'country',
	countryId,
	cityId,
	id,
	layout = 'column',
	heading,
	subHeading,
	limit = 16,
	locationName = '',
	showArrowsIconsInPhone = false, // Default to false - arrows hidden on mobile by default
	currentPage = 1, // Default to first page for tours
}) => {
	const t = useTranslations('Jan03_ItemsCardList_k8m2')
	const [locations, setLocations] = useState<CountryDataType[]>([])
	const [toursData, setToursData] = useState<any[]>([])
	const [totalPages, setTotalPages] = useState(1)
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
				setError(null) // Clear previous errors

				// Handle tour type separately
				if (locationType === 'tour') {
					try {
						const data = await allToursFetch(currentPage)
						if (data?.allToursData && data.allToursData.length > 0) {
							setToursData(data.allToursData)
							setTotalPages(data.totalPages || 1)
							setError(null)
						} else {
							setError(t('No_Tours_Found'))
							setToursData([])
							setTotalPages(1)
						}
					} catch (err) {
						console.error('Error fetching tours:', err)
						setError(t('Failed_Load_Tours'))
						setToursData([])
						setTotalPages(1)
					}
					return // Exit early for tours
				}
				if (locationType === 'relatedTours') {
					try {
						const data = await fetchRelatedTours(id)
						console.log('data:::', data)
						if (data?.allToursData && data.allToursData.length > 0) {
							setToursData(data.allToursData)
							setTotalPages(data.totalPages || 1)
							setError(null)
						} else {
							setError(t('No_Tours_Found'))
							setToursData([])
							setTotalPages(1)
						}
					} catch (err) {
						console.error('Error fetching tours:', err)
						setError(t('Failed_Load_Tours'))
						setToursData([])
						setTotalPages(1)
					}
					return // Exit early for tours
				}

				let url = ''
				// Determine which API endpoint to use based on location type
				if (locationType === 'country') {
					url = `/api/countries?codes=${[]}&limit=${limit}`
				} else if (locationType === 'city' && countryId) {
					url = `/api/cities?countryId=${countryId}&limit=${limit}`
				} else if (locationType === 'place') {
					if (countryId) {
						url = `/api/placesByCityId?cityId=${cityId}&limit=${limit}`
					} else if (cityId) {
						url = `/api/placesByCityId?cityId=${cityId}&limit=${limit}`
					}
					url = `/api/placesByCityId?cityId=${cityId}&limit=${limit}`
				} else {
					url = `/api/cities/popular?limit=${limit}`
				}

				const response = await fetch(url)
				if (!response.ok) {
					throw new Error(
						`Failed to fetch ${locationType}s: ${response.status}`,
					)
				}

				const data = await response.json()

				// Process the data based on the location type and API response format
				let formattedLocations: CountryDataType[] = []

				if (
					locationType === 'country' &&
					data.countries &&
					Array.isArray(data.countries)
				) {
					formattedLocations = data.countries.map((country: any) => {
						const translation = country.content?.translations?.[0]
						const name = translation?.text || country.code3 || 'Unknown Country'
						const imageUrl =
							country.image?.url || country.image?.uploadFrom || ''
						return {
							id: country.id || Math.random().toString(),
							name: name,
							image: imageUrl,
							code3: country.code3 || '',
							url: `/destinations/${name}?lcId=${country?.id}`,
						}
					})
				} else if (
					locationType === 'place' &&
					cityId &&
					data.data &&
					Array.isArray(data.data)
				) {
					formattedLocations = data.data.map((place: any) => {
						return {
							id: place.id || Math.random().toString(),
							name: place.name || 'Unknown Place',
							image: place.image?.url || place.image?.uploadFrom || '',
							url: `/places/${place.id}`,
						}
					})
				} else if (data.cities || data.data) {
					const cityList = data.cities || data.data || []
					if (Array.isArray(cityList)) {
						formattedLocations = cityList.map((city: any) => {
							const translation = city.content?.translations?.[0]
							const name = translation?.text || city.name || t('Unknown_City')
							const cityCountryId = city.code3 || countryId || ''
							const imageUrl = city.image?.url || city.image?.uploadFrom || ''
							return {
								id: city.id || Math.random().toString(),
								name: name,
								image: imageUrl,
								code3: cityCountryId,
								url: `/destinations/${cityCountryId?.toLowerCase()}/${name.toLowerCase().replace(/\s+/g, '-')}?lcId=${city.id}`,
							}
						})
					}
				}

				// Set the results
				if (formattedLocations.length === 0) {
					setError(t('No_Locations_Found', { type: locationType }))
					setLocations([])
				} else {
					setLocations(formattedLocations)
					setError(null)
				}
			} catch (err) {
				console.error(`Error fetching ${locationType}s:`, err)
				setLocations([])
				setError(t('Failed_Load_Locations', { type: locationType }))
			} finally {
				// Add a small delay to prevent flashing
				setTimeout(() => {
					setLoading(false)
				}, 100)
			}
		}

		fetchLocations()
	}, [locationType, countryId, cityId, limit, currentPage, id])

	// Customize heading based on location type
	const getDefaultHeading = () => {
		if (locationType === 'country') return t('Popular_Countries')
		if (locationType === 'city')
			return countryId
				? t('Cities_In_Country', { country: locationName })
				: t('Popular_Cities')
		if (locationType === 'place')
			return cityId
				? t('Places_In_City', { city: cityId })
				: t('Places_To_Visit')
		if (locationType === 'tour') return t('Popular_Tours')
		return t('Popular_Destinations')
	}

	// Customize subheading based on location type
	const getDefaultSubheading = () => {
		if (locationType === 'country') return t('Explore_Top_Countries')
		if (locationType === 'city') return t('Discover_Amazing_Cities')
		if (locationType === 'place') return t('Must_See_Attractions')
		if (locationType === 'tour') return ''
		return ''
	}

	// Use custom headings if provided, otherwise use defaults
	const displayHeading = heading || getDefaultHeading()
	const displaySubheading = subHeading || getDefaultSubheading()

	return (
		<div className="my-10 px-4 md:px-0">
			{/* Heading section */}

			{loading ? (
				<div className="mb-5">
					<div className="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
					<div className="mt-2 h-4 w-96 animate-pulse rounded bg-gray-200"></div>
				</div>
			) : (
				<Heading desc={displaySubheading}>{displayHeading}</Heading>
			)}
			{loading && (
				<ContainerExperiencesCardSkeleton
					count={10}
					// size="default"
					layout={'row'}
				/>
			)}

			{/* Content section */}
			{loading ? (
				<div
					className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${className}`}
				>
					<ContainerExperiencesCardSkeleton
						count={10}
						size="default"
						layout={layout}
					/>
				</div>
			) : locationType === 'tour' || locationType === 'relatedTours' ? (
				// Tours content
				toursData.length === 0 && error ? (
					<div className="rounded-lg bg-amber-50 p-4 text-center text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
						<p>{error}</p>
					</div>
				) : toursData.length === 0 ? (
					<div className="rounded-lg bg-amber-50 p-4 text-center text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
						<p>{t('No_Tours_Found')}</p>
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
							// Column layout - grid view for tours
							<div
								className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${className}`}
							>
								{toursData.map((stay) => (
									<ExperiencesCard key={stay?.id} data={stay} />
								))}
							</div>
						) : (
							// Row layout - horizontal scrolling with navigation arrows for tours
							<div className="relative">
								{/* Left navigation arrow */}
								<button
									onClick={scrollLeft}
									className={`absolute left-0 top-1/3 z-10 ${showArrowsIconsInPhone ? 'flex' : 'hidden md:flex'} h-7 w-7 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10`}
									aria-label={t('Scroll_Left')}
								>
									<ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
								</button>

								{/* Scrollable container */}
								<div
									ref={scrollContainerRef}
									className="hide-scrollbar flex gap-5 overflow-x-auto py-0"
								>
									{!loading &&
										toursData.map((stay: any) => (
											<div key={stay?.id} className="flex-none">
												<ExperiencesCard
													data={{
														...stay,
														...{
															guests: { guestAdults: 17 },
														},
													}}
													size="small"
												/>
											</div>
										))}
									{loading && (
										<ContainerExperiencesCardSkeleton
											count={10}
											size="default"
											layout={layout}
										/>
									)}
								</div>

								{/* Right navigation arrow */}
								<button
									onClick={scrollRight}
									className={`absolute right-0 top-1/3 z-10 ${showArrowsIconsInPhone ? 'flex' : 'hidden md:flex'} h-7 w-7 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10`}
									aria-label={t('Scroll_Right')}
								>
									<ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
								</button>
							</div>
						)}
					</>
				)
			) : error && locations.length === 0 ? (
				<div className="rounded-lg bg-red-50 p-4 text-center text-red-700 dark:bg-red-900/20 dark:text-red-400">
					<p>{error}</p>
				</div>
			) : locations.length === 0 ? (
				<div className="rounded-lg bg-amber-50 p-4 text-center text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
					<p>{t('No_Locations_Found', { type: locationType })}</p>
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
								className={`absolute left-0 top-1/2 z-10 ${showArrowsIconsInPhone ? 'flex' : 'hidden md:flex'} h-7 w-7 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10`}
								aria-label={t('Scroll_Left')}
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
										<CountryCard
											className={'rounded-2xl'}
											data={item}
											size="small"
										/>
									</div>
								))}
							</div>

							{/* Right navigation arrow */}
							<button
								onClick={scrollRight}
								className={`absolute right-0 top-1/2 z-10 ${showArrowsIconsInPhone ? 'flex' : 'hidden md:flex'} h-7 w-7 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10`}
								aria-label={t('Scroll_Right')}
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

export default ItemsCardList
