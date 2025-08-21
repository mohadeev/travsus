'use client'

import type { FC } from 'react'
import { Squares2X2Icon, PlayIcon } from '@heroicons/react/24/outline'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux'
import { SkeletonLoader } from './SkeletonLoader'
import Image from 'next/image'
import type { Route } from 'next'
import { useTranslations } from '@/lib/i18n'
import { useState } from 'react'

export type ListingExperiencesDetailsImagesProps = {}

const ListingExperiencesDetailsImages: FC<
	ListingExperiencesDetailsImagesProps
> = ({}) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set())

	const t = useTranslations('ListingExperiencesDetailsImages')

	const handleOpenModalImageGallery = (photoId: number) => {
		const current = new URLSearchParams(Array.from(searchParams.entries()))
		current.set('modal', 'PHOTO_TOUR_SCROLLABLE')
		current.set('photoId', photoId.toString())
		const search = current.toString()
		const query = search ? `?${search}` : ''
		router.push(`${pathname}${query}` as Route)
	}

	const handleImageError = (index: number) => {
		setImageLoadErrors((prev) => new Set(prev).add(index))
	}

	const { images }: any = useSelector(
		(state: any) => state.creatingServiceSlice.service,
	)

	const PHOTOS: any = images?.map(({ url }: any) => url) || []
	const totalPhotos = PHOTOS.length

	return (
		<>
			{!PHOTOS || PHOTOS.length === 0 ? (
				<SkeletonLoader />
			) : (
				<header className="group relative">
					{/* Mobile: Single Image Only */}
					<div className="block sm:hidden">
						<div
							className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-gray-100"
							onClick={() => handleOpenModalImageGallery(0)}
						>
							<Image
								fill
								src={PHOTOS[0] || ''}
								alt="Tour photo"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
								sizes="100vw"
								priority
								onError={() => handleImageError(0)}
							/>

							{/* Mobile overlay gradient */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

							{/* Mobile photo count indicator */}
							{totalPhotos > 1 && (
								<div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-white backdrop-blur-sm">
									<Squares2X2Icon className="h-4 w-4" />
									<span className="text-sm font-medium">{totalPhotos}</span>
								</div>
							)}

							{/* Mobile play button overlay */}
							<div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
									<PlayIcon className="h-6 w-6 text-black" />
								</div>
							</div>
						</div>
					</div>

					{/* Desktop: Grid Layout */}
					<div className="container relative hidden sm:block">
						<div className="grid grid-cols-4 gap-2 overflow-hidden rounded-2xl">
							{/* Main Large Image */}
							<div
								className="group/image relative col-span-2 row-span-2 cursor-pointer overflow-hidden bg-gray-100"
								onClick={() => handleOpenModalImageGallery(0)}
							>
								<Image
									fill
									className="object-cover transition-all duration-500 group-hover/image:scale-105"
									src={PHOTOS[0] || ''}
									alt="Main tour photo"
									sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
									priority
									onError={() => handleImageError(0)}
								/>
								<div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100" />
							</div>

							{/* Second Image */}
							<div
								className="group/image relative col-span-1 row-span-2 cursor-pointer overflow-hidden bg-gray-100"
								onClick={() => handleOpenModalImageGallery(1)}
							>
								{PHOTOS[1] && (
									<>
										<Image
											fill
											className="object-cover transition-all duration-500 group-hover/image:scale-105"
											src={PHOTOS[1] || '/placeholder.svg'}
											alt="Tour photo 2"
											sizes="400px"
											onError={() => handleImageError(1)}
										/>
										<div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100" />
									</>
								)}
							</div>

							{/* Third Image */}
							<div
								className="group/image relative cursor-pointer overflow-hidden bg-gray-100"
								onClick={() => handleOpenModalImageGallery(2)}
							>
								<div className="aspect-[4/3]">
									{PHOTOS[2] && (
										<>
											<Image
												fill
												className="object-cover transition-all duration-500 group-hover/image:scale-105"
												src={PHOTOS[2] || '/placeholder.svg'}
												alt="Tour photo 3"
												sizes="400px"
												onError={() => handleImageError(2)}
											/>
											<div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 opacity-0 transition-opacity duration-300 group-hover/image:opacity-100" />
										</>
									)}
								</div>
							</div>

							{/* Fourth Image with overlay if more photos exist */}
							<div
								className="group/image relative cursor-pointer overflow-hidden bg-gray-100"
								onClick={() => handleOpenModalImageGallery(3)}
							>
								<div className="aspect-[4/3]">
									{PHOTOS[3] && (
										<>
											<Image
												fill
												className="object-cover transition-all duration-500 group-hover/image:scale-105"
												src={PHOTOS[3] || '/placeholder.svg'}
												alt="Tour photo 4"
												sizes="400px"
												onError={() => handleImageError(3)}
											/>

											{/* Show remaining photos overlay */}
											{totalPhotos > 4 && (
												<div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 group-hover/image:bg-black/70">
													<div className="text-center text-white">
														<Squares2X2Icon className="mx-auto mb-2 h-8 w-8" />
														<span className="text-lg font-semibold">
															+{totalPhotos - 4}
														</span>
														<p className="text-sm opacity-90">
															{t('more_photos')}
														</p>
													</div>
												</div>
											)}
										</>
									)}
								</div>
							</div>
						</div>

						{/* Enhanced Show All Photos Button - Increased spacing from edges */}
						<button
							onClick={() => handleOpenModalImageGallery(0)}
							className="absolute bottom-6 left-6 z-10 flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-black shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
						>
							<Squares2X2Icon className="h-5 w-5" />
							<span className="text-sm font-semibold">
								{t('show_all_photos', { count: totalPhotos })}
							</span>
						</button>

						{/* Photo counter badge - Increased spacing from edges */}
						<div className="absolute right-6 top-6 z-10 rounded-full bg-black/70 px-3 py-1.5 text-white backdrop-blur-sm">
							<span className="text-sm font-medium">1 / {totalPhotos}</span>
						</div>
					</div>

					{/* Loading overlay for better UX */}
					<div className="absolute inset-0 flex items-center justify-center bg-gray-100 opacity-0 transition-opacity duration-300 group-hover:opacity-0">
						<div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
					</div>
				</header>
			)}
		</>
	)
}

export default ListingExperiencesDetailsImages
