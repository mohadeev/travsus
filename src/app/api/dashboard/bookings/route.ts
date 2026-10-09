export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must, asDate } from '@/lib/db'
import { getBusinessTours } from '../businessTours'

export async function GET(request: Request) {
	try {
		const userData = await getUserData()
		if (!userData || !userData.id) {
			return NextResponse.json({ bookings: [] }, { status: 401 })
		}

		const businessTours = await getBusinessTours(userData.id)
		if (!businessTours) {
			return NextResponse.json({ bookings: [] })
		}

		const url = new URL(request.url)
		const searchQuery = (url.searchParams.get('search') || '').toLowerCase()
		const statusFilter = url.searchParams.get('status') || ''

		let query = db
			.from(T.bookings)
			.select(
				`id, selectedDate, bookingState, totalPrice, guests, orderNumber, createdAt,
				customer:${T.users}!customerId(id, name, email), tour:${T.tours}(id, name)`,
			)
			.in('tourId', businessTours.tourIds)
			.order('createdAt', { ascending: false })
		if (statusFilter) query = query.eq('bookingState', statusFilter)

		let bookings: any[] = must(await query) ?? []

		// Search across customer name, tour name and order number
		if (searchQuery) {
			bookings = bookings.filter((b) =>
				[b.customer?.name, b.tour?.name, b.orderNumber].some((v) =>
					v?.toLowerCase().includes(searchQuery),
				),
			)
		}

		const formattedBookings = bookings.map((booking) => ({
			id: booking.id,
			customer: booking.customer?.name || 'Unknown Customer',
			customerEmail: booking.customer?.email || '',
			tour: booking.tour?.name || 'Unknown Tour',
			tourId: booking.tour?.id || '',
			date: booking.selectedDate
				? new Date(booking.selectedDate.startDate).toISOString().split('T')[0]
				: 'N/A',
			status: booking.bookingState,
			amount: booking.totalPrice ? `$${booking.totalPrice.toFixed(2)}` : 'N/A',
			guests:
				(booking.guests?.guestAdults || 0) + (booking.guests?.guestChildren || 0),
			orderNumber: booking.orderNumber || '',
			createdAt: asDate(booking.createdAt)?.toISOString(),
		}))

		return NextResponse.json({ bookings: formattedBookings })
	} catch (error) {
		console.error('Error fetching bookings:', error)
		return NextResponse.json(
			{ message: 'Error fetching bookings', bookings: [] },
			{ status: 500 },
		)
	}
}
