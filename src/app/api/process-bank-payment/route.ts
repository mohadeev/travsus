import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import prisma from '@/prisma'

export async function POST(request: NextRequest) {
	const { userId, userEmail, amount } = await request.json()

	if (!userId || !userEmail || !amount) {
		return NextResponse.json(
			{ message: 'Missing required fields' },
			{ status: 400 },
		)
	}

	try {
		let user = await prisma.user.findUnique({
			where: { id: userId },
			select: { stripeCustomerId: true },
		})

		if (!user?.stripeCustomerId) {
			const customer = await stripe.customers.create({
				email: userEmail,
				metadata: { userId },
			})
			user = await prisma.user.update({
				where: { id: userId },
				data: { stripeCustomerId: customer.id },
			})
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['us_bank_account'],
			mode: 'payment',
			customer: user.stripeCustomerId,
			line_items: [
				{
					price_data: {
						currency: 'usd',
						product_data: {
							name: 'Bank Account Payment',
						},
						unit_amount: amount,
					},
					quantity: 1,
				},
			],
			success_url: 'https://your-website.com/payment-success',
			cancel_url: 'https://your-website.com/payment-cancelled',
		})

		return NextResponse.json({ sessionId: session.id })
	} catch (error) {
		console.error('Bank account payment processing error:', error)
		return NextResponse.json(
			{ message: 'Bank account payment processing failed' },
			{ status: 500 },
		)
	}
}
