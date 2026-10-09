import sendEmail from '@/utils/email/sendMail'
import { db, T, must, touch } from '@/lib/db'
import { Stripe } from 'stripe'

export async function refundConfirmationEmailHook(charge: Stripe.Charge) {
	try {
		// Fetch the booking using the payment intent ID
		const booking: any = must(
			await db
				.from(T.bookings)
				.select(`*, customer:${T.users}!customerId(username, email), tour:${T.tours}(name)`)
				.eq('paymentIntentId', charge.payment_intent as string)
				.limit(1)
				.maybeSingle(),
		)

		if (!booking) {
			console.error('Booking not found for refund:', charge.payment_intent)
			return
		}

		const refund: any = charge?.refunds?.data[0] // Assuming we're dealing with the first refund

		const emailData = {
			name: booking.customer.username || booking.customer.email,
			email: booking.customer.email,
			transactionId: booking.id,
			paymentDate: new Date(charge.created * 1000).toISOString().split('T')[0],
			amount: `$${(refund.amount / 100).toFixed(2)}`,
			paymentMethod: charge.payment_method_details?.card
				? `${charge.payment_method_details.card.brand} ending in ${charge.payment_method_details.card.last4}`
				: 'Unknown payment method',
			description: `Refund for ${booking.tour.name || 'Tour'} (Booking Ref: ${booking.id})`,
			receiptLink: `${process.env.NEXT_PUBLIC_SITE_URL}/bookings/${booking.id}`,
		}

		await sendEmail({
			to: emailData.email,
			subject: 'Refund Confirmation',
			message: '', // The actual message will be handled by the email template
			type: 'refundConfirmation',
			emailData: emailData,
		})

		// Update booking state
		const now = new Date().toISOString()
		must(
			await db
				.from(T.bookings)
				.update(
					touch({
						bookingState: 'REFUNDED',
						bookingStates: [
							...(booking.bookingStates ?? []),
							{ state: 'REFUNDED', by: 'SYSTEM', createdAt: now, updatedAt: now },
						],
					}),
				)
				.eq('id', booking.id),
		)

		console.log(
			'Refund confirmation email sent and booking updated:',
			booking.id,
		)
	} catch (error) {
		console.error('Error in refundConfirmationEmailHook:', error)
	}
}

export default refundConfirmationEmailHook
