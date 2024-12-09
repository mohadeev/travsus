'use client'

import React, { FC } from 'react'
import { Squares2X2Icon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { SkeletonLoader } from './SkeletonLoader'
import Image from 'next/image'
import { Route } from 'next'

export interface ListingExperiencesDetailsImagesProps {}

const ListingExperiencesDetailsImages: FC<
	ListingExperiencesDetailsImagesProps
> = ({}) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()

	const handleOpenModalImageGallery = () => {
		const current = new URLSearchParams(Array.from(searchParams.entries()))
		current.set('modal', 'PHOTO_TOUR_SCROLLABLE')
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
			{/* SINGLE HEADER */}
			{!PHOTOS ? (
				<SkeletonLoader />
			) : (
				<header className="rounded-md sm:rounded-xl">
					<div className="relative grid grid-cols-4 gap-1 sm:gap-2">
						<div
							className="relative col-span-2 row-span-2 cursor-pointer overflow-hidden rounded-md sm:rounded-xl"
							onClick={handleOpenModalImageGallery}
						>
							<Image
								fill
								src={PHOTOS?.length >= 1 ? PHOTOS[0] : ''}
								alt="photo 0"
								className="rounded-md object-cover sm:rounded-xl"
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
							/>
							<div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 transition-opacity hover:opacity-100"></div>
						</div>

						<div
							className="relative col-span-1 row-span-2 cursor-pointer overflow-hidden rounded-md sm:rounded-xl"
							onClick={handleOpenModalImageGallery}
						>
							<Image
								fill
								className="rounded-md object-cover sm:rounded-xl"
								src={PHOTOS?.length >= 1 ? PHOTOS[1] : ''}
								alt="photo 1"
								sizes="400px"
							/>
							<div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 transition-opacity hover:opacity-100"></div>
						</div>

						{PHOTOS?.filter((_: any, i: number) => i >= 2 && i < 4).map(
							(item: any, index: any) => (
								<div
									key={index}
									className={`relative overflow-hidden rounded-md sm:rounded-xl ${
										index >= 2 ? 'block' : ''
									}`}
								>
									<div className="aspect-h-3 aspect-w-4">
										<Image
											fill
											className="h-full w-full rounded-md object-cover sm:rounded-xl"
											src={item || ''}
											alt="photos"
											sizes="400px"
										/>
									</div>

									<div
										className="absolute inset-0 cursor-pointer bg-neutral-900 bg-opacity-20 opacity-0 transition-opacity hover:opacity-100"
										onClick={handleOpenModalImageGallery}
									/>
								</div>
							),
						)}

						<div
							className="absolute bottom-3 left-3 z-10 hidden cursor-pointer rounded-xl bg-neutral-100 px-4 py-2 text-neutral-500 hover:bg-neutral-200 md:flex md:items-center md:justify-center"
							onClick={handleOpenModalImageGallery}
						>
							<Squares2X2Icon className="h-5 w-5" />

							<span className="ml-2 text-sm font-medium text-neutral-800">
								Show all photos
							</span>
						</div>
					</div>
				</header>
			)}
		</>
	)
}

export default ListingExperiencesDetailsImages
