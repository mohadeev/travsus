export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must } from '@/lib/db'
import { OPEN_STATES } from '@/lib/payments'
import { sendBookingRequest } from '@/lib/email/booking'

/**
 * Tours booked on request (tour.bookingMode === 'request'): turns the
 * customer's new booking into a request. Nothing is paid; the team confirms
 * availability by email, then sends a payment link.
 */
export async function POST(_request: NextRequest, props: { params: Promise<{ id: string }> }) {
	const { id } = await props.params
	const user = await getUserData()
	if (!user?.id) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

	const booking = must(
		await db
			.from(T.bookings)
			.select(`id, bookingState, bookingStates, tour:${T.tours}(id, bookingMode)`)
			.match({ id, customerId: user.id })
			.maybeSingle(),
	)
	if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
	if (booking.tour?.bookingMode !== 'request') {
		return NextResponse.json({ error: 'This tour is booked online' }, { status: 409 })
	}
	// Asked again (new date or guests on the same request): send the updated request
	if (booking.bookingState === 'requested') {
		await sendBookingRequest(id)
		return NextResponse.json({ ok: true, id })
	}
	if (!OPEN_STATES.includes(booking.bookingState)) {
		return NextResponse.json({ error: 'This booking is already confirmed' }, { status: 409 })
	}

	const now = new Date().toISOString()
	must(
		await db
			.from(T.bookings)
			.update({
				bookingState: 'requested',
				bookingStates: [...(booking.bookingStates ?? []), { state: 'requested', createdAt: now, by: 'customer', updatedAt: now }],
				updatedAt: now,
			})
			.eq('id', id),
	)
	await sendBookingRequest(id)
	return NextResponse.json({ ok: true, id })
}
