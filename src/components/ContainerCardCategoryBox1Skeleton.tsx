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
			<div className="absolute right-2 top-2 h-4 w-10 bg-gray-300 rounded"></div>

			<div className="relative h-24 w-24 flex-shrink-0 rounded-full bg-gray-300 overflow-hidden"></div>

			<div className="ml-4 flex-grow">
				<div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
				<div className="h-4 bg-gray-300 rounded w-1/2"></div>
			</div>
		</div>
	)
}

  


// ContainerExperiencesCardSkeleton.tsx


const ContainerCardCategoryBox1Skeleton: React.FC = () => {
  // Generate an array of length 10 to create 10 skeleton cards
  const skeletons = Array.from({ length: 8 }, (_, index) => (
    <CardCategoryBox1Skeleton key={index}  /> // or size="small" based on your needs
  ));

  return (
    <>
      {skeletons}
    </>
  );
};

export default ContainerCardCategoryBox1Skeleton;
