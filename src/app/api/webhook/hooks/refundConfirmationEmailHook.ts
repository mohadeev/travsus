import { sendTemplate } from '@/lib/email/send'
import { db, T, must, touch } from '@/lib/db'
import { Stripe } from 'stripe'

export async function refundConfirmationEmailHook(charge: Stripe.Charge) {
	try {
		// Fetch the booking using the payment intent ID
		const booking: any = must(
			await db
				.from(T.bookings)
				.select(`*, customer:${T.users}!customerId(username, email, accountData), tour:${T.tours}(name)`)
				.eq('paymentIntentId', charge.payment_intent as string)
				.limit(1)
				.maybeSingle(),
		)

		if (!booking) {
			console.error('Booking not found for refund:', charge.payment_intent)
			return
		}

		const refund: any = charge?.refunds?.data[0] // Assuming we're dealing with the first refund

		// Amounts in euros (Stripe gives cents)
		const card = charge.payment_method_details?.card
		await sendTemplate('refund-confirmed', {
			to: booking.customer.email,
			data: {
				name: booking.customer.accountData?.firstname || booking.customer.username || 'there',
				reference: booking.bookingReference || booking.orderNumber || booking.id,
				tourName: booking.tour?.name || 'your tour',
				amount: (refund?.amount ?? charge.amount_refunded ?? 0) / 100,
				method: card?.brand ? `${card.brand.charAt(0).toUpperCase() + card.brand.slice(1)} ending in ${card.last4}` : 'your original payment method',
				date: new Date((refund?.created ?? charge.created) * 1000).toISOString(),
			},
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
