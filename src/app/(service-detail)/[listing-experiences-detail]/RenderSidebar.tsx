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
import { formatCurrency } from '@/utils/formatCurrency'
import { useAuthAction } from '@/app/hooks/useAuthAction'

export interface RenderSidebarProps {}

const RenderSidebar: FC<RenderSidebarProps> = ({}) => {
	const thisPathname = usePathname()
	const router = useRouter()
	const dispatch = useDispatch()
	const { booking, status } = useSelector((state: any) => state.bookingSlice)
	const user = useSelector((state: any) => state.userReducer.userData)
	const { guests, lineItems, accommodation, transport, bookOwnHotels } = booking

	const totalGuests: number = guests?.guestAdults + guests?.guestChildren
	const {
		name: title,
		price,
		days,
	}: any = useSelector((state: any) => state.creatingServiceSlice.service)
	const filteredLineItems = lineItems?.filter(
		({ includeInTotal }: any) => includeInTotal === true,
	)
	const totalAmount = filteredLineItems.reduce((total: any, item: any) => {
		return total + item.totalPrice
	}, 0)
	const [currentStatus, setCurrentStatus] = useState('')
	const [isDateSelected, setIsDateSelected] = useState(false)
	const [isShaking, setIsShaking] = useState(false)
	const [showError, setShowError] = useState(false)
	useEffect(() => {
		if (price >= 1) {
			dispatch(setPricePerSeat(price))
		}
	}, [dispatch, price])

	const handleDateChange = (date: any) => {
		dispatch(setSelectedDate(date))
		setIsDateSelected(!!date.startDate)
		setShowError(false)
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

	// const handleAddToWishList = useAuthAction(async () => {
	// 		dispatch(updateServiceState({ path: 'service.liked', value: !liked }))
	// 		await addAndRemoveToWishList({ serviceId })
	// 			.then((res: any) => {
	// 				if (res?.added === false || res?.added === true) {
	// 					dispatch(
	// 						updateServiceState({ path: 'service.liked', value: res?.added }),
	// 					)

	// 				}
	// 			})
	// 			.catch(() => {
	// 				dispatch(updateServiceState({ path: 'service.liked', value: !liked }))
	// 			})
	// 	})

	const handleReserveClick = useAuthAction(async () => {
		if (!isDateSelected) {
			setIsShaking(true)
			setShowError(true)
			setTimeout(() => setIsShaking(false), 1500) // 3 flashes in 1.5 seconds
		} else {
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
					if (result.id) {
						router.push(
							`/checkout/checkout?bookingId=${result.id}&serviceId=${tour.id}` as Route,
						)
					} else {
						alert('no booking created')
					}
					setCurrentStatus('')
				})
				.catch((error) => {
					setCurrentStatus('')
					console.error('Error:', error)
				})
		}
	})
	const priceStart = totalAmount / totalGuests

	return (
		<div
			className={`listingSectionSidebar__wrap shadow-xl ${isShaking ? 'shake' : ''}`}
		>
			{tour.days ? (
				<>
					<div className="flex justify-between">
						<span className="text-3xl font-semibold">
							{formatCurrency(priceStart)}
							<span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
								/per person
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
							isFlashing={isShaking}
							duration={days?.length}
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
						disabled={
							currentStatus === 'loading'
							// (process.env.NODE_ENV === 'development' &&
							// 	user?.email !== 'skendoulmohamed@gmail.com')
						}
						onClick={handleReserveClick}
					>
						{status === 'loading' ? 'Processing...' : 'Reserve'}
					</Button>
					{showError && (
						<p className="mt-2 text-sm text-red-500">
							You need to select a date
						</p>
					)}
				</>
			) : (
				<SidebarSkeletonLoader />
			)}
			<style jsx>{`
				@keyframes shake {
					0%,
					100% {
						transform: translateX(0);
					}
					10%,
					30%,
					50%,
					70%,
					90% {
						transform: translateX(-5px);
					}
					20%,
					40%,
					60%,
					80% {
						transform: translateX(5px);
					}
				}
				.shake {
					animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
				}
			`}</style>
		</div>
	)
}

export default RenderSidebar
