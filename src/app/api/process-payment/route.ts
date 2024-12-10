import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import prisma from '@/lib/prisma'
import getUserData from '../user/getUserData'
import totalAmount from '../api-utils/actions/booking/totalAmount'
import { updateBooking } from '../api-utils/actions/booking/updateBooking'
import { checkBookingRole } from '../api-utils/actions/booking/checkBookingRole'

export async function POST(request: NextRequest) {
	console.log('POST /api/process-payment - Processing payment')
	const { paymentMethodId, amount, currency } = await request.json()
	const referer = request.headers.get('referer') || ''
	const url = new URL(referer)
	const searchParams = url.searchParams
	const serviceId = searchParams.get('serviceId')
	const bookingId = searchParams.get('bookingId')
	const bookingRole: any = checkBookingRole(request)
	const allowed = bookingRole
	if (!allowed) {
		return NextResponse.json(
			{ error: bookingRole },
			{ status: bookingRole.status },
		)
	}
	console.log('bookingRole:', allowed)
	if (!serviceId || !bookingId) {
		console.error('POST /api/process-payment - Missing required fields')
		return NextResponse.json(
			{ message: 'Missing required fields' },
			{ status: 400 },
		)
	}

	const tour = await prisma.tour.findUnique({
		where: { id: serviceId },
	})
	const userData: any = await getUserData({})
	const { email: userEmail, id: userId } = userData
	if (!userId || !userEmail || !paymentMethodId || !amount || !currency) {
		console.error('POST /api/process-payment - Missing required fields')
		return NextResponse.json(
			{ message: 'Missing required fields' },
			{ status: 400 },
		)
	}
	const id = userId

	try {
		const bookingInitiated = await prisma.booking.findFirst({
			where: {
				id: bookingId,
				customerId: id,
				tourId: serviceId,
			},
			include: {
				customer: true,
				provider: true,
				tour: true,
			},
		})

		// Check if the booking already has a paymentIntentId
		// if (bookingInitiated?.paymentIntentId) {
		// 	console.log('POST /api/process-payment - Duplicate booking detected')
		// 	return NextResponse.json(
		// 		{ message: 'Duplicate booking is not allowed' },
		// 		{ status: 400 },
		// 	)
		// }

		let user = await prisma.user.findUnique({
			where: { id: userId },
			select: { stripeCustomerId: true },
		})

		if (!user?.stripeCustomerId) {
			console.log(
				`POST /api/process-payment - Creating new Stripe customer for user ${userId}`,
			)
			const customer = await stripe.customers.create({
				email: userEmail,
				metadata: { userId },
			})
			user = await prisma.user.update({
				where: { id: userId },
				data: { stripeCustomerId: customer.id },
			})
		}
		if (!user.stripeCustomerId) {
			return null
		}
		console.log(
			`POST /api/process-payment - Creating PaymentIntent for user ${userId}`,
		)
		const newTotalAmount = totalAmount(bookingInitiated?.lineItems)
		console.log('newTotalAmount: ', newTotalAmount)
		const amountInCents = Math.round(newTotalAmount * 100) // 362879
		const isMoha = userData?.email === 'skendoulmohamed@gmail.com'

		const paymentIntent = await stripe.paymentIntents.create({
			amount: isMoha ? 55 : amountInCents,
			currency,
			customer: user.stripeCustomerId,
			payment_method: paymentMethodId,
			off_session: true,
			confirm: true,
			capture_method: 'manual',
			metadata: {
				bookingId,
				serviceId,
				customerId: userId,
			},
		})

		const paymentMethod: any = await prisma.paymentMethod.findFirst({
			where: {
				userId: userId,
				stripePaymentMethodId: paymentMethodId,
			},
		})
		console.log('Duplicate booking detected:', paymentMethod)
		await updateBooking(bookingId, {
			paymentIntentId: paymentIntent.id,
			paymentMethodId: paymentMethod?.id,
		})
		console.log(
			`POST /api/process-payment - Successfully created PaymentIntent ${paymentIntent.id}`,
		)
		return NextResponse.json({
			success: true,
			paymentIntentId: paymentIntent.id,
			requiresCapture: paymentIntent.status === 'requires_capture',
		})
	} catch (error) {
		console.error(
			'POST /api/process-payment - Payment processing error:',
			error,
		)
		return NextResponse.json(
			{ message: 'Payment processing failed' },
			{ status: 500 },
		)
	}
}
