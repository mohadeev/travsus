export const SkeletonLoader = () => {
	return (
		<header className="rounded-md sm:rounded-xl">
			<div className="relative grid grid-cols-4 gap-1 sm:gap-2">
				{/* Large Image Placeholder */}
				<div className="relative col-span-2 row-span-2 animate-pulse rounded-md bg-gray-200 sm:rounded-xl">
					<div className="absolute inset-0 bg-gray-300 bg-opacity-20"></div>
				</div>

				{/* Small Image Placeholder 1 */}
				<div className="relative col-span-1 row-span-2 animate-pulse rounded-md bg-gray-200 sm:rounded-xl">
					<div className="absolute inset-0 bg-gray-300 bg-opacity-20"></div>
				</div>

				{/* Small Image Placeholders 2 & 3 */}
				<div className="relative animate-pulse overflow-hidden rounded-md bg-gray-200 sm:rounded-xl">
					<div className="aspect-h-3 aspect-w-4 bg-gray-200"></div>
					<div className="absolute inset-0 bg-gray-300 bg-opacity-20"></div>
				</div>
				<div className="relative animate-pulse overflow-hidden rounded-md bg-gray-200 sm:rounded-xl">
					<div className="aspect-h-3 aspect-w-4 bg-gray-200"></div>
					<div className="absolute inset-0 bg-gray-300 bg-opacity-20"></div>
				</div>

				{/* "Show all photos" button Placeholder */}
				<div className="absolute bottom-3 left-3 z-10 hidden animate-pulse cursor-pointer items-center justify-center rounded-xl bg-gray-200 px-4 py-2 text-gray-500 md:flex">
					<div className="h-5 w-5 rounded bg-gray-300"></div>
					<span className="ml-2 h-5 w-16 rounded bg-gray-300 text-sm"></span>
				</div>
			</div>
		</header>
	)
}
