import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { bookingConfirmationEmail } from '@/utils/bookingConfirmationEmail'

export async function POST(request: NextRequest) {
	console.log('POST /api/capture-payment - Capturing payment')
	const { paymentIntentId } = await request.json()
	const referer = request.headers.get('referer') || ''
	const url = new URL(referer)
	const searchParams = url.searchParams
	const serviceId = searchParams.get('serviceId')
	const bookingId = searchParams.get('bookingId')
	if (!serviceId || !bookingId) {
		console.error('POST /api/capture-payment - Missing required fields')
		return NextResponse.json(
			{ message: 'Missing required fields' },
			{ status: 400 },
		)
	}
	if (!paymentIntentId) {
		console.error('POST /api/capture-payment - Missing payment intent ID')
		return NextResponse.json(
			{ message: 'Missing payment intent ID' },
			{ status: 400 },
		)
	}

	try {
		console.log(
			`POST /api/capture-payment - Capturing PaymentIntent ${paymentIntentId}`,
		)
		const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId)

		console.log(
			`POST /api/capture-payment - Successfully captured PaymentIntent ${paymentIntentId}`,
		)
		const bookingInitiated = await prisma.booking.findFirst({
			where: {
				id: bookingId,
			},
			include: {
				customer: true,
				provider: {
					include: { businesses: true },
				},
				tour: true,
				paymentMethod: true,
			},
		})
		bookingConfirmationEmail(bookingInitiated)
		return NextResponse.json({
			success: true,
			paymentIntentId: paymentIntent.id,
			status: paymentIntent.status,
		})
	} catch (error) {
		console.error('POST /api/capture-payment - Payment capture error:', error)
		return NextResponse.json(
			{ message: 'Payment capture failed' },
			{ status: 500 },
		)
	}
}
