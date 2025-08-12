'use client'

import { useTranslations } from '@/lib/i18n'

export const SkeletonLoader = () => {
	const t = useTranslations(
		'app_locale_continent_country_region_city_category_name_servicedetail_listingexperiencesdetail_SkeletonLoader',
	)

	return (
		<header className="rounded-md sm:rounded-xl">
			{/* Mobile: Single Image Skeleton */}
			<div className="block sm:hidden">
				<div className="aspect-h-3 aspect-w-4 relative overflow-hidden">
					<div className="h-full w-full animate-pulse bg-gray-200 dark:bg-neutral-800"></div>
				</div>
			</div>

			{/* Desktop: Grid Layout Skeleton */}
			<div className="relative hidden grid-cols-4 gap-1 sm:grid sm:gap-2">
				{/* Large Image Placeholder */}
				<div className="relative col-span-2 row-span-2 overflow-hidden rounded-md sm:rounded-xl">
					<div className="h-full w-full animate-pulse rounded-md bg-gray-200 dark:bg-neutral-800 sm:rounded-xl"></div>
				</div>

				{/* Small Image Placeholder 1 */}
				<div className="relative col-span-1 row-span-2 overflow-hidden rounded-md sm:rounded-xl">
					<div className="h-full w-full animate-pulse rounded-md bg-gray-200 dark:bg-neutral-800 sm:rounded-xl"></div>
				</div>

				{/* Small Image Placeholders 2 & 3 */}
				<div className="relative overflow-hidden rounded-md sm:rounded-xl">
					<div className="aspect-h-3 aspect-w-4">
						<div className="h-full w-full animate-pulse rounded-md bg-gray-200 dark:bg-neutral-800 sm:rounded-xl"></div>
					</div>
				</div>

				<div className="relative overflow-hidden rounded-md sm:rounded-xl">
					<div className="aspect-h-3 aspect-w-4">
						<div className="h-full w-full animate-pulse rounded-md bg-gray-200 dark:bg-neutral-800 sm:rounded-xl"></div>
					</div>
				</div>

				{/* "Show all photos" button Placeholder */}
				<div className="absolute bottom-3 left-3 z-10 hidden animate-pulse cursor-pointer rounded-xl bg-gray-200 px-4 py-2 dark:bg-neutral-700 md:flex md:items-center md:justify-center">
					<div className="h-5 w-5 animate-pulse rounded bg-gray-300 dark:bg-neutral-600"></div>
					<div className="ml-2 h-4 w-20 animate-pulse rounded bg-gray-300 dark:bg-neutral-600"></div>
				</div>
			</div>
		</header>
	)
}
