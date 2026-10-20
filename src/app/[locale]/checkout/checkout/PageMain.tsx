'use client'
import { PencilSquareIcon } from '@heroicons/react/24/outline'
import { type FC, useEffect, useRef } from 'react'
import ModalSelectDate from '@/components/ModalSelectDate'
import { formatTripDates, readTripDates } from '@/lib/tripDates'
import { useLocale } from 'next-intl'
import ModalSelectGuests from '@/components/ModalSelectGuests'
import Image from 'next/image'
import CheckoutPayment from './CheckoutPayment'
import PromoCodeForm from './PromoCode'
import getFetchDataFromApi from '@/utils/getFetchDataFromApi'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
	saveBookingChanges,
	selectBooking,
	selectPromoRemoved,
	setBooking,
} from '@/store/slices/booking'
import { useTranslations as useIntlTranslations } from 'next-intl'
import RowBedAccommodationSelector from '../../[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/RenderSideBar/RowBedAccommodationSelector'
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
	const tPayment = useIntlTranslations('Payment')
	const locale = useLocale()
	const dispatch = useAppDispatch()
	const router = useRouter()
	const bookingId = searchParams.get('bookingId')
	const booking = useAppSelector(selectBooking)
	const promoRemoved = useAppSelector(selectPromoRemoved)
	const { guests, lineItems, accommodation, bookOwnHotels } = booking
	// Last date saved on the server, so only real changes are sent
	const savedDate = useRef<string | null>(null)

	const fistImage = booking?.tour?.images?.[0]?.url || ''
	const service = booking?.tour

	useEffect(() => {
		;(async () => {
			try {
				const bookingData: any = await getFetchDataFromApi(
					'/api/booking/get/booking-data?',
					{
						bookingId: bookingId,
					},
				)
				if (!bookingData?.id) return
				// Already paid (or reserved with a deposit): show the confirmation instead of a second payment.
				// A failed tour-day balance stays here, so it can be paid.
				if (bookingData.bookingState === 'paid' || bookingData.bookingState === 'deposit_paid') {
					router.replace(`/pay-done/payment?bookingId=${bookingData.id}` as any)
					return
				}
				savedDate.current = JSON.stringify(bookingData.selectedDate ?? null)
				dispatch(setBooking(bookingData))
			} catch (error) {
				console.error(error)
			}
		})()
	}, [bookingId, dispatch, router])

	// Every change is saved on the server, which re-prices the booking
	// (the payment amount then follows automatically)
	const save = (changes: Record<string, any>) =>
		booking.id && dispatch(saveBookingChanges({ bookingId: booking.id, changes }))

	const handleGuestsChange = (data: any) => save({ guests: data?.guests })
	const handleAccomodationChange = (accommodation: any) => save({ accommodation })
	const handleBookOwnHotels = () => save({ bookOwnHotels: !bookOwnHotels })

	// The date modal updates the store; save the new date
	useEffect(() => {
		const date = JSON.stringify(booking.selectedDate ?? null)
		if (!booking.id || savedDate.current === null || date === savedDate.current) return
		savedDate.current = date
		save({ selectedDate: booking.selectedDate })
	}, [booking.selectedDate]) // eslint-disable-line react-hooks/exhaustive-deps

	// Tour photo, name, price details and total
	const summary = (
		<div className="overflow-hidden rounded-3xl ring-1 ring-neutral-200 dark:ring-neutral-800">
			<div className="flex items-center gap-4 p-4 sm:p-5 lg:block lg:p-0">
				<div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 lg:h-auto lg:w-full lg:rounded-none lg:aspect-[16/10] dark:bg-neutral-900">
					{fistImage && <Image alt="" fill sizes="(max-width: 1024px) 96px, 400px" src={fistImage} className="object-cover" />}
				</div>
				<p className="line-clamp-3 font-semibold leading-snug lg:px-6 lg:pt-5 lg:text-lg">{service?.name}</p>
			</div>
			<div className="border-t border-neutral-200 p-4 sm:p-5 lg:mx-6 lg:mt-5 lg:px-0 lg:pb-6 dark:border-neutral-800">
				<p className="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">{t('Booking_Details')}</p>
				<LineItemsBreakdown lineItems={lineItems} />
			</div>
		</div>
	)

	// One editable row of the trip (date, travellers)
	const tripRow = (label: string, value: string, onClick: () => void) => (
		<button
			type="button"
			onClick={onClick}
			className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-neutral-50 dark:hover:bg-neutral-900"
		>
			<span className="min-w-0">
				<span className="block text-sm text-neutral-500">{label}</span>
				<span className="mt-0.5 block truncate font-semibold">{value}</span>
			</span>
			<span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold underline underline-offset-4">
				<PencilSquareIcon className="h-4 w-4" />
				{tPayment('edit')}
			</span>
		</button>
	)

	return (
		<div className={`nc-CheckOutPagePageMain ${className}`}>
			{booking?.id ? (
				<main className="mx-auto max-w-6xl px-5 pb-24 pt-8 text-neutral-950 sm:pt-12 lg:pb-32 dark:text-white">
					<h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{t('Confirm_And_Payment')}</h1>

					<div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-10 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
						<div className="space-y-10">
							{/* Your trip */}
							<section>
								<h2 className="text-xl font-bold tracking-tight sm:text-2xl">{t('Your_Trip')}</h2>
								<div className="mt-4 divide-y divide-neutral-200 overflow-hidden rounded-3xl ring-1 ring-neutral-200 dark:divide-neutral-800 dark:ring-neutral-800">
									<ModalSelectDate
										duration={booking?.tour?.days?.length || 1}
										renderChildren={({ openModal }) =>
											tripRow(t('Date'), formatTripDates(...readTripDates(booking?.selectedDate), locale), openModal)
										}
									/>
									<ModalSelectGuests
										AcommodationAndTransport={
											<AcommodationAndTransport
												GuestsInput={<GuestsInput className="flex-1" onChange={handleGuestsChange} defaultValue={guests} />}
												RowBedAccommodationSelector={
													<RowBedAccommodationSelector defaultValue={accommodation} onChange={handleAccomodationChange} />
												}
												bookOwnHotels={bookOwnHotels}
												handleBookOwnHotels={handleBookOwnHotels}
											/>
										}
										renderChildren={({ openModal }) =>
											tripRow(
												t('Guests'),
												t('Guests_Count', { adults: guests?.guestAdults || 0, children: guests?.guestChildren || 0 }),
												openModal,
											)
										}
									/>
								</div>
							</section>

							{/* Phones: the summary sits here, before paying */}
							<div className="lg:hidden">{summary}</div>

							{/* Payment */}
							<section>
								<h2 className="text-xl font-bold tracking-tight sm:text-2xl">{t('Pay_With')}</h2>
								<div className="mt-4 space-y-5">
									{promoRemoved && (
										<p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
											{tPayment('promo_removed')}
										</p>
									)}
									<PromoCodeForm />
									<CheckoutPayment booking={booking} />
								</div>
							</section>
						</div>

						<aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">{summary}</aside>
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
		<div className="mx-auto max-w-6xl animate-pulse px-5 pb-24 pt-8 sm:pt-12">
			<div className="h-10 w-64 rounded-xl bg-neutral-100 dark:bg-neutral-900" />
			<div className="mt-8 grid gap-10 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-14">
				<div className="space-y-6">
					<div className="h-36 rounded-3xl bg-neutral-100 dark:bg-neutral-900" />
					<div className="h-14 rounded-full bg-neutral-100 dark:bg-neutral-900" />
				</div>
				<div className="hidden h-96 rounded-3xl bg-neutral-100 lg:block dark:bg-neutral-900" />
			</div>
		</div>
	)
}
