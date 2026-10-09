export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import { db, T, must, touch } from '@/lib/db'
import getUserData from '../user/getUserData'
import totalAmount from '../api-utils/actions/booking/totalAmount'
import { updateBooking } from '../api-utils/actions/booking/updateBooking'
import { checkBookingRole } from '../api-utils/actions/booking/checkBookingRole'

export async function POST(request: NextRequest) {
	console.log('POST /api/process-payment - Processing payment')
	const body = await request.json()
	const { paymentMethodId, amount, currency } = body
	const referer = request.headers.get('referer') || ''
	const url = new URL(referer)
	const searchParams = url.searchParams
	const serviceId = searchParams.get('serviceId')
	const bookingId = searchParams.get('bookingId')
	const bookingRole: any = await checkBookingRole(request)
	if (!bookingRole.allowed) {
		return NextResponse.json(
			{ error: bookingRole.error },
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

	const userData: any = await getUserData({})
	const { email: userEmail, id: userId } = userData ?? {}
	if (!userId || !userEmail || !currency) {
		console.error('POST /api/process-payment - Missing required fields')
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
				.select('id, lineItems')
				.match({ id: bookingId, customerId: id, tourId: serviceId })
				.maybeSingle(),
		)
		if (!bookingInitiated) {
			return NextResponse.json({ message: 'Booking not found' }, { status: 404 })
		}

		let user = must(
			await db.from(T.users).select('stripeCustomerId').eq('id', userId).maybeSingle(),
		)

		if (!user?.stripeCustomerId) {
			console.log(
				`POST /api/process-payment - Creating new Stripe customer for user ${userId}`,
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
		if (!user?.stripeCustomerId) {
			return NextResponse.json(
				{ message: 'Missing Stripe customer' },
				{ status: 400 },
			)
		}

		// Fetch the user's payment methods
		const userPaymentMethods = must(
			await db
				.from(T.paymentMethods)
				.select('id, stripePaymentMethodId, isDefault')
				.eq('userId', userId)
				.order('isDefault', { ascending: false, nullsFirst: false }),
		)

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
		// Internal test accounts are charged a symbolic amount (exact matches only)
		const email = (userEmail || '').toLowerCase()
		const isTestAccount =
			email === 'skendoulmohamed@gmail.com' || email.endsWith('@travsus.com')
		const paymentIntent = await stripe.paymentIntents.create({
			amount: isTestAccount ? 55 : amountInCents,
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

		const paymentMethod = userPaymentMethods.find(
			(m) => m.stripePaymentMethodId === selectedPaymentMethodId,
		)
		await updateBooking(bookingId, {
			paymentIntentId: paymentIntent.id,
			paymentMethodId: paymentMethod?.id ?? null,
		})
		console.log(
			`POST /api/process-payment - Successfully created PaymentIntent ${paymentIntent.id}`,
		)
		return NextResponse.json({
			success: true,
			paymentIntentId: paymentIntent.id,
			requiresCapture: paymentIntent.status === 'requires_capture',
		})
	} catch (error: any) {
		console.error(
			'POST /api/process-payment - Payment processing error:',
			error,
		)
		if (error.type === 'StripeCardError') {
			return NextResponse.json(
				{
					message: 'Payment processing failed',
					stripeCardError: error.raw.code,
				},
				{ status: 500 },
			)
		}
		return NextResponse.json(
			{ message: 'Payment processing failed' },
			{ status: 500 },
		)
	}
}
