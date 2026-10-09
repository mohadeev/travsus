import { db, T, must, touch } from '@/lib/db'

export async function updateBooking(bookingId: string, updateData: any) {
	try {
		return must(
			await db
				.from(T.bookings)
				.update(touch(updateData))
				.eq('id', bookingId)
				.select('*')
				.single(),
		)
	} catch (error) {
		console.error('Error updating booking:', error)
		console.error('Booking update failed.')
	}
}
