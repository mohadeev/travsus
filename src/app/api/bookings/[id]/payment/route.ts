export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import stripe from '@/lib/stripe'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must } from '@/lib/db'
import { recordPaymentSucceeded } from '@/lib/payments'

/**
 * Payment result for the confirmation page (/pay-done/payment). Also records
 * the payment when it succeeded, in case Stripe's webhook hasn't arrived yet.
 * The booking keeps the id of its Stripe checkout page (cs_…) or, for older
 * bookings, of its payment (pi_…).
 */
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
	const user = await getUserData()
	if (!user?.id) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
	const booking = must(
		await db
			.from(T.bookings)
			.select('id, bookingState, paymentIntentId')
			.match({ id: params.id, customerId: user.id })
			.maybeSingle(),
	)
	if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
	if (booking.bookingState === 'paid') return NextResponse.json({ status: 'succeeded' })
	// Book now, pay later: the deposit is paid, the trip is reserved
	if (booking.bookingState === 'deposit_paid') return NextResponse.json({ status: 'succeeded', plan: 'deposit' })
	const ref: string | null = booking.paymentIntentId
	if (!ref) return NextResponse.json({ status: 'unpaid' })

	try {
		let intent: Stripe.PaymentIntent | null = null
		if (ref.startsWith('cs_')) {
			const session = await stripe.checkout.sessions.retrieve(ref, { expand: ['payment_intent'] })
			intent = (session.payment_intent as Stripe.PaymentIntent | null) ?? null
			if (!intent) return NextResponse.json({ status: session.status === 'expired' ? 'canceled' : 'unpaid' })
		} else {
			intent = await stripe.paymentIntents.retrieve(ref)
		}
		if (intent.status === 'succeeded') await recordPaymentSucceeded(intent)
		return NextResponse.json({ status: intent.status, plan: intent.metadata?.plan ?? 'full', error: intent.last_payment_error?.message ?? null })
	} catch (error: any) {
		console.error('Payment status failed:', error?.type, error?.message)
		return NextResponse.json({ status: 'unknown' }, { status: 502 })
	}
}
