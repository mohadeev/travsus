import { useTranslations } from '@/lib/i18n'

export default function SkeletonLoader() {
	const t = useTranslations(
		'newServicedetailListingExperiencesDetailSidebarSkeletonLoader',
	)

	return (
		<div className="top-28">
			{/* <div className="listingSectionSidebar__wrap rounded-xl bg-white p-4 shadow-xl"> */}
			<div className="mb-4 flex justify-between">
				<div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
				{/* <div className="h-6 w-20 animate-pulse rounded bg-gray-200"></div> */}
			</div>
			<div className="mb-4">
				<div className="mb-2 h-12 w-full animate-pulse rounded-full bg-gray-200"></div>
				<div className="h-12 w-full animate-pulse rounded-full bg-gray-200"></div>
			</div>
			<div className="mb-4">
				<div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200"></div>
				<div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200"></div>
				<div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
			</div>

			<div className="relative mb-4 h-[200px]">
				<div className="absolute inset-0 animate-pulse rounded-lg bg-gray-200"></div>
				{/* <div className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md">
					<div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
				</div>
				<div className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-md">
					<div className="h-6 w-6 animate-pulse rounded-full bg-gray-200"></div>
				</div> */}
			</div>

			<div className="mb-4 flex justify-center space-x-2">
				{/* {[...Array(4)].map((_, index) => (
					<div
						key={index}
						className="h-2 w-2 animate-pulse rounded-full bg-gray-300"
					></div>
				))} */}
			</div>
			<div className="mb-4">
				<div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
				<div className="mb-2 grid grid-cols-10 gap-4">
					<div className="col-span-4 h-4 animate-pulse rounded bg-gray-200"></div>
					<div className="col-span-1 h-4 animate-pulse rounded bg-gray-200"></div>
					<div className="col-span-2 h-4 animate-pulse rounded bg-gray-200"></div>
					<div className="col-span-3 h-4 animate-pulse rounded bg-gray-200"></div>
				</div>
				<div className="mb-2 grid grid-cols-10 gap-4">
					<div className="col-span-4 h-4 animate-pulse rounded bg-gray-200"></div>
					<div className="col-span-1 h-4 animate-pulse rounded bg-gray-200"></div>
					<div className="col-span-2 h-4 animate-pulse rounded bg-gray-200"></div>
					<div className="col-span-3 h-4 animate-pulse rounded bg-gray-200"></div>
				</div>
				<div className="grid grid-cols-10 gap-4">
					<div className="col-span-4 h-4 animate-pulse rounded bg-gray-200"></div>
					<div className="col-span-1 h-4 animate-pulse rounded bg-gray-200"></div>
					<div className="col-span-2 h-4 animate-pulse rounded bg-gray-200"></div>
					<div className="col-span-3 h-4 animate-pulse rounded bg-gray-200"></div>
				</div>
			</div>
			<div className="h-12 w-full animate-pulse rounded-full bg-gray-200"></div>
			{/* </div> */}
		</div>
	)
}
