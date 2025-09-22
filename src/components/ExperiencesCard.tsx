'use client'

import { type FC, useEffect, useState } from 'react'
import GallerySlider from '@/components/GallerySlider'
import { DEMO_EXPERIENCES_LISTINGS } from '@/data/listings'
import type { ExperiencesDataType } from '@/data/types'
import StartRating from '@/components/StartRating'
import BtnLikeIcon from '@/components/BtnLikeIcon'
import SaleOffBadge from '@/components/SaleOffBadge'
import Badge from '@/shared/Badge'
import Link from 'next/link'
import { MapPinIcon } from '@heroicons/react/24/outline'
import type { Route } from '@/routers/types'
import { updateLineItemsLogic } from '@/app/api/updateLineItems/updateLineItemsLogic'
import { formatCurrency } from '@/utils/formatCurrency'
import slugifySecond from '@/utils/slugify'
import { useTranslations } from '@/lib/i18n'
import { transliterate as tr, slugify } from 'transliteration'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import ListingBeforLoading from './ListingBeforLoading'
import { updateServiceState } from '@/app/[locale]/GlobalRedux/Features/creatingServiceSlice/creatingServiceSlice'
import { useDispatch } from 'react-redux'
import { User } from 'lucide-react'

export interface ExperiencesCardProps {
	className?: string
	ratioClass?: string
	data?: ExperiencesDataType
	size?: 'default' | 'small'
}

const DEMO_DATA: ExperiencesDataType = DEMO_EXPERIENCES_LISTINGS[0]

const ExperiencesCard: FC<ExperiencesCardProps> = ({
	size = 'default',
	className = '',
	data = DEMO_DATA,
	ratioClass = 'aspect-w-3 aspect-h-3',
}) => {
	const t = useTranslations('components_ExperiencesCard')
	const secondT = useTranslations('Jan03_TourHeader_x9k2')
	const T3 = useTranslations('TourPageMetadata')
	const locale = useLocale()

	const [clickedCard, setClickedCard] = useState(false)

	const {
		images: galleryImgs,
		address,
		name: title,
		like,
		saleOff,
		isAds,
		price,
		reviewStart,
		reviewCount,
		id: serviceId,
		region,
		start,
		liked,
		days,
		slugs,
		accommodations,
	}: any = data
	const [priceData, setPriceData] = useState({})
	const day = days[0]
	const { slug } = slugs?.find((lang) => locale === lang.language) || []

	useEffect(() => {
		const pricesData = async () => {
			const prices: any = await updateLineItemsLogic({
				tour: data,
				body: {
					// guests: { guestAdults: 18, guestChildren: 0 },
					// source: 'ExperiencesCard',
				},
			})
			setPriceData(prices)
		}
		pricesData()
	}, [])

	// const { booking, status } = useSelector((state: any) => state.bookingSlice)
	const { guests, lineItems, accommodation, transport, bookOwnHotels }: any =
		priceData || {}
	const guestChildren = guests?.guestChildren || 0
	const guestAdults = guests?.guestAdults || 0
	const totalGuests: number = guestChildren + guestAdults
	const filteredLineItems = lineItems?.filter(
		({ includeInTotal }: any) => includeInTotal === true,
	)
	const totalAmount = filteredLineItems?.reduce((total: any, item: any) => {
		return total + item.totalPrice
	}, 0)
	const priceStart = totalAmount / totalGuests

	if (region?.length >= 1) {
		region[0].city = start?.name || ''
	}

	const router = useRouter()
	const href =
		slug ||
		(`/${locale}/${slugifySecond(
			`${slugify(day?.country?.name)}/${slugify(day?.city?.name)}/${slugify(secondT('tours'))}/${slugify(title)}/${serviceId}`,
		)}` as Route)
	const [isLoading, setIsLoading] = useState(false)
	const dispatch = useDispatch()
	const handleCardClick = () => {
		setIsLoading(true)
		dispatch(updateServiceState({ path: 'service', value: data }))

		router.push(href)
		setClickedCard(true)
		setTimeout(() => {
			setClickedCard(false)
		}, 1000)
	}

	const renderSliderGallery = () => {
		return (
			<div
				className={`relative ${
					size === 'small'
						? 'w-[220px] sm:w-[250px] md:w-[280px]'
						: 'mx-auto w-full max-w-[300px] sm:max-w-none'
				}`}
			>
				<GallerySlider
					uniqueID={`ExperiencesCard_${serviceId}`}
					ratioClass={ratioClass}
					galleryImgs={galleryImgs}
					href={href}
					navigation={false}
					galleryClass="rounded-xl"
				/>
				<BtnLikeIcon
					onClick={() => {
						// alert('fdf')
					}}
					isLiked={liked}
					serviceId={serviceId}
					className="absolute right-3 top-3"
				/>
				{saleOff && <SaleOffBadge className="absolute left-3 top-3" />}
			</div>
		)
	}

	const renderContent = () => {
		return (
			<div
				className={`p-1 pt-3 ${
					size === 'small'
						? 'w-[220px] sm:w-[250px] md:w-[280px]'
						: 'mx-auto w-full max-w-[300px] sm:max-w-none'
				}`}
			>
				<div className="space-y-2">
					<div className="flex items-center text-sm leading-none text-neutral-500 dark:text-neutral-400">
						{size === 'default' && <MapPinIcon className="mr-1 h-4 w-4" />}
						{data?.days[0]?.country && data?.days[0]?.city && (
							<button className="rounded-md border border-black px-2 py-1 text-xs font-semibold text-black">
								{data?.days[0]?.country} - {data?.days[0]?.city}
							</button>
						)}
					</div>

					<div className="flex items-center">
						{isAds && (
							<Badge
								name={t('components_ExperiencesCard_Ads')}
								color="green"
								className="mr-2"
							/>
						)}
						<h2
							className={`font-semibold capitalize leading-tight ${size === 'default' ? 'text-base' : 'text-base'}`}
						>
							{title}
						</h2>
					</div>
				</div>
				<div className="mt-2 flex items-center justify-between">
					<span className="text-base font-semibold">
						{T3('TourPage_price_range', {
							minPrice: priceStart?.toFixed(2),
							currency: '€',
						})}
						<span className="ml-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
							{t('components_ExperiencesCard_Per_Person')}
						</span>
					</span>
					<div>
						<div className="ml-1 flex flex-row items-center justify-between text-sm font-normal text-neutral-500 dark:text-neutral-400">
							<span className="text-xs">
								<User />
							</span>
							x {totalGuests}
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div
			className={`nc-ExperiencesCard group relative ${className}`}
			onClick={handleCardClick}
		>
			<ListingBeforLoading isOpen={isLoading} />
			{/* Background animation - fast (300ms) */}
			<div
				className={`absolute inset-0 rounded-xl bg-gray-200 ${
					clickedCard ? 'opacity-100' : 'opacity-0'
				} z-0 transition-opacity duration-300`}
			></div>

			{/* Very thin border animation - slower (700ms) with delay */}
			<div
				className={`absolute inset-0 rounded-xl border ${
					clickedCard
						? 'border-gray-400 opacity-100'
						: 'border-transparent opacity-0'
				} pointer-events-none z-10 transition-all delay-300 duration-700`}
			></div>

			<div className="relative z-1 cursor-pointer">
				<div
					// href={href}
					// prefetch={false}
					className="block overflow-hidden rounded-xl"
				>
					<>
						{renderSliderGallery()}
						<div className="">{renderContent()}</div>
					</>
				</div>
			</div>
		</div>
	)
}

export default ExperiencesCard
