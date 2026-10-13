export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must, touch } from '@/lib/db'
import { OPEN_STATES, priceBooking } from '@/lib/payments'
import { validTripDates } from '@/lib/tripDates'

/**
 * Changes a booking before it is paid (checkout page): date, guests,
 * accommodation or "own hotels". The price is recalculated here.
 * A promo code is removed when the price changes; the page asks to re-apply it.
 */
export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const user = await getUserData()
	if (!user?.id) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
	}

	const booking = must(
		await db
			.from(T.bookings)
			.select(`*, tour:${T.tours}(*)`)
			.match({ id: params.id, customerId: user.id })
			.maybeSingle(),
	)
	if (!booking) {
		return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
	}
	if (!OPEN_STATES.includes(booking.bookingState)) {
		return NextResponse.json(
			{ error: 'This booking is already paid' },
			{ status: 409 },
		)
	}

	const changes = await request.json().catch(() => ({}))
	const update: Record<string, any> = {}
	if (changes.selectedDate) {
		const dates = validTripDates(changes.selectedDate, booking.tour?.days?.length || 1)
		if (!dates) {
			return NextResponse.json({ error: 'Please choose a date from tomorrow onwards' }, { status: 400 })
		}
		update.selectedDate = dates
	}

	const repricing =
		'guests' in changes || 'accommodation' in changes || 'bookOwnHotels' in changes
	let promoRemoved = false
	if (repricing) {
		const bookOwnHotels = changes.bookOwnHotels ?? booking.bookOwnHotels
		const priced = await priceBooking(booking.tour, {
			guests: changes.guests ?? booking.guests,
			// Guests changed on their own: let the pricing pick rooms again
			accommodation: 'accommodation' in changes ? changes.accommodation : undefined,
			bookOwnHotels,
		})
		promoRemoved = (booking.lineItems ?? []).some((item: any) =>
			item.description?.startsWith?.('Promo Code Applied'),
		)
		Object.assign(update, {
			lineItems: priced.lineItems,
			guests: priced.guests,
			accommodation: priced.accommodation,
			bookOwnHotels: !!bookOwnHotels,
		})
	}

	const saved = must(
		await db
			.from(T.bookings)
			.update(touch(update))
			.eq('id', booking.id)
			.select(`*, tour:${T.tours}(*)`)
			.single(),
	)
	return NextResponse.json({ booking: saved, promoRemoved })
}
