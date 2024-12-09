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
export interface RenderSidebarProps {}

const RenderSidebar: FC<RenderSidebarProps> = ({}) => {
	const thisPathname = usePathname()
	const router = useRouter()
	const dispatch = useDispatch()
	const { booking, status } = useSelector((state: any) => state.bookingSlice)
	const { guests, lineItems, accommodation, transport, bookOwnHotels } = booking

	const seats = booking?.seats
	const totalGuests: number = guests?.guestAdults + guests?.guestChildren
	const { name: title, price }: any = useSelector(
		(state: any) => state.creatingServiceSlice.service,
	)
	const defaultValue = 2
	useEffect(() => {
		if (price >= 1) {
			dispatch(setPricePerSeat(price))
		}
	}, [dispatch, price])
	// useEffect(() => {
	// 	dispatch(setSeats(defaultValue))
	// }, [])
	const handleDateChange = (date: string) => {
		dispatch(setSelectedDate(date))
	}

	const handleSeatsChange = (seats: any) => {
		// console.log('seats: ', seats)
		// dispatch(setSeats(seats))
	}

	const handleResetBooking = () => {
		dispatch(resetBooking())
	}
	const handleOpenModalImageGallery = () => {
		router.push(`${thisPathname}/?modal=PHOTO_TOUR_SCROLLABLE` as Route)
	}

	const handleGuestsChange = async (data: any) => {
		const newGuests = data?.guests
		console.log('newGuests:', newGuests)
		dispatch(
			localUpdateLineItemsLogicAsync({ value: { guests: newGuests }, tour }),
		)
		// await dispatch(setGustes(newGuests))
		// await dispatch(
		// 	updateLineItemsAsync({
		// 		guests: newGuests,
		// 		booking: {
		// 			...booking,
		// 		},
		// 	}),
		// )
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

function calculateAccommodationPrice(
	guests: GuestSelection,
	pricing: Accommodation[],
): LineItem {
	let totalPrice = 0
	let totalGuests = 0
	let currency = ''

	for (const [accommodationType, bedSelection] of Object.entries(guests)) {
		const accommodation = pricing.find((a) => a.name === accommodationType)
		if (!accommodation) continue

		const pricingTier = accommodation.pricingTiers[0] // Assuming only one pricing tier per accommodation type

		for (const [bedType, guestCount] of Object.entries(bedSelection)) {
			const bedOption = pricingTier.bedOptions.find(
				(bo) => bo.bedType === bedType.toUpperCase(),
			)
			if (!bedOption) continue

			let adultCount = 0
			let childCount = 0

			if (typeof guestCount === 'number') {
				adultCount = guestCount
			} else {
				adultCount = guestCount.adult || 0
				childCount = guestCount.child || 0
			}

			totalPrice += bedOption.basePrice * (adultCount + childCount)
			totalGuests += adultCount + childCount
			currency = bedOption.currency
		}
	}

	const unitPrice = totalGuests > 0 ? totalPrice / totalGuests : 0

	return {
		description: 'Accommodation',
		unitPrice: parseFloat(unitPrice.toFixed(2)),
		totalPrice: parseFloat(totalPrice.toFixed(2)),
		totalGuests,
		serviceQuantity: 1, // Assuming one night stay, adjust if needed
		currency,
	}
}

// Example usage:
const guests = {
	Standard: { single: { adult: 3, child: 3 }, twin: 0, couple: 1 },
	Luxury: { single: { adult: 2, child: 1 }, twin: { adult: 1 }, couple: 0 },
}

const pricing: Accommodation[] = [
	{
		name: 'Luxury',
		description: 'Experience ultimate comfort and elegance',
		pricingTiers: [
			{
				name: 'Luxury',
				minSeats: 1,
				maxSeats: 4,
				bedOptions: [
					{ bedType: 'TWIN', maxOccupancy: 2, basePrice: 100, currency: 'EUR' },
					{
						bedType: 'SINGLE',
						maxOccupancy: 1,
						basePrice: 50,
						currency: 'EUR',
					},
					{
						bedType: 'COUPLE',
						maxOccupancy: 2,
						basePrice: 100,
						currency: 'EUR',
					},
				],
			},
		],
	},
	{
		name: 'Standard',
		description: 'Comfortable and affordable accommodation',
		pricingTiers: [
			{
				name: 'Standard',
				minSeats: 1,
				maxSeats: 4,
				bedOptions: [
					{ bedType: 'TWIN', maxOccupancy: 2, basePrice: 70, currency: 'EUR' },
					{
						bedType: 'SINGLE',
						maxOccupancy: 1,
						basePrice: 35,
						currency: 'EUR',
					},
					{
						bedType: 'COUPLE',
						maxOccupancy: 2,
						basePrice: 70,
						currency: 'EUR',
					},
				],
			},
		],
	},
]

// const result = calculateAccommodationPrice(guests, pricing)
export function countGuests(roomData: any) {
	let guestAdults = 0
	let guestChildren = 0

	// Helper function to add guests
	function addGuests(data: any) {
		if (typeof data === 'number') {
			guestAdults += data
		} else {
			guestAdults += data.adult || 0
			guestChildren += data.child || 0
		}
	}

	// Iterate through room types and configurations
	for (const roomType in roomData) {
		for (const bedType in roomData[roomType]) {
			const bedData = roomData[roomType][bedType]

			if (bedType === 'couple') {
				// For couple, count as 2 adults if it's a number
				if (typeof bedData === 'number') {
					guestAdults += 2 * bedData
				} else {
					addGuests(bedData)
				}
			} else {
				addGuests(bedData)
			}
		}
	}

	return {
		guestAdults,
		guestChildren,
		guestInfants: 0,
	}
}
