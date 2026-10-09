export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from 'next/server'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must, asDate } from '@/lib/db'
import { getBusinessTours } from '../../businessTours'

export async function GET(request: NextRequest) {
	try {
		const userData = await getUserData()
		if (!userData || !userData.id) {
			return NextResponse.json(
				{ message: 'User not found or not authenticated' },
				{ status: 401 },
			)
		}

		const businessTours = await getBusinessTours(userData.id)
		if (!businessTours) {
			return NextResponse.json({ invoices: [] })
		}

		const searchQuery = (request.nextUrl.searchParams.get('search') || '').toLowerCase()

		let bookings: any[] =
			must(
				await db
					.from(T.bookings)
					.select(
						`id, invoiceNumber, bookingState, totalPrice, createdAt, customer:${T.users}!customerId(id, name)`,
					)
					.in('tourId', businessTours.tourIds)
					.not('invoiceNumber', 'is', null)
					.order('createdAt', { ascending: false }),
			) ?? []

		if (searchQuery) {
			bookings = bookings.filter((b) =>
				b.customer?.name?.toLowerCase().includes(searchQuery),
			)
		}

		const invoices = bookings.map((booking) => ({
			id: booking.invoiceNumber || booking.id,
			customer: booking.customer?.name || 'Unknown Customer',
			amount: booking.totalPrice ? `$${booking.totalPrice.toFixed(2)}` : 'N/A',
			status:
				booking.bookingState === 'confirmed'
					? 'paid'
					: booking.bookingState === 'pending'
						? 'pending'
						: 'overdue',
			date: asDate(booking.createdAt)?.toISOString().split('T')[0],
		}))

		return NextResponse.json({ invoices })
	} catch (error) {
		console.error('Error fetching invoices:', error)
		return NextResponse.json(
			{ message: 'Error fetching invoices' },
			{ status: 500 },
		)
	}
}
