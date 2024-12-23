'use client'

import React, { FC, useEffect, useState } from 'react'
import Badge from '@/shared/Badge'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { usePathname, useRouter } from 'next/navigation'
import StartRating from '@/components/StartRating'
import StayDatesRangeInput from './StayDatesRangeInput'
import GuestsInput from './GuestsInput'
import { Route } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import handleCreateBooking from '@/utils/api-utils/handleCreateBooking'
import { SkeletonLoader } from './SkeletonLoader'
import {
	bookOwnHotelsReducers,
	localUpdateLineItemsLogicAsync,
	resetBooking,
	setAccommodation,
	setGustes,
	setPricePerSeat,
	setSeats,
	setSelectedDate,
	updateBookingState,
	updateLineItemsAsync,
	updateProvidedService,
} from '@/app/GlobalRedux/Features/bookingSlice/bookingSlice'
import LineItemsBreakdown from './LineItemsBreakdown'
import { calculateGustes } from './lineItemsHandler'
import TransportTypes from './TransportTypes'
import RowBedAccommodationSelector from './RowBedAccommodationSelector'
import AcommodationAndTransport from './listing-components/AcommodationAndTransport'
import SidebarSkeletonLoader from './SidebarSkeletonLoader'
import { Button } from '@/components/ui'
import { updateLineItemsLogic } from '@/app/api/updateLineItems/updateLineItemsLogic'
export interface RenderSidebarProps {}

const RenderSidebar: FC<RenderSidebarProps> = ({}) => {
	const thisPathname = usePathname()
	const router = useRouter()
	const dispatch = useDispatch()
	const { booking, status } = useSelector((state: any) => state.bookingSlice)
	const { guests, lineItems, accommodation, transport, bookOwnHotels } = booking
	console.log(
		'----------------------------------accommodation:-------------------------------------',
		accommodation,
	)
	const totalGuests: number = guests?.guestAdults + guests?.guestChildren
	const { name: title, price }: any = useSelector(
		(state: any) => state.creatingServiceSlice.service,
	)
	useEffect(() => {
		if (price >= 1) {
			dispatch(setPricePerSeat(price))
		}
	}, [dispatch, price])

	const handleDateChange = (date: string) => {
		dispatch(setSelectedDate(date))
	}

	const handleOpenModalImageGallery = () => {
		router.push(`${thisPathname}/?modal=PHOTO_TOUR_SCROLLABLE` as Route)
	}

	const handleGuestsChange = async (data: any) => {
		const newGuests = data?.guests
		dispatch(
			localUpdateLineItemsLogicAsync({ value: { guests: newGuests }, tour }),
		)
	}
	const handleAccomodationChange = async (data: any) => {
		const newAccommodation = data
		dispatch(
			localUpdateLineItemsLogicAsync({
				value: { accommodation: newAccommodation },
				tour,
			}),
		)
	}
	// useEffect(() => {
	// 	dispatch(
	// 		updateLineItemsAsync({
	// 			booking: booking,
	// 		}),
	// 	)
	// }, [])
	const transportLineItem = booking?.lineItems.find(
		({ description }: any) => description === 'transport',
	)
	const handleBookOwnHotels = () => {
		dispatch(
			bookOwnHotelsReducers({
				path: 'booking.bookOwnHotels',
				value: !bookOwnHotels,
			}),
		)
	}
	const tour: any = useSelector(
		(state: any) => state.creatingServiceSlice.service,
	)
	const isNotInitiated = true
	useEffect(() => {
		dispatch(updateProvidedService({ path: 'booking.tour', value: tour }))
	}, [booking])
	useEffect(() => {
		if (tour && booking.lineItems >= 0) {
			dispatch(
				localUpdateLineItemsLogicAsync({
					value: { guestAdults: 2, guestChildren: 0 },
					tour,
				}),
			)
		}
	}, [booking])

	const [currentStatus, setCurrentStatus] = useState('')
	return (
		<div className="listingSectionSidebar__wrap shadow-xl">
			{/* <SidebarSkeletonLoader /> */}

			{tour.days ? (
				<>
					<div className="flex justify-between">
						<span className="text-3xl font-semibold">
							${booking.pricePerSeat}
							<span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
								/person
							</span>
						</span>
						<StartRating />
					</div>

					<form
						onSubmit={(e) => {
							e.preventDefault()
						}}
						className="flex flex-col rounded-3xl border border-neutral-200 dark:border-neutral-700"
					>
						<StayDatesRangeInput
							className="z-[11] flex-1"
							onChange={handleDateChange}
							value={booking.selectedDate}
						/>
						<div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
						{isNotInitiated && (
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
						)}
					</form>

					<TransportTypes
						cd={totalGuests}
						peopleCount={totalGuests}
						transportLineItem={transportLineItem}
					/>

					<LineItemsBreakdown lineItems={booking?.lineItems} />
					<Button
						loading={currentStatus === 'loading'}
						className="mt-4 w-full"
						disabled={currentStatus === 'loading'}
						onClick={() => {
							const createBooking = async () => {
								setCurrentStatus('loading')
								const response = await fetch('/api/bookings', {
									method: 'POST',
									body: JSON.stringify(booking),
								})

								if (!response.ok) {
									console.error('Failed to create booking')
								}

								return response.json()
							}
							createBooking()
								.then((result) => {
									if (result) {
										router.push(
											`/checkout/checkout?bookingId=${result.id}&serviceId=${tour.id}` as Route,
										)
									}
									setCurrentStatus('')
								})
								.catch((error) => {
									setCurrentStatus('')
									console.error('Error:', error)
								})
						}}
					>
						{status === 'loading' ? 'Processing...' : 'Reserve'}
					</Button>
				</>
			) : (
				<SidebarSkeletonLoader />
			)}
		</div>
	)
}

export default RenderSidebar

type BedType = 'SINGLE' | 'TWIN' | 'COUPLE'
type AccommodationType = 'Standard' | 'Luxury'

interface GuestCount {
	adult: number
	child: number
}

interface GuestSelection {
	[key: string]: {
		[key: string]: GuestCount | number
	}
}

interface BedOption {
	bedType: BedType
	maxOccupancy: number
	basePrice: number
	currency: string
}

interface PricingTier {
	name: string
	minSeats: number
	maxSeats: number
	bedOptions: BedOption[]
}

interface Accommodation {
	name: AccommodationType
	description: string
	pricingTiers: PricingTier[]
}

interface LineItem {
	description: string
	unitPrice: number
	totalPrice: number
	totalGuests: number
	serviceQuantity: number
	currency: string
}
