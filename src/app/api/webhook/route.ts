export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import stripe from '@/lib/stripe'
import { markBookingPaid, markPaymentFailed } from '@/lib/payments'
import refundConfirmationEmailHook from './hooks/refundConfirmationEmailHook'

/**
 * Stripe → TRAVSUS events. This is the source of truth for payments:
 * a booking becomes "paid" here even if the customer closes the tab.
 * Stripe dashboard → Developers → Webhooks: point it at /api/webhook with
 * payment_intent.succeeded, payment_intent.payment_failed, charge.refunded.
 */
export async function POST(request: NextRequest) {
	const signature = request.headers.get('stripe-signature')
	const secret = process.env.STRIPE_WEBHOOK_SECRET
	if (!signature || !secret) {
		return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
	}

	let event: Stripe.Event
	try {
		event = stripe.webhooks.constructEvent(await request.text(), signature, secret)
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error'
		console.error('Stripe webhook signature failed:', message)
		return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
	}

	try {
		switch (event.type) {
			case 'payment_intent.succeeded':
				await markBookingPaid(event.data.object as Stripe.PaymentIntent)
				break
			case 'payment_intent.payment_failed':
				await markPaymentFailed(event.data.object as Stripe.PaymentIntent)
				break
			case 'charge.refunded': {
				const charge = event.data.object as Stripe.Charge
				if (charge.refunded) await refundConfirmationEmailHook(charge)
				break
			}
		}
	} catch (error) {
		// 500 makes Stripe retry the event later
		console.error(`Stripe webhook ${event.type} failed:`, error)
		return NextResponse.json({ error: 'Handler failed' }, { status: 500 })
	}

	return NextResponse.json({ received: true })
}
