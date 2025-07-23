'use client'

import { useEffect, useState } from 'react'
// import { BookingsList } from './bookings-list'
import handelFetchAllBookings from '@/utils/api-utils/handelFetchAllBookings'
import { BookingsList } from './bookings-list'

export default function BookingsPage() {
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
			<h1 className="mb-10 text-4xl font-bold">Your Bookings</h1>
			<BookingsList bookings={bookings} />
		</div>
	)
}
