export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import { db, T, must } from '@/lib/db'
import getUserData from '../user/getUserData'

export async function DELETE(request: NextRequest) {
	const userData: any = await getUserData()
	if (!userData?.id) {
		return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
	}

	const { id } = await request.json()

	if (!id) {
		return NextResponse.json(
			{ error: 'Missing payment method ID' },
			{ status: 400 },
		)
	}

	try {
		// Only the owner can remove their payment method
		const paymentMethod = must(
			await db
				.from(T.paymentMethods)
				.select('id, stripePaymentMethodId')
				.eq('id', id)
				.eq('userId', userData.id)
				.maybeSingle(),
		)

		if (!paymentMethod) {
			return NextResponse.json(
				{ error: 'Payment method not found' },
				{ status: 404 },
			)
		}

		await stripe.paymentMethods.detach(paymentMethod.stripePaymentMethodId)

		// Past bookings keep their history but no longer point at the card
		must(await db.from(T.bookings).update({ paymentMethodId: null }).eq('paymentMethodId', id))
		must(await db.from(T.paymentMethods).delete().eq('id', id))

		return NextResponse.json({
			success: true,
			message: 'Payment method removed successfully',
		})
	} catch (error) {
		console.error('Error removing payment method:', error)
		return NextResponse.json(
			{ error: 'Failed to remove payment method' },
			{ status: 500 },
		)
	}
}
