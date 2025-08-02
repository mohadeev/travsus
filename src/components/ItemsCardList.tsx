import { useTranslations } from '@/lib/i18n';
import { type FC, useEffect, useState, useRef } from 'react'
import CountryCard, { type CountryDataType } from './CountryCard'
import ContainerExperiencesCardSkeleton from './ContainerExperiencesCardSkeleton'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Heading2 from '@/shared/Heading2'
import ExperiencesCard from '@/components/ExperiencesCard'
import allToursFetch from '@/utils/allToursFetch'
import Heading from '@/shared/Heading'

export interface ItemsCardListProps {
	className?: string
	itemClassName?: string
	cardSize?: 'default' | 'small'
	locationType: 'country' | 'city' | 'place' | 'tour'
	countryId?: string
	cityId?: string
	layout?: 'row' | 'column'
	heading?: string
	subHeading?: string
	limit?: number
	showArrowsIconsInPhone?: boolean
	currentPage?: number
}

const ItemsCardList: FC<ItemsCardListProps> = ({
	className = '',
	itemClassName = '',
	cardSize = 'default',
	locationType = 'country',
	countryId,
	cityId,
	layout = 'column',
	heading = 'Popular Destinations',
	subHeading = 'Explore top destinations around the world',
	limit = 16,
	showArrowsIconsInPhone = false,
	currentPage = 1,
}) => {
	const t = useTranslations("components_ItemsCardList");
	const [locations, setLocations] = useState<CountryDataType[]>([])
	const [toursData, setToursData] = useState<any[]>([])
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(false)
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

	const mockLocations: CountryDataType[] = []

	useEffect(() => {
		const fetchLocations = async () => {
			try {
				// setLoading(true)

				if (locationType === 'tour') {
					try {
						const data = await allToursFetch(currentPage)
						if (data?.allToursData) {
							setToursData(data.allToursData)
							setTotalPages(data.totalPages)
						} else {
							setError(t('components_ItemsCardList_No_Tours_Found'))
							setToursData([])
						}
					} catch (err) {
						console.error(t('components_ItemsCardList_Error_Fetching_Tours'), err)
						setError(t('components_ItemsCardList_Failed_To_Load_Tours'))
						setToursData([])
					} finally {
						setLoading(false)
					}
					return
				}

				let url = ''
				if (locationType === 'country') {
					url = `/api/countries?codes=${[]}&limit=${limit}`
				} else if (locationType === 'city' && countryId) {
					url = `/api/cities?countryId=${countryId}&limit=${limit}`
				} else if (locationType === 'place' && cityId) {
					url = `/api/placesByCityId?cityId=${cityId}&limit=${limit}`
				} else {
					url = `/api/cities/popular?limit=${limit}`
				}

				const response = await fetch(url)

				if (!response.ok) {
					throw new Error(t('components_ItemsCardList_Failed_To_Fetch_Locations'))
				}

				const data = await response.json()
				console.log(data)

				let formattedLocations: CountryDataType[] = []

				if (locationType === 'country' && data.countries) {
					formattedLocations = data.countries.map((country: any) => {
						const translation = country.content?.translations?.[0]
						const name = translation?.text || country.code3
						const imageUrl = country.image?.url || country.image?.uploadFrom

						return {
							id: country.id,
							name: name,
							image: imageUrl,
							code3: country.code3,
							url: `/destinations/${name}?lcId=${country?.id}`,
						}
					})
				} else if (locationType === 'place' && cityId && data.data) {
					formattedLocations = data.data.map((place: any) => {
						return {
							id: place.id,
							name: place.name,
							image: place.image?.url || place.image?.uploadFrom,
							url: `/places/${place.id}`,
						}
					})
				} else if (data.cities || data.data) {
					const cityList = data.cities || data.data || []
					formattedLocations = cityList.map((city: any) => {
						const translation = city.content?.translations?.[0]
						const name = translation?.text || city.name || t('components_ItemsCardList_Unknown_City')
						const cityCountryId = city.code3 || countryId
						const imageUrl = city.image?.url || city.image?.uploadFrom

						return {
							id: city.id,
							name: name,
							image: imageUrl,
							code3: cityCountryId,
							url: `/destinations/${cityCountryId?.toLowerCase()}/${name.toLowerCase().replace(/\s+/g, '-')}?lcId=${city.id}`,
						}
					})
				}

				if (formattedLocations.length === 0) {
					setError(t('components_ItemsCardList_No_Locations_Found'))
					setLocations(mockLocations)
				} else {
					setLocations(formattedLocations)
				}
			} catch (err) {
				console.error(t('components_ItemsCardList_Error_Fetching_Locations'), err)
				setLocations(mockLocations)
				setError(t('components_ItemsCardList_Failed_To_Load_Locations'))
			} finally {
				setLoading(false)
			}
		}

		fetchLocations()
	}, [locationType, countryId, cityId, limit, currentPage, t])

	const getDefaultHeading = () => {
		if (locationType === 'country') return t('components_ItemsCardList_Popular_Countries')
		if (locationType === 'city')
			return countryId ? `${t('components_ItemsCardList_Cities_In')} ${countryId}` : t('components_ItemsCardList_Popular_Cities')
		if (locationType === 'place')
			return cityId ? `${t('components_ItemsCardList_Places_In')} ${cityId}` : t('components_ItemsCardList_Places_To_Visit')
		if (locationType === 'tour') return t('components_ItemsCardList_Popular_Tours')
		return t('components_ItemsCardList_Popular_Destinations')
	}

	const getDefaultSubheading = () => {
		if (locationType === 'country')
			return t('components_ItemsCardList_Explore_Top_Countries')
		if (locationType === 'city') return t('components_ItemsCardList_Discover_Amazing_Cities')
		if (locationType === 'place') return t('components_ItemsCardList_Must_See_Attractions')
		if (locationType === 'tour') return ''
		return ''
	}

	const displayHeading = heading || getDefaultHeading()
	const displaySubheading = subHeading || getDefaultSubheading()

	return (
		<div className="my-10 px-4 md:px-0">
			{loading ? (
				<div className="mb-5">
					<div className="h-8 w-64 animate-pulse rounded bg-gray-200"></div>
					<div className="mt-2 h-4 w-96 animate-pulse rounded bg-gray-200"></div>
				</div>
			) : (
				<Heading desc={displaySubheading}>{displayHeading}</Heading>
			)}

			{loading ? (
				<div
					className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${className}`}
				>
					<ContainerExperiencesCardSkeleton />
				</div>
			) : locationType === 'tour' ? (
				toursData.length === 0 ? (
					<div className="rounded-lg bg-amber-50 p-4 text-center text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
						<p>{t('components_ItemsCardList_No_Tours_Found')}</p>
					</div>
				) : (
					<>
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
							<div
								className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ${className}`}
							>
								{toursData.map((stay) => (
									<ExperiencesCard key={stay?.id} data={stay} />
								))}
							</div>
						) : (
							<div className="relative">
								<button
									onClick={scrollLeft}
									className={`absolute left-0 top-1/3 z-10 ${showArrowsIconsInPhone ? 'flex' : 'hidden md:flex'} h-7 w-7 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10`}
									aria-label={t('components_ItemsCardList_Scroll_Left')}
								>
									<ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
								</button>

								<div
									ref={scrollContainerRef}
									className="hide-scrollbar flex gap-5 overflow-x-auto py-0"
								>
									{!loading &&
										toursData.map((stay: any) => (
											<div key={stay?.id} className="flex-none">
												<ExperiencesCard data={stay} size="small" />
											</div>
										))}
									{loading && <ContainerExperiencesCardSkeleton />}
								</div>

								<button
									onClick={scrollRight}
									className={`absolute right-0 top-1/3 z-10 ${showArrowsIconsInPhone ? 'flex' : 'hidden md:flex'} h-7 w-7 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10`}
									aria-label={t('components_ItemsCardList_Scroll_Right')}
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
					<p>{t('components_ItemsCardList_No_Locations_Found')}</p>
				</div>
			) : (
				<>
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
						<div className="relative">
							<button
								onClick={scrollLeft}
								className={`absolute left-0 top-1/2 z-10 ${showArrowsIconsInPhone ? 'flex' : 'hidden md:flex'} h-7 w-7 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10`}
								aria-label={t('components_ItemsCardList_Scroll_Left')}
							>
								<ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
							</button>

							<div
								ref={scrollContainerRef}
								className={`hide-scrollbar flex gap-2 overflow-x-auto py-0 ${className}`}
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

							<button
								onClick={scrollRight}
								className={`absolute right-0 top-1/2 z-10 ${showArrowsIconsInPhone ? 'flex' : 'hidden md:flex'} h-7 w-7 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full border border-black bg-white transition-colors duration-200 hover:bg-black hover:text-white focus:outline-none sm:h-8 sm:w-8 md:h-10 md:w-10`}
								aria-label={t('components_ItemsCardList_Scroll_Right')}
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