export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { checkBookingRole } from '@/app/api/api-utils/actions/booking/checkBookingRole'
import { db, T, must } from '@/lib/db'
import { safeUser } from '@/lib/users'

export async function GET(request: NextRequest) {
	try {
		const bookingRole: any = await checkBookingRole(request)
		if (bookingRole.error) {
			return NextResponse.json(bookingRole, { status: bookingRole.status })
		}
		const bookingId = new URL(request.url).searchParams.get('bookingId')

		if (!bookingId) {
			return NextResponse.json(
				{ message: 'Booking ID is required' },
				{ status: 400 },
			)
		}

		const booking: any = must(
			await db
				.from(T.bookings)
				.select(`*, tour:${T.tours}(*), customer:${T.users}!customerId(*)`)
				.eq('id', bookingId)
				.maybeSingle(),
		)

		if (!booking) {
			return NextResponse.json(
				{ message: 'Booking not found' },
				{ status: 404 },
			)
		}

		return NextResponse.json({ ...booking, customer: safeUser(booking.customer) })
	} catch (error) {
		console.error('Error occurred while fetching booking:', error)
		return NextResponse.json(
			{ message: 'Error fetching booking data' },
			{ status: 500 },
		)
	}
}
