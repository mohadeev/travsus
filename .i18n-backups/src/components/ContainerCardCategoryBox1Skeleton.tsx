// CardCategoryBox1Skeleton.tsx
import React, { FC } from 'react'

export interface CardCategoryBox1SkeletonProps {
	className?: string
}

export const CardCategoryBox1Skeleton: FC<CardCategoryBox1SkeletonProps> = ({
	className = '',
}) => {
	return (
		<div
			className={`nc-CardCategoryBox1Skeleton relative flex items-center p-3 sm:p-6 ${className} animate-pulse`}
		>
			<div className="absolute right-2 top-2 h-4 w-10 rounded bg-gray-300"></div>

			<div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full bg-gray-300"></div>

			<div className="ml-4 flex-grow">
				<div className="mb-2 h-5 w-3/4 rounded bg-gray-300"></div>
				<div className="h-4 w-1/2 rounded bg-gray-300"></div>
			</div>
		</div>
	)
}

// ContainerExperiencesCardSkeleton.tsx

const ContainerCardCategoryBox1Skeleton: React.FC = () => {
	// Generate an array of length 10 to create 10 skeleton cards
	const skeletons = Array.from({ length: 4 }, (_, index) => (
		<CardCategoryBox1Skeleton key={index} /> // or size="small" based on your needs
	))

	return <>{skeletons}</>
}

export default ContainerCardCategoryBox1Skeleton
