import { PrismaClient } from '@prisma/client'
import { Stripe } from 'stripe'
import sendEmail from '@/utils/email/sendMail'
// import { bookingConfirmation } from '@/utils/email/templates/bookingConfirmation'

const prisma = new PrismaClient()

const bookingConfirmationEmailHook = async (
	paymentIntent: Stripe.PaymentIntent,
) => {
	try {
		// Fetch the booking using the payment intent ID
		const booking = await prisma.booking.findFirst({
			where: { paymentIntentId: paymentIntent.id },
			include: {
				customer: true,
				tour: true,
			},
		})

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
			message: 'dont write nothong here here v0 ok',
			type: 'bookingConfirmation',
			emailData: emailData,
		})

		console.log('Booking confirmation email sent:', booking.id)
	} catch (error) {
		console.error('Error in bookingConfirmationEmailHook:', error)
	}
}

export default bookingConfirmationEmailHook
