'use client'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { type FC, useEffect, useState } from 'react'
import NcModal from '@/shared/NcModal'
import ModalSelectDate from '@/components/ModalSelectDate'
import converSelectedDateToString from '@/utils/converSelectedDateToString'
import ModalSelectGuests from '@/components/ModalSelectGuests'
import Image from 'next/image'
import CustomStripeForm from './custom-stripe-form'
import getFetchDataFromApi from '@/utils/getFetchDataFromApi'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	bookOwnHotelsReducers,
	localUpdateLineItemsLogicAsync,
	updateBookingState,
} from '@/app/[locale]/GlobalRedux/Features/bookingSlice/bookingSlice'
import { checkBooking } from '@/lib/checkBooking'
import RowBedAccommodationSelector from '../../[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/RowBedAccommodationSelector'
import GuestsInput from '../../[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/GuestsInput'
import LineItemsBreakdown from '../../[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/LineItems/LineItemsBreakdown'
import AcommodationAndTransport from '../../[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/RenderSideBar/AcommodationAndTransport'
import { useTranslations } from '@/lib/i18n'

export interface CheckOutPagePageMainProps {
	className?: string
}

const CheckOutPagePageMain: FC<CheckOutPagePageMainProps> = ({
	className = '',
}) => {
	const t = useTranslations('Jan03_CheckoutPage_q8m3')
	const searchParams = useSearchParams()
	const dispatch = useDispatch()
	const Router = useRouter()
	const step = searchParams.get('step')
	const bookingId = searchParams.get('bookingId')
	const [startDate, setStartDate] = useState<Date | null>(
		new Date('2023/02/06'),
	)
	const [endDate, setEndDate] = useState<Date | null>(new Date('2023/02/23'))
	const { booking } = useSelector((state: any) => state.bookingSlice)
	const { guests, lineItems, accommodation, transport, bookOwnHotels, tour } =
		booking

	useEffect(() => {
		;(async () => {
			const hanleCheckingBookning = await checkBooking()
			console.log('hanleCheckingBookning', hanleCheckingBookning)
		})()
	}, [])

	const fistImage = booking?.tour?.images?.[0]?.url || ''
	const service = booking?.tour

	useEffect(() => {
		;(async () => {
			try {
				const bookingData = await getFetchDataFromApi(
					'/api/booking/get/booking-data?',
					{
						bookingId: bookingId,
					},
				)
				if (bookingData) {
					console.log("it's updating booking from server here")
					dispatch(updateBookingState({ path: 'booking', value: bookingData }))
				}
			} catch (error) {
				console.error(error)
			}
		})()
	}, [bookingId])

	const handleGuestsChange = async (data: any) => {
		const newGuests = data?.guests
		dispatch(
			localUpdateLineItemsLogicAsync({ value: { guests: newGuests }, tour }),
		)
	}

	const handleAccomodationChange = async (data: any) => {
		const newAccommodation = data
		console.log('newAccommodation:', newAccommodation)
		dispatch(
			localUpdateLineItemsLogicAsync({
				value: { accommodation: newAccommodation },
				tour,
			}),
		)
	}

	const renderSidebar = () => {
		return (
			<div className="flex w-full flex-col space-y-6 border-neutral-200 px-0 dark:border-neutral-700 sm:space-y-8 sm:rounded-2xl sm:p-6 lg:border xl:p-8">
				<div className="flex flex-col sm:flex-row sm:items-center">
					<div className="w-full flex-shrink-0 sm:w-40">
						<div className="aspect-h-3 aspect-w-4 overflow-hidden rounded-2xl sm:aspect-h-4">
							<Image
								alt=""
								fill
								sizes="200px"
								src={fistImage || '/placeholder.svg'}
							/>
						</div>
					</div>
					<div className="space-y-3 py-5 sm:px-5">
						<div>
							<span className="mt-1 block text-base font-medium">
								{service?.name}
							</span>
						</div>
						<span className="block text-sm text-neutral-500 dark:text-neutral-400"></span>
						<div className="w-10 border-b border-neutral-200 dark:border-neutral-700"></div>
					</div>
				</div>
				<div className="flex flex-col space-y-4">
					<LineItemsBreakdown lineItems={lineItems} />
				</div>
			</div>
		)
	}

	const handleBookOwnHotels = () => {
		dispatch(
			bookOwnHotelsReducers({
				path: 'booking.bookOwnHotels',
				value: !bookOwnHotels,
			}),
		)
	}

	const isNotInitiated = Object.keys(accommodation).length > 0

	const renderMain = () => {
		return (
			<Suspense>
				<div className="flex w-full flex-col space-y-8 border-neutral-200 px-0 dark:border-neutral-700 sm:rounded-2xl sm:border sm:p-6 xl:p-8">
					<h2 className="text-3xl font-semibold lg:text-4xl">
						{t('Confirm_And_Payment')}
					</h2>
					<div className="border-b border-neutral-200 dark:border-neutral-700"></div>
					<div>
						<div>
							<h3 className="text-2xl font-semibold">{t('Your_Trip')}</h3>
							<NcModal
								renderTrigger={(openModal) => (
									<span
										onClick={() => openModal()}
										className="mt-1 block cursor-pointer underline lg:hidden"
									>
										{t('View_Booking_Details')}
									</span>
								)}
								renderContent={renderSidebar}
								modalTitle={t('Booking_Details')}
							/>
						</div>
						<div className="z-10 mt-6 flex flex-col divide-y divide-neutral-200 overflow-hidden rounded-3xl border border-neutral-200 dark:divide-neutral-700 dark:border-neutral-700 sm:flex-row sm:divide-x sm:divide-y-0">
							<ModalSelectDate
								name={'ghalo'}
								renderChildren={({ openModal }) => (
									<button
										onClick={openModal}
										className="flex flex-1 justify-between space-x-5 p-5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800"
										type="button"
									>
										<div className="flex flex-col">
											<span className="text-sm text-neutral-400">
												{t('Date')}
											</span>
											<span className="mt-1.5 text-lg font-semibold">
												{converSelectedDateToString([
													new Date(booking?.selectedDate?.startDate),
													new Date(booking?.selectedDate?.endDate),
												])}
											</span>
										</div>
										<PencilSquareIcon className="text-neutral-6000 h-6 w-6 dark:text-neutral-400" />
									</button>
								)}
							/>
							<ModalSelectGuests
								AcommodationAndTransport={
									<AcommodationAndTransport
										GuestsInput={
											<GuestsInput
												className="flex-1"
												onChange={handleGuestsChange}
												defaultValue={guests}
											/>
										}
										RowBedAccommodationSelector={
											<RowBedAccommodationSelector
												defaultValue={accommodation}
												onChange={handleAccomodationChange}
											/>
										}
										bookOwnHotels={bookOwnHotels}
										handleBookOwnHotels={handleBookOwnHotels}
									/>
								}
								renderChildren={({ openModal }) => (
									<button
										type="button"
										onClick={openModal}
										className="flex flex-1 justify-between space-x-5 p-5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800"
									>
										<div className="flex flex-col">
											<span className="text-sm text-neutral-400">
												{t('Guests')}
											</span>
											<span className="mt-1.5 text-lg font-semibold">
												<span className="line-clamp-1">
													{t('Guests_Count', {
														adults: guests?.guestAdults || 0,
														children: guests?.guestChildren || 0,
													})}
												</span>
											</span>
										</div>
										<PencilSquareIcon className="text-neutral-6000 h-6 w-6 dark:text-neutral-400" />
									</button>
								)}
							/>
						</div>
					</div>
					<div>
						<h3 className="text-2xl font-semibold">{t('Pay_With')}</h3>
						<div className="my-5 w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
						<div className="mt-6">
							<CustomStripeForm booking={booking} />
						</div>
					</div>
				</div>
			</Suspense>
		)
	}

	return (
		<div className={`nc-CheckOutPagePageMain ${className}`}>
			{booking?.id ? (
				<main className="container mb-24 mt-11 flex flex-col-reverse lg:mb-32 lg:flex-row">
					<div className="w-full lg:w-3/5 lg:pr-10 xl:w-2/3">
						{renderMain()}
					</div>
					<div className="hidden lg:block lg:w-[35%] lg:max-w-[35%]">
						{renderSidebar()}
					</div>
				</main>
			) : (
				<CheckoutPageSkeleton />
			)}
		</div>
	)
}

export default CheckOutPagePageMain

export function CheckoutPageSkeleton() {
	return (
		<div className="container mb-24 mt-11 flex flex-col-reverse lg:mb-32 lg:flex-row">
			{/* Main Content */}
			<div className="w-full lg:w-3/5 lg:pr-10 xl:w-2/3">
				<div className="flex w-full flex-col space-y-8 px-0 sm:rounded-2xl sm:p-6 xl:p-8">
					{/* Title */}
					<div className="h-10 w-64 animate-pulse rounded-lg bg-gray-200"></div>
					<div className="border-b border-neutral-200"></div>
					{/* Trip Section */}
					<div className="space-y-4">
						<div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200"></div>
						{/* Date and Guests Selector */}
						<div className="mt-6 flex flex-col divide-y divide-neutral-200 overflow-hidden rounded-3xl border border-neutral-200 sm:flex-row sm:divide-x sm:divide-y-0">
							<div className="flex flex-1 space-x-5 p-5">
								<div className="flex flex-1 flex-col space-y-2">
									<div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
									<div className="h-6 w-32 animate-pulse rounded bg-gray-200"></div>
								</div>
								<div className="h-6 w-6 animate-pulse rounded bg-gray-200"></div>
							</div>
							<div className="flex flex-1 space-x-5 p-5">
								<div className="flex flex-1 flex-col space-y-2">
									<div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
									<div className="h-6 w-40 animate-pulse rounded bg-gray-200"></div>
								</div>
								<div className="h-6 w-6 animate-pulse rounded bg-gray-200"></div>
							</div>
						</div>
					</div>
					{/* Payment Section */}
					<div className="space-y-4">
						<div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200"></div>
						<div className="my-5 w-14 border-b border-neutral-200"></div>
						{/* Payment Form Skeleton */}
						<div className="space-y-4">
							<div className="h-12 w-full animate-pulse rounded-lg bg-gray-200"></div>
							<div className="grid grid-cols-2 gap-4">
								<div className="h-12 animate-pulse rounded-lg bg-gray-200"></div>
								<div className="h-12 animate-pulse rounded-lg bg-gray-200"></div>
							</div>
							<div className="h-12 w-full animate-pulse rounded-lg bg-gray-200"></div>
						</div>
					</div>
				</div>
			</div>
			{/* Sidebar */}
			<div className="hidden lg:block lg:w-[35%] lg:max-w-[35%]">
				<div className="flex w-full flex-col space-y-6 px-0 sm:space-y-8 sm:rounded-2xl sm:p-6 xl:p-8">
					{/* Tour Image and Info */}
					<div className="flex flex-col sm:flex-row sm:items-center">
						<div className="w-full flex-shrink-0 sm:w-40">
							<div className="aspect-h-3 aspect-w-4 animate-pulse overflow-hidden rounded-2xl bg-gray-200"></div>
						</div>
						<div className="space-y-3 py-5 sm:px-5">
							<div className="space-y-2">
								<div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
								<div className="h-6 w-48 animate-pulse rounded bg-gray-200"></div>
							</div>
							<div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
						</div>
					</div>
					{/* Price Breakdown */}
					<div className="space-y-4">
						{/* Headers */}
						<div className="grid grid-cols-4 gap-4">
							<div className="col-span-2 h-4 animate-pulse rounded bg-gray-200"></div>
							<div className="h-4 animate-pulse rounded bg-gray-200"></div>
							<div className="h-4 animate-pulse rounded bg-gray-200"></div>
						</div>
						{/* Price Items */}
						{[...Array(3)].map((_, i) => (
							<div key={i} className="grid grid-cols-4 gap-4">
								<div className="col-span-2 h-4 animate-pulse rounded bg-gray-200"></div>
								<div className="h-4 animate-pulse rounded bg-gray-200"></div>
								<div className="h-4 animate-pulse rounded bg-gray-200"></div>
							</div>
						))}
						{/* Total */}
						<div className="mt-6 grid grid-cols-2 gap-4">
							<div className="h-6 animate-pulse rounded bg-gray-200"></div>
							<div className="h-6 animate-pulse rounded bg-gray-200"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
