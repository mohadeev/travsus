export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { db, T, must } from '@/lib/db'
import getUserData from '../user/getUserData'

export async function GET(request: NextRequest) {
	console.log('GET /api/get-payment-methods - Fetching payment methods')

	try {
		console.log('GET /api/get-payment-methods - Fetching user data')
		const userData: any = await getUserData()
		const userId = userData?.id

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

		const paymentMethods = must(
			await db
				.from(T.paymentMethods)
				.select(
					'id, stripePaymentMethodId, type, last4, brand, exp_month, exp_year, cardHolder, createdAt, updatedAt, billingAddressLine1, billingAddressLine2, billingCity, billingState, billingPostalCode, billingCountry',
				)
				.eq('userId', userId),
		)

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
