import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import prisma from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
	const { id } = await request.json()

	if (!id) {
		return NextResponse.json(
			{ error: 'Missing payment method ID' },
			{ status: 400 },
		)
	}

	try {
		// Retrieve the payment method from the database
		const paymentMethod = await prisma.paymentMethod.findUnique({
			where: { id },
			include: { user: true },
		})

		if (!paymentMethod) {
			return NextResponse.json(
				{ error: 'Payment method not found' },
				{ status: 404 },
			)
		}

		// Remove the payment method from Stripe
		await stripe.paymentMethods.detach(paymentMethod.stripePaymentMethodId)

		// Remove the payment method from the database
		await prisma.paymentMethod.delete({
			where: { id },
		})

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
