import getUserData from '@/app/api/user/getUserData'
import { db, T, must } from '@/lib/db'
import { updateBooking } from './updateBooking'

/** Saves the latest checkout choices onto the user's in-progress booking for this tour. */
export async function saveLastBookingUpdates({ request, booking }: any) {
	try {
		const { id }: any = (await getUserData({})) ?? {}
		const referer = request.headers.get('referer') || ''
		const url = new URL(referer)
		const serviceId: string = url.searchParams.get('serviceId') || ''
		const { accommodation, lineItems, guests, bookOwnHotels, selectedDate } =
			booking

		if (!serviceId || !id) {
			return null
		}
		const bookingInitiated = must(
			await db
				.from(T.bookings)
				.select('id')
				.match({ customerId: id, bookingState: 'initiated', tourId: serviceId })
				.limit(1)
				.maybeSingle(),
		)
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
