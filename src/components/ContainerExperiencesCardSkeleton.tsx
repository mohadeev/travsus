'use client'

import type { FC } from 'react'
import CountryCardSkeleton from './CountryCardSkeleton'

export interface ContainerCountryCardSkeletonProps {
	count?: number
	size?: 'default' | 'small'
	layout?: 'row' | 'column'
	itemClassName?: string
	containerClassName?: string
}

const ContainerCountryCardSkeleton: FC<ContainerCountryCardSkeletonProps> = ({
	count = 8,
	size,
	layout = 'column',
	itemClassName = '',
	containerClassName = '',
}) => {
	const effectiveSize = size ?? (layout === 'row' ? 'small' : 'default')

	const items = Array.from({ length: count }).map((_, idx) => (
		<div
			key={idx}
			className={`${layout === 'row' ? 'flex-none' : 'w-full'} ${itemClassName}`}
		>
			<CountryCardSkeleton size={effectiveSize} />
		</div>
	))

	return (
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
			<div
				className={`flex ${
					layout === 'row'
						? 'hide-scrollbar flex-row gap-5 overflow-x-auto'
						: 'flex-col gap-5'
				} ${containerClassName}`}
				aria-hidden="true"
			>
				{items}
			</div>
		</>
	)
}

export default ContainerCountryCardSkeleton
