export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import getUserData from '../user/getUserData'
import { createOrderNumber } from '@/app/actions/generateOrderNumber'
import { db, T, must, withMeta } from '@/lib/db'
import { priceBooking } from '@/lib/payments'
import { validTripDates } from '@/lib/tripDates'
import { creditBooking, REF_COOKIE } from '@/lib/affiliates'
import stripe from '@/lib/stripe'
import { OPEN_STATES } from '@/lib/payments'

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
		const now = new Date().toISOString()
		const details = {
			duration: tour.days?.length || 1,
			selectedDate: dates,
			lineItems: priced.lineItems,
			accommodation: priced.accommodation,
			guests: priced.guests,
			bookOwnHotels: !!bookOwnHotels,
		}

		// Already an unpaid booking for this tour (went back and changed the
		// date or guests): update it instead of leaving a "not paid" one behind
		const open: any = must(
			await db
				.from(T.bookings)
				.select('id, paymentIntentId')
				.match({ customerId: user.id, tourId })
				.in('bookingState', OPEN_STATES)
				.order('createdAt', { ascending: false })
				.limit(1)
				.maybeSingle(),
		)
		if (open && (await closeOpenCheckout(open.paymentIntentId))) {
			const updated = must(
				await db
					.from(T.bookings)
					.update({ ...details, paymentIntentId: null, updatedAt: now })
					.eq('id', open.id)
					.in('bookingState', OPEN_STATES)
					.select('*')
					.maybeSingle(),
			)
			if (updated) {
				await creditBooking(updated.id, user.email, request.cookies.get(REF_COOKIE)?.value)
				return NextResponse.json(updated, { status: 200 })
			}
		}

		const numberRef = await createOrderNumber()
		if (!numberRef) throw new Error('Could not generate order number')

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
						...details,
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

/**
 * Before changing an unpaid booking: closes its Stripe payment page, so the
 * old price can't be paid any more. False when that page was already paid
 * (then a new booking is made instead).
 */
async function closeOpenCheckout(sessionId: unknown) {
	if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) return true
	try {
		const session = await stripe.checkout.sessions.retrieve(sessionId)
		if (session.payment_status === 'paid') return false
		if (session.status === 'open') await stripe.checkout.sessions.expire(sessionId)
		return true
	} catch {
		// Unknown or already gone: nothing left to pay
		return true
	}
}
