import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import prisma from '@/lib/prisma'
import getUserData from '../user/getUserData'

export async function GET(request: NextRequest) {
	console.log('GET /api/payment-methods - Fetching payment methods')
	const userData = await getUserData({})
	if (!userData) {
		return 0
	}
	const { email: userEmail, id: userId } = userData
	if (!userId) {
		console.error('GET /api/payment-methods - Missing userId')
		return NextResponse.json(
			{ message: 'User ID is required' },
			{ status: 400 },
		)
	}

	try {
		const paymentMethods = await prisma.paymentMethod.findMany({
			where: { userId },
			select: {
				id: true,
				stripePaymentMethodId: true,
				last4: true,
				brand: true,
				isDefault: true,
			},
		})

		console.log(
			`GET /api/payment-methods - Successfully fetched ${paymentMethods.length} payment methods for user ${userId}`,
		)
		return NextResponse.json({ paymentMethods })
	} catch (error) {
		console.error(
			'GET /api/payment-methods - Error fetching payment methods:',
			error,
		)
		return NextResponse.json(
			{ message: 'Failed to fetch payment methods' },
			{ status: 500 },
		)
	}
}

export async function POST(request: NextRequest) {
	console.log('POST /api/payment-methods - Saving new payment method')
	const { paymentMethodId } = await request.json()
	const userData = await getUserData({})
	if (!userData) {
		return 0
	}
	const { email: userEmail, id: userId } = userData
	if (!userId || !paymentMethodId || !userEmail) {
		console.error('POST /api/payment-methods - Missing required fields')
		return NextResponse.json(
			{ message: 'User ID, email, and payment method ID are required' },
			{ status: 400 },
		)
	}

	try {
		let user = await prisma.user.findUnique({
			where: { id: userId },
			select: { id: true, stripeCustomerId: true },
		})

		let stripeCustomerId = user?.stripeCustomerId
		if (!stripeCustomerId) {
			console.log(
				`POST /api/payment-methods - Creating new Stripe customer for user ${userId}`,
			)
			const customer = await stripe.customers.create({
				email: userEmail,
				metadata: { userId: userId },
			})

			stripeCustomerId = customer.id

			await prisma.user.update({
				where: { id: userId },
				data: { stripeCustomerId: stripeCustomerId },
			})
		}

		console.log(
			`POST /api/payment-methods - Attaching payment method ${paymentMethodId} to customer ${stripeCustomerId}`,
		)
		await stripe.paymentMethods.attach(paymentMethodId, {
			customer: stripeCustomerId,
		})

		const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

		if (paymentMethod.type !== 'card' || !paymentMethod.card) {
			console.error(
				`POST /api/payment-methods - Invalid payment method type: ${paymentMethod.type}`,
			)
			return NextResponse.json(
				{ message: 'Invalid payment method type' },
				{ status: 400 },
			)
		}

		const { last4, brand, exp_month, exp_year } = paymentMethod.card

		const existingPaymentMethod = await prisma.paymentMethod.findFirst({
			where: {
				userId,
				last4,
				brand,
				exp_month,
				exp_year,
			},
		})

		if (existingPaymentMethod) {
			console.log(
				`POST /api/payment-methods - Payment method already exists for user ${userId}`,
			)
			return NextResponse.json({
				success: true,
				message: 'Payment method already exists',
			})
		}

		await prisma.paymentMethod.create({
			data: {
				stripePaymentMethodId: paymentMethodId,
				last4,
				brand,
				exp_month,
				exp_year,
				userId,
			},
		})

		console.log(
			`POST /api/payment-methods - Successfully saved new payment method for user ${userId}`,
		)
		return NextResponse.json({
			success: true,
			message: 'Payment method saved and attached successfully',
		})
	} catch (error) {
		console.error(
			'POST /api/payment-methods - Error saving payment method:',
			error,
		)
		return NextResponse.json(
			{ message: 'Failed to save payment method' },
			{ status: 500 },
		)
	}
}
