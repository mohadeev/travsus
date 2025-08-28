'use client'

import { type FC, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import StartRating from '@/components/StartRating'
import StayDatesRangeInput from './StayDatesRangeInput'
import GuestsInput from './GuestsInput'
import type { Route } from 'next'
import { useDispatch, useSelector } from 'react-redux'
import {
	bookOwnHotelsReducers,
	localUpdateLineItemsLogicAsync,
	setPricePerSeat,
	setSelectedDate,
	updateProvidedService,
} from '@/app/GlobalRedux/Features/bookingSlice/bookingSlice'
import LineItemsBreakdown from './LineItemsBreakdown'
import TransportTypes from './TransportTypes'
import RowBedAccommodationSelector from './RowBedAccommodationSelector'
import AcommodationAndTransport from './listing-components/AcommodationAndTransport'
import SidebarSkeletonLoader from './SidebarSkeletonLoader'
import { Button } from '@/components/ui'
import { formatCurrency } from '@/utils/formatCurrency'
import { useAuthAction } from '@/app/hooks/useAuthAction'
import { useTranslations } from 'next-intl'
import BookNowPayLatter from './BookNowPayLatter'

export type RenderSidebarProps = {}

const RenderSidebar: FC<RenderSidebarProps> = ({}) => {
	const t = useTranslations('Jan03_RenderSidebar_k7m9')
	const router = useRouter()
	const dispatch = useDispatch()
	const { booking, status } = useSelector((state: any) => state.bookingSlice)
	const user = useSelector((state: any) => state.userReducer.userData)
	const { guests, lineItems, accommodation, transport, bookOwnHotels } = booking
	const totalGuests: number = guests?.guestAdults + guests?.guestChildren || 2

	const {
		name: title,
		price,
		days,
		pricingTiers,
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
	}, [booking, dispatch, tour])

	useEffect(() => {
		if (tour && booking.lineItems >= 0) {
			dispatch(
				localUpdateLineItemsLogicAsync({
					value: { guestAdults: 2, guestChildren: 0 },
					tour,
				}),
			)
		}
	}, [booking, tour, dispatch])

	const handleReserveClick = useAuthAction(async () => {
		if (!isDateSelected) {
			const section = document.getElementById('StayDatesRangeInput_TOUR')
			if (section) {
				section.scrollIntoView({ behavior: 'smooth' })
			}
			setIsShaking(true)
			setShowError(true)

			setTimeout(() => setIsShaking(false), 5000) // 3 flashes in 1.5 seconds
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
						alert(t('no_booking_created'))
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
		<div className={`listingSectionSidebar__wrap ${isShaking ? 'shake' : ''}`}>
			{tour.days ? (
				<>
					<div className="flex justify-between">
						<span className="text-3xl font-semibold">
							{formatCurrency(priceStart)}
							<span className="ml-1 text-base font-normal text-neutral-500 dark:text-neutral-400">
								{t('per_person')}
							</span>
						</span>
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
						{showError && (
							<p className="mt-2 text-sm text-red-500">
								{t('select_date_error')}
							</p>
						)}
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
						pricingTiers={pricingTiers}
						transportLineItem={transportLineItem}
					/>

					<LineItemsBreakdown lineItems={booking?.lineItems} />
					<BookNowPayLatter />
					<Button
						loading={currentStatus === 'loading'}
						className="mt-4 w-full"
						disabled={currentStatus === 'loading'}
						onClick={handleReserveClick}
					>
						{status === 'loading' ? t('processing') : t('reserve')}
					</Button>
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
