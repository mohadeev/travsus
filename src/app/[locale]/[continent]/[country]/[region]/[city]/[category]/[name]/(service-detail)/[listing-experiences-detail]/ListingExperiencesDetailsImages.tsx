'use client'

import type { FC } from 'react'
import { Squares2X2Icon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { SkeletonLoader } from './SkeletonLoader'
import Image from 'next/image'
import type { Route } from 'next'
import { useTranslations } from '@/lib/i18n'

export type ListingExperiencesDetailsImagesProps = {}

const ListingExperiencesDetailsImages: FC<
	ListingExperiencesDetailsImagesProps
> = ({}) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const t = useTranslations(
		'app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_ListingExperiencesDetailsImages',
	)

	const handleOpenModalImageGallery = (photoId: number) => {
		const current = new URLSearchParams(Array.from(searchParams.entries()))
		current.set('modal', 'PHOTO_TOUR_SCROLLABLE')
		current.set('photoId', photoId.toString())
		const search = current.toString()
		const query = search ? `?${search}` : ''
		router.push(`${pathname}${query}` as Route)
	}

	const { images }: any = useSelector(
		(state: any) => state.creatingServiceSlice.service,
	)

	const PHOTOS: any = images?.map(({ url }: any) => url)

	return (
		<>
			{!PHOTOS ? (
				<SkeletonLoader />
			) : (
				<header className="rounded-md sm:rounded-xl">
					{/* Mobile: Single Image Only */}
					<div className="block sm:hidden">
						<div
							className="aspect-h-3 aspect-w-4 relative cursor-pointer overflow-hidden"
							onClick={() => handleOpenModalImageGallery(0)}
						>
							<Image
								fill
								src={PHOTOS?.length >= 1 ? PHOTOS[0] : ''}
								alt="photo 0"
								className="object-cover"
								sizes="100vw"
							/>
							<div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 transition-opacity hover:opacity-100"></div>
						</div>
					</div>

					{/* Desktop: Grid Layout */}
					<div className="relative hidden grid-cols-4 gap-1 sm:grid sm:gap-2">
						{/* First Image */}
						<div
							className="relative col-span-2 row-span-2 cursor-pointer overflow-hidden rounded-md sm:rounded-xl"
							onClick={() => handleOpenModalImageGallery(0)}
						>
							<Image
								fill
								className="rounded-md object-cover sm:rounded-xl"
								src={PHOTOS?.length >= 1 ? PHOTOS[0] : ''}
								alt="photo 0"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
							/>
							<div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 transition-opacity hover:opacity-100"></div>
						</div>

						{/* Second Image */}
						<div
							className="relative col-span-1 row-span-2 cursor-pointer overflow-hidden rounded-md sm:rounded-xl"
							onClick={() => handleOpenModalImageGallery(1)}
						>
							<Image
								fill
								className="rounded-md object-cover sm:rounded-xl"
								src={PHOTOS?.length >= 2 ? PHOTOS[1] : ''}
								alt="photo 1"
								sizes="400px"
							/>
							<div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 transition-opacity hover:opacity-100"></div>
						</div>

						{/* Remaining Images */}
						{PHOTOS?.filter((_: any, i: number) => i >= 2 && i < 4).map(
							(item: any, index: number) => (
								<div
									key={index + 2}
									className="relative overflow-hidden rounded-md sm:rounded-xl"
								>
									<div className="aspect-h-3 aspect-w-4">
										<Image
											fill
											className="h-full w-full rounded-md object-cover sm:rounded-xl"
											src={item || ''}
											alt={`photo ${index + 2}`}
											sizes="400px"
										/>
									</div>
									<div
										className="absolute inset-0 cursor-pointer bg-neutral-900 bg-opacity-20 opacity-0 transition-opacity hover:opacity-100"
										onClick={() => handleOpenModalImageGallery(index + 2)}
									/>
								</div>
							),
						)}

						{/* Show All Photos Button */}
						<div
							className="absolute bottom-3 left-3 z-10 hidden cursor-pointer rounded-xl bg-neutral-100 px-4 py-2 text-neutral-500 hover:bg-neutral-200 md:flex md:items-center md:justify-center"
							onClick={() => handleOpenModalImageGallery(0)}
						>
							<Squares2X2Icon className="h-5 w-5" />
							<span className="ml-2 text-sm font-medium text-neutral-800">
								{t(
									'app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_ListingExperiencesDetailsImages_Show_All_Photos',
								)}
							</span>
						</div>
					</div>
				</header>
			)}
		</>
	)
}

export default ListingExperiencesDetailsImages
