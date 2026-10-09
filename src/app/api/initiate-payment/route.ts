export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import { db, T, must, touch } from '@/lib/db'
import getUserData from '../user/getUserData'
import totalAmount from '../api-utils/actions/booking/totalAmount'
import { updateBooking } from '../api-utils/actions/booking/updateBooking'

export async function POST(request: NextRequest) {
	console.log('POST /api/initiate-payment - Initiating payment')
	const { paymentMethodId, stripePaymentMethodId, amount, currency } =
		await request.json()
	const userData = await getUserData({})
	if (!userData) {
		return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
	}
	// Internal test accounts are charged a symbolic amount (exact matches only)
	const TEST_PAYMENT_EMAILS = ['skendoulmohamed@gmail.com']
	const email = (userData.email || '').toLowerCase()
	const isTestAccount =
		TEST_PAYMENT_EMAILS.includes(email) || email.endsWith('@travsus.com')
	const referer = request.headers.get('referer') || ''
	const url = new URL(referer)
	const searchParams = url.searchParams
	const serviceId = searchParams.get('serviceId')
	const bookingId = searchParams.get('bookingId')

	if (!serviceId || !bookingId) {
		console.error('POST /api/initiate-payment - Missing required fields')
		return NextResponse.json(
			{ message: 'Missing required fields' },
			{ status: 400 },
		)
	}
	const { email: userEmail, id: userId } = userData
	console.log(
		userId,
		userEmail,
		paymentMethodId,
		stripePaymentMethodId,
		currency,
	)

	if (!userId || !userEmail || !paymentMethodId || !currency) {
		console.error('POST /api/initiate-payment - Missing required fields')
		return NextResponse.json(
			{ message: 'Missing required fields' },
			{ status: 400 },
		)
	}
	const id = userId

	try {
		const bookingInitiated = must(
			await db
				.from(T.bookings)
				.select('id, lineItems, paymentIntentId')
				.match({ id: bookingId, customerId: id, tourId: serviceId })
				.maybeSingle(),
		)
		if (!bookingInitiated) {
			return NextResponse.json({ message: 'Booking not found' }, { status: 404 })
		}

		// Check if the booking already has a paymentIntentId
		// if (bookingInitiated?.paymentIntentId) {
		// 	console.log('POST /api/initiate-payment - Duplicate booking detected')
		// 	return NextResponse.json(
		// 		{ message: 'Duplicate booking is not allowed' },
		// 		{ status: 400 },
		// 	)
		// }

		let user = must(
			await db.from(T.users).select('stripeCustomerId').eq('id', userId).maybeSingle(),
		)

		if (!user?.stripeCustomerId) {
			console.log(
				`POST /api/initiate-payment - Creating new Stripe customer for user ${userId}`,
			)
			const customer = await stripe.customers.create({
				email: userEmail,
				metadata: { userId },
			})
			user = must(
				await db
					.from(T.users)
					.update(touch({ stripeCustomerId: customer.id }))
					.eq('id', userId)
					.select('stripeCustomerId')
					.single(),
			)
		}

		console.log(
			`POST /api/initiate-payment - Creating PaymentIntent for user ${userId}`,
		)
		if (!user?.stripeCustomerId) {
			console.error(
				'POST /api/initiate-payment - user.stripeCustomerId Missing required fields',
			)
			return NextResponse.json(
				{ message: 'Missing required fields user.stripeCustomerId' },
				{ status: 400 },
			)
		}

		const newTotalAmount = totalAmount(bookingInitiated?.lineItems)
		console.log('newTotalAmount: ', newTotalAmount)
		const amountInCents = Math.round(newTotalAmount * 100) // 362879
		const paymentIntent = await stripe.paymentIntents.create({
			amount: isTestAccount ? 55 : amountInCents,
			currency,
			customer: user.stripeCustomerId,
			payment_method: stripePaymentMethodId,
			setup_future_usage: 'off_session',
			capture_method: 'manual',
			metadata: {
				bookingId,
				serviceId,
				customerId: userId,
			},
		})
		await updateBooking(bookingId, { paymentIntentId: paymentIntent.id })
		console.log(
			`POST /api/initiate-payment - Successfully created PaymentIntent ${paymentIntent.id}`,
		)
		return NextResponse.json({
			paymentIntentId: paymentIntent.id,
			clientSecret: paymentIntent.client_secret,
		})
	} catch (error) {
		console.error(
			'POST /api/initiate-payment - Payment initiation error:',
			error,
		)
		return NextResponse.json(
			{ message: 'Payment initiation failed' },
			{ status: 500 },
		)
	}
}
