export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { bookingConfirmationEmail } from '@/utils/bookingConfirmationEmail'

export async function POST(request: NextRequest) {
	const { paymentIntentId } = await request.json()
	const referer = request.headers.get('referer') || ''
	const url = new URL(referer)
	const searchParams = url.searchParams
	const serviceId = searchParams.get('serviceId')
	const bookingId = searchParams.get('bookingId')

	if (!serviceId || !bookingId || !paymentIntentId) {
		console.error('POST /api/capture-payment - Missing required fields')
		return NextResponse.json(
			{ message: 'Missing required fields' },
			{ status: 400 },
		)
	}

	try {
		const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId)

		const bookingInitiated = await prisma.booking.findFirst({
			where: { id: bookingId },
			include: {
				paymentMethod: true,
				customer: true,
				provider: true,
				tour: true,
			},
		})
		console.log(
			'bookingInitiated.paymentMethod:',
			bookingInitiated?.paymentMethod,
		)
		if (bookingInitiated && bookingInitiated.paymentMethod) {
			await updateDefaultPaymentMethod(
				bookingInitiated.customer.id,
				bookingInitiated.paymentMethod.id,
			)
		}

		await bookingConfirmationEmail(bookingInitiated)
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

async function updateDefaultPaymentMethod(
	userId: string,
	paymentMethodId: string,
) {
	try {
		await prisma.$transaction([
			prisma.paymentMethod.updateMany({
				where: { userId, isDefault: true },
				data: { isDefault: false },
			}),
			prisma.paymentMethod.update({
				where: { id: paymentMethodId },
				data: { isDefault: true },
			}),
		])
	} catch (error) {
		console.error('Error updating default payment method:', error)
		// Rethrow the error to be caught by the main try-catch block
		throw error
	}
}
