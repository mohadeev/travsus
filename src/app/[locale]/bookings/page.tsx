'use client'
export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react'
import { useTranslations } from '@/lib/i18n'
// import { BookingsList } from './bookings-list'
import handelFetchAllBookings from '@/utils/api-utils/handelFetchAllBookings'
import { BookingsList } from './bookings-list'

export default function BookingsPage() {
	const t = useTranslations('bookings_page')
	const [bookings, setBookings] = useState<any>([])
	useEffect(() => {
		;(async () => {
			const newBooking = await handelFetchAllBookings()
			if (Array.isArray(newBooking)) {
				setBookings(newBooking)
			} else {
			}
			console.log('newBooking', newBooking)
		})()
	}, [])
	return (
		<div className="container mx-auto py-10">
			<h1 className="mb-10 text-4xl font-bold">
				{t('bookings_page_Your_Bookings')}
			</h1>
			<BookingsList bookings={bookings} />
		</div>
	)
}
