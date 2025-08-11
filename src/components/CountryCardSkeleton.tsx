'use client'

import type { FC } from 'react'

export interface CountryCardSkeletonProps {
	className?: string
	size?: 'default' | 'small'
	layout?: 'row' | 'column'
}

/**
 * Skeleton that visually matches CountryCard:
 * - Square aspect (3/3)
 * - Rounded image area
 * - Gradient overlay
 * - Bottom-left title bar placeholder
 */
const CountryCardSkeleton: FC<CountryCardSkeletonProps> = ({
	className = '',
	size = 'default',
	layout = 'column', // Default layout is column
}) => {
	const widthClass =
		size === 'small' ? 'w-[220px] sm:w-[250px] md:w-[280px]' : 'w-full'

	return (
		<div
			className={`nc-CountryCard group relative ${className}`}
			aria-hidden="true"
		>
			<div className="relative block w-full overflow-hidden rounded-xl">
				{/* Image area with aspect ratio matching CountryCard */}
				<div className={`aspect-h-3 aspect-w-3 ${widthClass}`}>
					<div className="h-full w-full animate-pulse rounded-xl bg-gray-200 dark:bg-neutral-800" />
				</div>

				{/* Gradient overlay like the CountryCard */}
				{/* <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-transparent via-transparent to-black/70" /> */}

				{/* Title placeholder positioned bottom-left */}
				<div className="pointer-events-none absolute bottom-4 left-4 z-10">
					<div className="h-7 w-40 rounded bg-white/70 dark:bg-white/20 md:w-48" />
				</div>
			</div>
		</div>
	)
}

export default CountryCardSkeleton
