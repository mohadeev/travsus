export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { db, T, must, touch } from '@/lib/db'
import getUserData from '@/app/api/user/getUserData'

export async function POST(request: Request) {
	try {
		// Get the current user
		const userData = await getUserData()

		// Check if user is authenticated
		if (!userData || !userData.id) {
			return NextResponse.json(
				{ success: false, message: 'Unauthorized' },
				{ status: 401 },
			)
		}

		// Get the business associated with this user
		const business = must(
			await db
				.from(T.businesses)
				.select('id')
				.eq('creatorId', userData.id)
				.limit(1)
				.maybeSingle(),
		)

		// If no business found, return error
		if (!business) {
			return NextResponse.json(
				{ success: false, message: 'Business not found' },
				{ status: 404 },
			)
		}

		// Parse the request body
		const body = await request.json()
		const { bookingId, newStatus } = body

		if (!bookingId || !newStatus) {
			return NextResponse.json(
				{ success: false, message: 'Booking ID and new status are required' },
				{ status: 400 },
			)
		}

		// Verify the booking belongs to this business
		const booking: any = must(
			await db
				.from(T.bookings)
				.select(`id, bookingStates, tour:${T.tours}(businessId)`)
				.eq('id', bookingId)
				.maybeSingle(),
		)

		if (!booking) {
			return NextResponse.json(
				{ success: false, message: 'Booking not found' },
				{ status: 404 },
			)
		}

		if (booking.tour?.businessId !== business.id) {
			return NextResponse.json(
				{
					success: false,
					message: 'This booking does not belong to your business',
				},
				{ status: 403 },
			)
		}

		// Update the booking status
		const now = new Date().toISOString()
		must(
			await db
				.from(T.bookings)
				.update(
					touch({
						bookingState: newStatus,
						bookingStates: [
							...(booking.bookingStates ?? []),
							{ state: newStatus, by: userData.id, createdAt: now, updatedAt: now },
						],
					}),
				)
				.eq('id', bookingId),
		)

		return NextResponse.json({
			success: true,
			message: `Booking status updated to ${newStatus}`,
		})
	} catch (error) {
		console.error('Error updating booking status:', error)
		return NextResponse.json(
			{ success: false, message: 'Error updating booking status' },
			{ status: 500 },
		)
	}
}
