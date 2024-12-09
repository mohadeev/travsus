import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import getUserData from '@/app/api/user/getUserData'
import { updateBooking } from './updateBooking'

const prisma = new PrismaClient()

export async function saveLastBookingUpdates({ request, booking }: any) {
	try {
		const { id }: any = await getUserData({})
		const referer = request.headers.get('referer') || ''
		const url = new URL(referer)
		const searchParams = url.searchParams
		const serviceId: string = searchParams.get('serviceId') || ''
		const tour = await prisma.tour.findFirst({
			where: { id: serviceId },
		})
		// const body = await request.json()
		const { accommodation, lineItems, guests, bookOwnHotels, selectedDate } =
			booking

		if (!serviceId) {
			return null
		}
		const bookingInitiated = await prisma.booking.findFirst({
			where: {
				customerId: id, // Replace with the actual customer ID
				bookingState: 'initiated', // The specific booking state
				tourId: serviceId, // Replace with the actual tour ID
			},
			include: {
				customer: true, // Include customer details (optional)
				provider: true, // Include provider details (optional)
				tour: true, // Include tour details (optional)
			},
		})
		if (bookingInitiated) {
			await updateBooking(bookingInitiated.id, {
				accommodation,
				lineItems,
				guests,
				bookOwnHotels,
				selectedDate,
			})
			return { bookingInitiated, status: 200 }
		}
	} catch (error) {
		console.error('Error save Last Booking Updates:', error)
		return {
			error: 'Failed to create dummy booking',
			details: (error as Error).message,
			status: 500,
		}
	}
}
