import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import bookingConfirmationEmailHook from './hooks/bookingConfirmationEmailHook'
import paymentConfirmationEmailHook from './hooks/paymentConfirmationEmailHook'
import refundConfirmationEmailHook from './hooks/refundConfirmationEmailHook'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
	const body = await req.text()
	const signature = headers().get('stripe-signature')!

	let event: Stripe.Event

	try {
		event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'Unknown error'
		console.log(`❌ Error message: ${errorMessage}`)
		return NextResponse.json(
			{ error: `Webhook Error: ${errorMessage}` },
			{ status: 400 },
		)
	}

	// Handle the event
	switch (event.type) {
		case 'payment_intent.succeeded':
			const paymentIntent = event.data.object as Stripe.PaymentIntent
			console.log('paymentIntent:', paymentIntent)
			if (paymentIntent.status === 'succeeded') {
				bookingConfirmationEmailHook(paymentIntent)
				paymentConfirmationEmailHook(paymentIntent)
				console.log(
					'yes-----------------------------------------------------------------------------send message here',
				)
			} else {
				console.log('no')
			}
			break

		case 'charge.refunded':
			const charge = event.data.object as Stripe.Charge
			const { metadata } = event.data.object as Stripe.Charge
			console.log('charge', JSON.stringify(charge))
			if (charge.refunded) {
				const refundDetails = charge.refunds?.data[0] // If there are multiple refunds, pick the first
				refundConfirmationEmailHook(charge)
			} else {
				console.log('Refund event received but not refunded.')
			}
			break

		default:
			console.log(`Unhandled event type ${event.type}`)
	}

	return NextResponse.json({ received: true })
}
