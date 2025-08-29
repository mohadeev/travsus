// import LineItemsBreakdown from '@/app/(service-detail)/[listingExperiencesDetail]/LineItemsBreakdown'
import Image from 'next/image'
import React from 'react'
import LineItemsBreakdown from '../../[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/LineItemsBreakdown'
// import LineItemsBreakdown from '../../[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/LineItemsBreakdown'

const BookingBreakDownCard = ({ booking }: any) => {
	const { guests, lineItems, accommodation, transport, bookOwnHotels } = booking
	const fistImage = booking?.tour?.images?.[0]?.url || ''
	const service = booking?.booking?.tour
	return (
		<div className="flex w-full flex-col space-y-6 border-neutral-200 px-0 dark:border-neutral-700 sm:space-y-8 sm:rounded-2xl sm:p-6 lg:border xl:p-8">
			<BookingCard booking={booking} />
			<div className="flex flex-col space-y-4">
				<LineItemsBreakdown lineItems={lineItems} />
			</div>
		</div>
	)
}

export default BookingBreakDownCard

export const BookingCard = ({ booking }: any) => {
	const { guests, lineItems, accommodation, transport, bookOwnHotels } = booking
	const fistImage = booking?.tour?.images?.[0]?.url || ''
	const service = booking?.tour

	return (
		<div className="flex flex-col sm:flex-row sm:items-center">
			<div className="w-full flex-shrink-0 sm:w-40">
				<div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-2xl sm:aspect-h-4">
					<Image alt="" fill sizes="200px" src={fistImage} />
				</div>
			</div>
			<div className="space-y-3 py-5 sm:px-5">
				<div>
					{/* <span className="line-clamp-1 text-sm text-neutral-500 dark:text-neutral-400">
								Hotel room in Tokyo, Jappan
							</span> */}
					<span className="mt-1 block text-base font-medium">
						{service?.name}
					</span>
				</div>
				<span className="block text-sm text-neutral-500 dark:text-neutral-400">
					{/* 2 beds · 2 baths */}
				</span>
				<div className="w-10 border-b border-neutral-200 dark:border-neutral-700"></div>
				{/* <StartRating /> */}
			</div>
		</div>
	)
}
