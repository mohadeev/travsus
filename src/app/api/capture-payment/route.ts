export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import { db, T, REL, must, touch } from '@/lib/db'
import { safeBooking } from '@/lib/users'
import getUserData from '../user/getUserData'
import { bookingConfirmationEmail } from '@/utils/bookingConfirmationEmail'

export async function POST(request: NextRequest) {
	const { paymentIntentId } = await request.json()
	const referer = request.headers.get('referer') || ''
	const url = new URL(referer)
	const serviceId = url.searchParams.get('serviceId')
	const bookingId = url.searchParams.get('bookingId')

	if (!serviceId || !bookingId || !paymentIntentId) {
		console.error('POST /api/capture-payment - Missing required fields')
		return NextResponse.json(
			{ message: 'Missing required fields' },
			{ status: 400 },
		)
	}

	const userData: any = await getUserData()
	if (!userData?.id) {
		return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
	}

	try {
		const booking: any = must(
			await db.from(T.bookings).select(REL.bookingFull).eq('id', bookingId).maybeSingle(),
		)

		// Only the customer can capture, and only this booking's payment
		if (
			!booking ||
			booking.customerId !== userData.id ||
			booking.paymentIntentId !== paymentIntentId
		) {
			return NextResponse.json({ message: 'Booking not found' }, { status: 404 })
		}

		const paymentIntent = await stripe.paymentIntents.capture(paymentIntentId)

		if (booking.paymentMethod) {
			await updateDefaultPaymentMethod(booking.customerId, booking.paymentMethod.id)
		}

		await bookingConfirmationEmail(safeBooking(booking))
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

async function updateDefaultPaymentMethod(userId: string, paymentMethodId: string) {
	must(
		await db
			.from(T.paymentMethods)
			.update(touch({ isDefault: false }))
			.match({ userId, isDefault: true }),
	)
	must(
		await db
			.from(T.paymentMethods)
			.update(touch({ isDefault: true }))
			.eq('id', paymentMethodId),
	)
}
