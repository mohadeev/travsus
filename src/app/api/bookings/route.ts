export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import getUserData from '../user/getUserData'
import { createOrderNumber } from '@/app/actions/generateOrderNumber'
import { db, T, must, withMeta } from '@/lib/db'
import { priceBooking } from '@/lib/payments'
import { validTripDates } from '@/lib/tripDates'
import { creditBooking, REF_COOKIE } from '@/lib/affiliates'

/**
 * Creates a booking for a tour (the "Reserve" button).
 * Body: { tourId, selectedDate, guests, accommodation, bookOwnHotels }
 * The price is calculated here, never taken from the browser.
 */
export async function POST(request: NextRequest) {
	const user = await getUserData()
	if (!user?.id) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
	}

	const body = await request.json().catch(() => ({}))
	const tourId: string = body.tourId || body.tour?.id || ''
	const { selectedDate, guests, accommodation, bookOwnHotels } = body
	if (!/^[0-9a-f]{24}$/.test(tourId)) {
		return NextResponse.json({ error: 'Missing tour' }, { status: 400 })
	}

	try {
		const tour = must(
			await db.from(T.tours).select('*').eq('id', tourId).maybeSingle(),
		)
		if (!tour) {
			return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
		}

		// A real start day that isn't in the past; the end follows the tour length
		const dates = validTripDates(selectedDate, tour.days?.length || 1)
		if (!dates) {
			return NextResponse.json({ error: 'Please choose a date from tomorrow onwards' }, { status: 400 })
		}

		const priced = await priceBooking(tour, { guests, accommodation, bookOwnHotels })
		const numberRef = await createOrderNumber()
		if (!numberRef) throw new Error('Could not generate order number')
		const now = new Date().toISOString()

		const booking = must(
			await db
				.from(T.bookings)
				.insert(
					withMeta({
						customerId: user.id,
						providerId: tour.creatorId,
						tourId,
						bookingStates: [
							{ state: 'initiated', createdAt: now, by: 'customer', updatedAt: now },
						],
						bookingState: 'initiated',
						duration: tour.days?.length || 1,
						selectedDate: dates,
						lineItems: priced.lineItems,
						accommodation: priced.accommodation,
						guests: priced.guests,
						bookOwnHotels: !!bookOwnHotels,
						...numberRef,
					}),
				)
				.select('*')
				.single(),
		)

		// Came through an affiliate's link in the last 60 days: credit them
		await creditBooking(booking.id, user.email, request.cookies.get(REF_COOKIE)?.value)

		return NextResponse.json(booking, { status: 201 })
	} catch (error) {
		console.error('Error creating booking:', error)
		return NextResponse.json(
			{ error: 'Could not create the booking' },
			{ status: 500 },
		)
	}
}
