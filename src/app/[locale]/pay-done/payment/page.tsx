'use client'
import React, { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import getFetchDataFromApi from '@/utils/getFetchDataFromApi'
import { selectBooking, setBooking } from '@/store/slices/booking'
import { useSearchParams } from 'next/navigation'
import { formatTripDates, readTripDates } from '@/lib/tripDates'
import { useLocale, useTranslations } from 'next-intl'
import LineItemsBreakdown from '../../[country]/[city]/[category]/[name]/(service-detail)/[listingExperiencesDetail]/LineItems/LineItemsBreakdown'
import { BookingCard } from '../../checkout/checkout/BookingBreakDownCard'

export interface PayPageProps {}

const PayPage: FC<PayPageProps> = () => {
	const t = useTranslations('Jan03_PayPage_m5k8')
	const tPay = useTranslations('Payment')
	const locale = useLocale()
	const booking = useAppSelector(selectBooking)
	const { guests } = booking
	const searchParams = useSearchParams()
	const dispatch = useAppDispatch()
	const bookingId = searchParams.get('bookingId')
	const [payment, setPayment] = useState<{ status: string } | null>(null)

	// Ask the server for the result (it also records the payment if Stripe's
	// webhook hasn't arrived yet). Bank transfers etc. can take a moment.
	useEffect(() => {
		if (!bookingId) return
		let stopped = false
		let tries = 0
		const check = async () => {
			const response = await fetch(`/api/bookings/${bookingId}/payment`)
			const data = await response.json().catch(() => ({}))
			if (stopped) return
			// Just back from Stripe the payment can take a few seconds to show up
			const pending = ['processing', 'unpaid', 'unknown'].includes(data.status)
			setPayment({ status: response.ok ? (pending ? 'processing' : data.status) : 'error' })
			if (pending && tries++ < 20) setTimeout(check, 3000)
		}
		check()
		return () => {
			stopped = true
		}
	}, [bookingId])

	const status = payment?.status
	const succeeded = status === 'succeeded'
	const failed =
		!!status && !succeeded && status !== 'processing' && status !== 'error'

	useEffect(() => {
		;(async () => {
			try {
				const bookingData = await getFetchDataFromApi(
					'/api/booking/get/booking-data?',
					{
						bookingId: bookingId,
					},
				)
				if (bookingData) dispatch(setBooking(bookingData))
			} catch (error) {
				console.error(error)
			}
		})()
	}, [bookingId, dispatch])

	const renderContent = () => {
		return (
			<div className="flex w-full flex-col space-y-10 px-0 sm:rounded-2xl sm:p-6 xl:p-8">
				{/* Payment result */}
				{!payment ? (
					<p className="text-lg text-neutral-500">{tPay('confirming')}</p>
				) : succeeded ? (
					<div className="flex items-start gap-4">
						<CheckCircle2 className="h-10 w-10 shrink-0 text-emerald-600" />
						<div>
							<h2 className="text-3xl font-semibold lg:text-4xl">
								{tPay('succeeded_title')}
							</h2>
							<p className="mt-2 text-neutral-600">{tPay('confirmation_email')}</p>
						</div>
					</div>
				) : status === 'processing' ? (
					<div className="flex items-start gap-4">
						<Clock className="h-10 w-10 shrink-0 text-amber-500" />
						<div>
							<h2 className="text-3xl font-semibold">{tPay('processing_title')}</h2>
							<p className="mt-2 text-neutral-600">{tPay('processing_text')}</p>
						</div>
					</div>
				) : (
					<div className="flex items-start gap-4">
						<XCircle className="h-10 w-10 shrink-0 text-red-600" />
						<div>
							<h2 className="text-3xl font-semibold">
								{status === 'error' ? tPay('missing_booking') : tPay('failed_title')}
							</h2>
							{failed && (
								<>
									<p className="mt-2 text-neutral-600">{tPay('failed_text')}</p>
									<Link
										href={`/checkout/checkout?bookingId=${bookingId}` as any}
										className="mt-4 inline-flex rounded-full bg-black px-6 py-3 font-semibold text-white hover:bg-neutral-800"
									>
										{tPay('try_again')}
									</Link>
								</>
							)}
						</div>
					</div>
				)}
				<div className="border-b border-neutral-200 dark:border-neutral-700"></div>
				{/* ------------------------ */}
				<div className="space-y-6">
					<h3 className="text-2xl font-semibold">{t('your_booking')}</h3>
					<div className="flex flex-col sm:flex-row sm:items-center">
						<BookingCard booking={booking} />
					</div>
					<div className="mt-6 flex flex-col divide-y divide-neutral-200 rounded-3xl border border-neutral-200 dark:divide-neutral-700 dark:border-neutral-700 sm:flex-row sm:divide-x sm:divide-y-0">
						<div className="flex flex-1 space-x-4 p-5">
							<svg
								className="dark:text-neutral-6000 h-8 w-8 text-neutral-300"
								viewBox="0 0 28 28"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M9.33333 8.16667V3.5M18.6667 8.16667V3.5M8.16667 12.8333H19.8333M5.83333 24.5H22.1667C23.4553 24.5 24.5 23.4553 24.5 22.1667V8.16667C24.5 6.878 23.4553 5.83333 22.1667 5.83333H5.83333C4.54467 5.83333 3.5 6.878 3.5 8.16667V22.1667C3.5 23.4553 4.54467 24.5 5.83333 24.5Z"
									stroke="#D1D5DB"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<div className="flex flex-col">
								<span className="text-sm text-neutral-400">{t('date')}</span>
								<span className="mt-1.5 text-lg font-semibold">
									{formatTripDates(...readTripDates(booking?.selectedDate), locale)}
								</span>
							</div>
						</div>
						<div className="flex flex-1 space-x-4 p-5">
							<svg
								className="dark:text-neutral-6000 h-8 w-8 text-neutral-300"
								viewBox="0 0 28 28"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M14 5.07987C14.8551 4.11105 16.1062 3.5 17.5 3.5C20.0773 3.5 22.1667 5.58934 22.1667 8.16667C22.1667 10.744 20.0773 12.8333 17.5 12.8333C16.1062 12.8333 14.8551 12.2223 14 11.2535M17.5 24.5H3.5V23.3333C3.5 19.4673 6.63401 16.3333 10.5 16.3333C14.366 16.3333 17.5 19.4673 17.5 23.3333V24.5ZM17.5 24.5H24.5V23.3333C24.5 19.4673 21.366 16.3333 17.5 16.3333C16.225 16.3333 15.0296 16.6742 14 17.2698M15.1667 8.16667C15.1667 10.744 13.0773 12.8333 10.5 12.8333C7.92267 12.8333 5.83333 10.744 5.83333 8.16667C5.83333 5.58934 7.92267 3.5 10.5 3.5C13.0773 3.5 15.1667 5.58934 15.1667 8.16667Z"
									stroke="#D1D5DB"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<div className="flex flex-col">
								<span className="text-sm text-neutral-400">{t('guests')}</span>
								<span className="mt-1.5 text-lg font-semibold">
									{t('guests_count', {
										adults: guests?.guestAdults || 0,
										children: guests?.guestChildren || 0,
									})}
								</span>
							</div>
						</div>
					</div>
				</div>
				{/* ------------------------ */}
				<div className="flex w-full justify-start">
					<div className="p-x-6 w-full max-w-xl">
						<LineItemsBreakdown lineItems={booking?.lineItems} />
					</div>
				</div>
				{succeeded && (
					<div>
						<ButtonPrimary href={'/bookings' as any}>{t('manage_booking')}</ButtonPrimary>
					</div>
				)}
			</div>
		)
	}

	return (
		<div className={`nc-PayPage`}>
			<main className="container mb-24 mt-11 lg:mb-32">
				<div className="mx-auto max-w-4xl">{renderContent()}</div>
			</main>
		</div>
	)
}

export default PayPage
