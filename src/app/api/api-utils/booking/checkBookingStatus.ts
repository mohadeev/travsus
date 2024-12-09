import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function checkBookingStatus({ bookingId, serviceId }: any) {
	try {
		const booking = await prisma.booking.findUnique({
			where: {
				id: bookingId,
			},
			select: {
				bookingState: true,
				tourId: true,
			},
		})

		if (!booking) {
			console.error('Booking not found')
		}

		if (booking.tourId !== serviceId) {
			console.error('Service ID does not match the booking')
		}

		const isPaymentAccepted = booking.bookingState === 'PAYMENT_ACCEPTED'

		return isPaymentAccepted
	} catch (error) {
		console.error('Error checking booking:', error)
		throw error
	}
}
