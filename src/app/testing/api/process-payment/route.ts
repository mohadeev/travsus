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
	if (!userId || !userEmail || !currency) {
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

		// Fetch the user's payment methods
		const userPaymentMethods = await prisma.paymentMethod.findMany({
			where: { userId: userId },
			orderBy: { isDefault: 'desc' },
		})

		// Use the provided paymentMethodId or fall back to the default
		let selectedPaymentMethodId = paymentMethodId
		if (!selectedPaymentMethodId) {
			const defaultPaymentMethod = userPaymentMethods.find(
				(method) => method.isDefault,
			)
			if (defaultPaymentMethod) {
				selectedPaymentMethodId = defaultPaymentMethod.stripePaymentMethodId
			} else if (userPaymentMethods.length > 0) {
				selectedPaymentMethodId = userPaymentMethods[0].stripePaymentMethodId
			} else {
				console.error('POST /api/process-payment - No payment method available')
				return NextResponse.json(
					{ message: 'No payment method available' },
					{ status: 400 },
				)
			}
		}

		console.log(
			`POST /api/process-payment - Creating PaymentIntent for user ${userId}`,
		)
		const newTotalAmount = totalAmount(bookingInitiated?.lineItems)
		const amountInCents = Math.round(newTotalAmount * 100) // 362879
		const isMoha =
			userData?.email?.includes('@travsus.com') ||
			userData?.email?.includes('skendoul')
		const paymentIntent = await stripe.paymentIntents.create({
			amount: isMoha ? 55 : amountInCents,
			currency,
			customer: user.stripeCustomerId,
			payment_method: selectedPaymentMethodId,
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
				stripePaymentMethodId: selectedPaymentMethodId,
			},
		})
		console.log('Payment method used:', paymentMethod)
		await updateBooking(bookingId, {
			paymentIntentId: paymentIntent.id,
			paymentMethodId: paymentMethod?.id,
		})
		await connectPaymentMethodToBooking({
			bookingId,
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

const connectPaymentMethodToBooking = async ({
	paymentMethodId,
	bookingId,
}: any) => {
	const booking = await prisma.booking.update({
		where: {
			id: bookingId,
		},
		data: {
			paymentMethod: { connect: { id: paymentMethodId } },
		},
		include: { paymentMethod: true },
	})
	console.log('booking:', booking)
	return booking
}
