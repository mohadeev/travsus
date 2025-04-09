import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import { checkBookingRole } from '@/app/api/api-utils/actions/booking/checkBookingRole'

export const dynamic = 'force-dynamic' // This ensures the route is always dynamic

export async function GET(request: NextRequest) {
	console.log('GET request received for booking API')
	console.log('Request URL:', request.url)

	try {
		const bookingRole: any = await checkBookingRole(request)
		console.log('bookingRole', bookingRole)
		if (bookingRole.error) {
			return NextResponse.json(bookingRole, { status: bookingRole.status })
		}
		const { searchParams } = new URL(request.url)
		const bookingId = searchParams.get('bookingId')
		console.log('Extracted bookingId:', bookingId)

		// Check if `bookingId` parameter is provided
		if (!bookingId) {
			console.log('BookingId not provided, returning 400 error')
			return NextResponse.json(
				{ message: 'Booking ID is required' },
				{ status: 400 },
			)
		}

		console.log('Attempting to fetch booking from database')
		// Fetch the booking along with related information from the database using Prisma
		const booking = await prisma.booking.findFirst({
			where: {
				id: bookingId, // MongoDB ID is a string
			},
			include: {
				tour: {
					include: {
						// address: {
						// 	include: {
						// 		geoCoordinates: true,
						// 	},
						// },
					},
				},
				customer: true, // Include user information if needed
			},
		})
		console.log('Prisma query completed')

		console.log('Fetched booking:', JSON.stringify(booking?.id, null, 2))

		// Check if the booking exists
		if (!booking) {
			console.log('Booking not found, returning 404 error')
			return NextResponse.json(
				{ message: 'Booking not found' },
				{ status: 404 },
			)
		}

		console.log('Booking found, preparing to return data')
		// Return the booking data along with related information as a JSON response
		return NextResponse.json(booking)
	} catch (error) {
		console.error('Error occurred while fetching booking:', error)
		return NextResponse.json(
			{ message: 'Error fetching booking data' },
			{ status: 500 },
		)
	} finally {
		console.log('Closing Prisma client connection')
		// Close the Prisma client connection
		await prisma.$disconnect()
		console.log('Prisma client connection closed')
	}
}
