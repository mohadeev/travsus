import React, { useState } from 'react'
import ModalSelectDate from '@/components/ModalSelectDate'
import ButtonPrimary from '@/shared/ButtonPrimary'
import converSelectedDateToString from '@/utils/converSelectedDateToString'
import ModalReserveMobile from './ModalReserveMobile'
import { useSelector } from 'react-redux'
import { formatCurrency } from '@/utils/formatCurrency'

const MobileFooterSticky = () => {
	const { booking, status } = useSelector((state: any) => state.bookingSlice)
	const { guests, lineItems, accommodation, transport, bookOwnHotels } = booking

	const totalGuests: number = guests?.guestAdults + guests?.guestChildren
	const { name: title, price }: any = useSelector(
		(state: any) => state.creatingServiceSlice.service,
	)
	const filteredLineItems = lineItems?.filter(
		({ includeInTotal }: any) => includeInTotal === true,
	)
	const totalAmount = filteredLineItems.reduce((total: any, item: any) => {
		return total + item.totalPrice
	}, 0)
	const priceStart = totalAmount / totalGuests

	const [startDate, setStartDate] = useState<Date | null>(
		new Date('2023/02/06'),
	)
	const [endDate, setEndDate] = useState<Date | null>(new Date('2023/02/23'))
	//
	return (
		<>
			{totalAmount ? (
				<div className="dark:border-neutral-6000 fixed inset-x-0 bottom-0 z-40 block border-t border-neutral-200 bg-white py-2 dark:bg-neutral-800 sm:py-3 lg:hidden">
					<ModalReserveMobile
						renderChildren={({ openModal }) => (
							<div className="container flex items-center justify-between">
								<div className="">
									<span className="block text-xl font-semibold">
										{formatCurrency(priceStart)}

										<span className="ml-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
											/ per person
										</span>
									</span>
									<span
										onClick={openModal}
										className="block text-sm font-medium underline"
									>
										{converSelectedDateToString([startDate, endDate])}
									</span>
								</div>
								<ButtonPrimary
									sizeClass="px-5 sm:px-7 py-3 !rounded-2xl"
									onClick={openModal}
								>
									Reserve
								</ButtonPrimary>
							</div>
						)}
					/>
				</div>
			) : (
				<MobileFooterStickySkeleton />
			)}
		</>
	)
}

export default MobileFooterSticky

function MobileFooterStickySkeleton() {
	return (
		<div className="dark:border-neutral-6000 fixed inset-x-0 bottom-0 z-40 block border-t border-neutral-200 bg-white py-2 dark:bg-neutral-800 sm:py-3 lg:hidden">
			<div className="container flex items-center justify-between">
				<div className="space-y-2">
					<div className="flex items-center space-x-2">
						<div className="h-7 w-24 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
						<div className="h-4 w-20 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
					</div>
					<div className="h-4 w-32 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700"></div>
				</div>
				<div className="h-12 w-24 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-700"></div>
			</div>
		</div>
	)
}
