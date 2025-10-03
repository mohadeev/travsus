'use client'

import { useTranslations } from '@/lib/i18n'

export const SkeletonLoader = () => {
	const t = useTranslations(
		'newServicedetailListingExperiencesDetailSkeletonLoader',
	)

	return (
		<header className="animate-pulse">
			{/* Mobile Skeleton */}
			<div className="block sm:hidden">
				<div className="aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-neutral-800"></div>
			</div>

			{/* Desktop Skeleton */}
			<div className="container hidden sm:block">
				<div className="grid grid-cols-4 gap-2 overflow-hidden rounded-2xl">
					{/* Main large skeleton */}
					<div className="aspect-square col-span-2 row-span-2 bg-gray-200 dark:bg-neutral-800"></div>

					{/* Second skeleton */}
					<div className="aspect-square col-span-1 row-span-2 bg-gray-200 dark:bg-neutral-800"></div>

					{/* Third skeleton */}
					<div className="aspect-[4/3] bg-gray-200 dark:bg-neutral-800"></div>

					{/* Fourth skeleton */}
					<div className="aspect-[4/3] bg-gray-200 dark:bg-neutral-800"></div>
				</div>

				{/* Button skeleton */}
				<div className="absolute bottom-4 left-4 z-10 h-10 w-32 rounded-xl bg-gray-200 dark:bg-neutral-700"></div>

				{/* Counter skeleton */}
				<div className="absolute right-4 top-4 z-10 h-7 w-16 rounded-full bg-gray-200 dark:bg-neutral-700"></div>
			</div>
		</header>
	)
}
