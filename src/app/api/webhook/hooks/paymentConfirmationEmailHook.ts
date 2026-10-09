import { db, T, must } from '@/lib/db'
import { Stripe } from 'stripe'
import sendEmail from '@/utils/email/sendMail'

const bookingConfirmationEmailHook = async (
	paymentIntent: Stripe.PaymentIntent,
) => {
	try {
		// Fetch the booking using the payment intent ID
		const booking: any = must(
			await db
				.from(T.bookings)
				.select(`*, customer:${T.users}!customerId(username, email), tour:${T.tours}(name)`)
				.eq('paymentIntentId', paymentIntent.id)
				.limit(1)
				.maybeSingle(),
		)

		if (!booking) {
			console.error('Booking not found for payment:', paymentIntent.id)
			return
		}

		const emailData = {
			name: booking.customer.username || booking.customer.email,
			bookingReference: booking.id,
			destination: booking.tour.name || 'Your destination',
			checkInDate: booking.selectedDate?.startDate
				? new Date(booking.selectedDate.startDate).toISOString().split('T')[0]
				: 'N/A',
			checkOutDate: booking.selectedDate?.endDate
				? new Date(booking.selectedDate.endDate).toISOString().split('T')[0]
				: 'N/A',
			numberOfGuests:
				(booking.guests?.guestAdults || 0) +
				(booking.guests?.guestChildren || 0),
			totalAmount: `${(paymentIntent.amount / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}`,
			bookingDetailsLink: `${process.env.NEXT_PUBLIC_SITE_URL}/bookings/${booking.id}`,
		}

		// const emailContent = bookingConfirmation(emailData)

		await sendEmail({
			to: booking.customer.email,
			subject: 'Booking Confirmation - Travsus',
			message: '',
			type: 'bookingConfirmation',
			emailData: emailData,
		})

		console.log('Booking confirmation email sent:', booking.id)
	} catch (error) {
		console.error('Error in bookingConfirmationEmailHook:', error)
	}
}

export default bookingConfirmationEmailHook
