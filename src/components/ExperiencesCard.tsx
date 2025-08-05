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
import slugify from '@/utils/slugify'
import { useTranslations } from '@/lib/i18n'

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
	}: any = data
	const [priceData, setPriceData] = useState({})

	useEffect(() => {
		const pricesData = async () => {
			const prices: any = await updateLineItemsLogic({ tour: data, body: {} })
			setPriceData(prices)
		}
		pricesData()
	}, [])

	// const { booking, status } = useSelector((state: any) => state.bookingSlice)
	const { guests, lineItems, accommodation, transport, bookOwnHotels }: any =
		priceData || {}

	const totalGuests: number = guests?.guestAdults + guests?.guestChildren

	const filteredLineItems = lineItems?.filter(
		({ includeInTotal }: any) => includeInTotal === true,
	)
	const totalAmount = filteredLineItems?.reduce((total: any, item: any) => {
		return total + item.totalPrice
	}, 0)
	const priceStart = totalAmount / totalGuests

	const newLocation = region
	if (region?.length >= 1) {
		region[0].city = start?.name || ''
	}

	function convertString(input: string) {
		return input?.toLowerCase()?.replace(/\s+/g, '-')
	}

	const href =
		`/africa/morocco/errachidia/merzouga/tours/${slugify(title)}/q=tour?serviceId=${serviceId}` as Route

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
					galleryClass="rounded-xl" // Changed from rounded-xl to rounded-xl to match CountryCard
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
				className={`pt-3 ${
					size === 'small'
						? 'w-[220px] sm:w-[250px] md:w-[280px]'
						: 'mx-auto w-full max-w-[300px] sm:max-w-none'
				}`}
			>
				<div className="space-y-2">
					<div className="flex items-center text-sm leading-none text-neutral-500 dark:text-neutral-400">
						{size === 'default' && <MapPinIcon className="mr-1 h-4 w-4" />}
						<button className="rounded-md border border-black px-2 py-1 text-xs font-bold text-black">
							{data?.startAddress?.country} - {data?.startAddress?.city}
						</button>
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
						{formatCurrency(priceStart)}
						{size === 'default' && (
							<span className="ml-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
								{t('components_ExperiencesCard_Per_Person')}
							</span>
						)}
					</span>
					{/* <StartRating reviewCount={reviewCount} point={reviewStart} /> */}
				</div>
			</div>
		)
	}

	return (
		<div className={`nc-ExperiencesCard group relative ${className}`}>
			<Link href={href} className="block overflow-hidden rounded-xl">
				{renderSliderGallery()}
			</Link>
			<div>{renderContent()}</div>
		</div>
	)
}

export default ExperiencesCard
