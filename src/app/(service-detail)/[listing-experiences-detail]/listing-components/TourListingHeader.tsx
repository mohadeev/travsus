import LikeSaveBtns from '@/components/LikeSaveBtns'
import React from 'react'
import Badge from '@/shared/Badge'
import StartRating from '@/components/StartRating'
import Avatar from '@/shared/Avatar'
import { useSelector } from 'react-redux'

function TourListingHeaderSkeleton() {
	return (
		<div className="listingSection__wrap_no_border_color !space-y-6">
			{/* 1 */}
			<div className="flex items-center justify-between">
				<div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200" />
				<div className="h-8 w-20 animate-pulse rounded-lg bg-gray-200" />
			</div>

			{/* 2 */}
			<div className="h-12 w-3/4 animate-pulse rounded-lg bg-gray-200" />

			{/* 3 */}
			<div className="flex items-center space-x-4">
				<div className="h-6 w-32 animate-pulse rounded-lg bg-gray-200" />
				<span>·</span>
				<div className="h-6 w-48 animate-pulse rounded-lg bg-gray-200" />
			</div>

			{/* 4 */}
			<div className="flex items-center">
				<div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
				<div className="ml-2.5 h-6 w-48 animate-pulse rounded-lg bg-gray-200" />
			</div>

			{/* 5 */}
			<div className="w-full border-b border-neutral-100" />

			{/* 6 */}
			<div className="flex items-center justify-between space-x-8 xl:justify-start xl:space-x-12">
				{[...Array(3)].map((_, index) => (
					<div
						key={index}
						className="flex flex-col items-center space-y-3 text-center sm:flex-row sm:space-x-3 sm:space-y-0 sm:text-left"
					>
						<div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
						<div className="h-6 w-24 animate-pulse rounded-lg bg-gray-200" />
					</div>
				))}
			</div>
		</div>
	)
}

const TourListingHeader = () => {
	const {
		name: title,
		region,
		start,
		images,
		overview,
		reviews,
		days,
		liked,
	}: any = useSelector((state: any) => state.creatingServiceSlice.service)

	let newLocation = region
	const regionC = newLocation?.length > 0 ? newLocation[0]?.region : ''
	const country = newLocation?.length > 0 ? newLocation[0]?.country : ''

	if (!title) {
		return <TourListingHeaderSkeleton />
	}

	return (
		<div className="listingSection__wrap_no_border_color !space-y-6">
			{/* 1 */}
			<div className="flex items-center justify-between">
				<Badge color="pink" name="Travsus" />
				<LikeSaveBtns liked={liked} />
			</div>

			{/* 2 */}
			<h2
				className="text-2xl font-semibold sm:text-3xl lg:text-4xl"
				style={{ fontWeight: '700' }}
			>
				{title}
			</h2>

			{/* 3 */}
			<div className="flex items-center space-x-4">
				<StartRating />
				<span>·</span>
				<span>
					<i className="las la-map-marker-alt"></i>
					<span className="ml-1">
						{country} - {start?.name}
					</span>
				</span>
			</div>

			{/* 4 */}
			<div className="flex items-center">
				<Avatar hasChecked sizeClass="h-10 w-10" radius="rounded-full" />
				<span className="ml-2.5 text-neutral-500 dark:text-neutral-400">
					Hosted by{' '}
					<span className="font-medium text-neutral-900 dark:text-neutral-200">
						Travsus{' '}
					</span>
				</span>
			</div>

			{/* 5 */}
			<div className="w-full border-b border-neutral-100 dark:border-neutral-700" />

			{/* 6 */}
			<div className="flex items-center justify-between space-x-8 text-sm text-neutral-700 dark:text-neutral-300 xl:justify-start xl:space-x-12">
				<div className="flex flex-col items-center space-y-3 text-center sm:flex-row sm:space-x-3 sm:space-y-0 sm:text-left">
					<i className="las la-clock text-2xl"></i>
					<span className="">{days?.length}</span>
				</div>
				<div className="flex flex-col items-center space-y-3 text-center sm:flex-row sm:space-x-3 sm:space-y-0 sm:text-left">
					<i className="las la-user-friends text-2xl"></i>
					<span className="">Up to 10 people</span>
				</div>
				<div className="flex flex-col items-center space-y-3 text-center sm:flex-row sm:space-x-3 sm:space-y-0 sm:text-left">
					<i className="las la-language text-2xl"></i>
					<span className="">English, VietNames</span>
				</div>
			</div>
		</div>
	)
}

export default TourListingHeader
