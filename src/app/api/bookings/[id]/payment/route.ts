export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must } from '@/lib/db'
import {
	CURRENCY,
	OPEN_STATES,
	amountToCharge,
	markBookingPaid,
	stripeCustomerFor,
} from '@/lib/payments'

// Stripe can still change these; anything else is final or in progress
const EDITABLE = ['requires_payment_method', 'requires_confirmation', 'requires_action']

async function ownBooking(id: string) {
	const user = await getUserData()
	if (!user?.id) return { user: null, booking: null }
	const booking = must(
		await db
			.from(T.bookings)
			.select('id, customerId, tourId, lineItems, bookingState, paymentIntentId')
			.match({ id, customerId: user.id })
			.maybeSingle(),
	)
	return { user, booking }
}

/**
 * Gets the payment for a booking ready (checkout page).
 * One PaymentIntent per booking: created once, its amount kept in sync
 * with the booking's current price. Returns what the Payment Element needs.
 */
export async function POST(
	_request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const { user, booking } = await ownBooking(params.id)
	if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
	if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
	if (!OPEN_STATES.includes(booking.bookingState)) {
		return NextResponse.json({ error: 'This booking is already paid' }, { status: 409 })
	}

	const amount = amountToCharge(booking.lineItems, user.email)
	if (amount < 50) {
		return NextResponse.json({ error: 'Nothing to pay for this booking' }, { status: 400 })
	}

	try {
		let intent = booking.paymentIntentId
			? await stripe.paymentIntents.retrieve(booking.paymentIntentId).catch(() => null)
			: null

		if (intent?.status === 'succeeded') {
			await markBookingPaid(intent)
			return NextResponse.json({ error: 'This booking is already paid' }, { status: 409 })
		}

		if (intent && EDITABLE.includes(intent.status)) {
			if (intent.amount !== amount) {
				intent = await stripe.paymentIntents.update(intent.id, { amount })
			}
		} else {
			intent = await stripe.paymentIntents.create(
				{
					amount,
					currency: CURRENCY,
					customer: await stripeCustomerFor(user),
					automatic_payment_methods: { enabled: true },
					receipt_email: user.email,
					description: `TRAVSUS booking ${booking.id}`,
					metadata: {
						bookingId: booking.id,
						serviceId: booking.tourId,
						customerId: user.id,
					},
				},
				// Two clicks at once get the same payment, not two
				{ idempotencyKey: `booking-${booking.id}-${amount}-${intent?.id ?? 'first'}` },
			)
			must(
				await db
					.from(T.bookings)
					.update({ paymentIntentId: intent.id, updatedAt: new Date().toISOString() })
					.eq('id', booking.id),
			)
		}

		return NextResponse.json({
			clientSecret: intent.client_secret,
			amount: intent.amount,
			currency: intent.currency,
		})
	} catch (error: any) {
		console.error('Payment setup failed:', error)
		return NextResponse.json(
			{ error: 'Payment could not be prepared. Please try again.' },
			{ status: 500 },
		)
	}
}

/**
 * Payment result for the confirmation page. Also records the payment when
 * it succeeded, in case Stripe's webhook hasn't arrived yet.
 */
export async function GET(
	_request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const { user, booking } = await ownBooking(params.id)
	if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
	if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
	if (booking.bookingState === 'paid') return NextResponse.json({ status: 'succeeded' })
	if (!booking.paymentIntentId) return NextResponse.json({ status: 'unpaid' })

	const intent = await stripe.paymentIntents.retrieve(booking.paymentIntentId)
	if (intent.status === 'succeeded') await markBookingPaid(intent)
	return NextResponse.json({
		status: intent.status,
		error: intent.last_payment_error?.message ?? null,
	})
}
