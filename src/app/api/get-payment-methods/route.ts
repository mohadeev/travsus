export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import getUserData from '../user/getUserData'

export async function GET(request: NextRequest) {
	console.log('GET /api/get-payment-methods - Fetching payment methods')

	try {
		console.log('GET /api/get-payment-methods - Fetching user data')
		const userData: any = await getUserData()
		const userId = userData.id

		if (!userId) {
			console.error('GET /api/get-payment-methods - Missing userId')
			return NextResponse.json(
				{ message: 'User ID is required' },
				{ status: 400 },
			)
		}

		console.log(
			`GET /api/get-payment-methods - Fetching payment methods for user ${userId}`,
		)

		const paymentMethods = await prisma.paymentMethod.findMany({
			where: { userId },
			select: {
				id: true,
				stripePaymentMethodId: true,
				type: true,
				last4: true,
				brand: true,
				exp_month: true,
				exp_year: true,
				cardHolder: true,
				createdAt: true,
				updatedAt: true,
				billingAddressLine1: true,
				billingAddressLine2: true,
				billingCity: true,
				billingState: true,
				billingPostalCode: true,
				billingCountry: true,
			},
		})

		console.log(
			`GET /api/get-payment-methods - Successfully fetched ${paymentMethods.length} payment methods for user ${userId}`,
		)

		return NextResponse.json({ success: true, paymentMethods })
	} catch (error) {
		console.error('GET /api/get-payment-methods - Error:', error)
		return NextResponse.json(
			{ message: 'Failed to fetch payment methods' },
			{ status: 500 },
		)
	}
}
