import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function updateBooking(bookingId: string, updateData: any) {
	try {
		const updatedBooking = await prisma.booking.update({
			where: {
				id: bookingId,
			},
			data: updateData,
		})

		return updatedBooking
	} catch (error) {
		console.error('Error updating booking:', error)
		console.error('Booking update failed.')
	}
}
