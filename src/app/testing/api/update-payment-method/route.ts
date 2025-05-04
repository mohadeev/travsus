import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import stripe from '@/lib/stripe'
import prisma from '@/lib/prisma'
import { getUserData } from '@/lib/auth'

export async function PUT(request: NextRequest) {
	console.log('PUT /api/update-payment-method - Updating payment method')

	try {
		// Get the authenticated user's data
		console.log('PUT /api/update-payment-method - Fetching user data')
		const userData = await getUserData()
		if (!userData || !userData.id) {
			console.error('PUT /api/update-payment-method - User not authenticated')
			return NextResponse.json(
				{ error: 'User not authenticated' },
				{ status: 401 },
			)
		}

		// Parse the request body
		const {
			id,
			cardHolder,
			billingAddressLine1,
			billingAddressLine2,
			billingCity,
			billingState,
			billingPostalCode,
			billingCountry,
		} = await request.json()

		if (!id) {
			console.error(
				'PUT /api/update-payment-method - Missing payment method ID',
			)
			return NextResponse.json(
				{ error: 'Missing payment method ID' },
				{ status: 400 },
			)
		}

		console.log(
			`PUT /api/update-payment-method - Fetching payment method ${id} for user ${userData.id}`,
		)
		const existingPaymentMethod = await prisma.paymentMethod.findFirst({
			where: { id, userId: userData.id },
		})

		if (!existingPaymentMethod) {
			console.error(
				`PUT /api/update-payment-method - Payment method ${id} not found for user ${userData.id}`,
			)
			return NextResponse.json(
				{ error: 'Payment method not found' },
				{ status: 404 },
			)
		}

		let stripeUpdated = false
		try {
			console.log(
				`PUT /api/update-payment-method - Updating Stripe payment method ${existingPaymentMethod.stripePaymentMethodId}`,
			)
			await stripe.paymentMethods.update(
				existingPaymentMethod.stripePaymentMethodId,
				{
					billing_details: {
						name: 'mohamed skendoul',
						address: {
							line1: billingAddressLine1,
							line2: billingAddressLine2,
							city: billingCity,
							state: billingState,
							postal_code: billingPostalCode,
							country: billingCountry,
						},
						// {
						// 	line1: billingAddressLine1,
						// 	line2: billingAddressLine2,
						// 	city: billingCity,
						// 	state: billingState,
						// 	postal_code: billingPostalCode,
						// 	country: billingCountry,
						// },
					},
				},
			)
			stripeUpdated = true
		} catch (stripeError) {
			if (stripeError instanceof Stripe.errors.StripeCardError) {
				console.warn(
					`PUT /api/update-payment-method - Stripe update failed: ${stripeError.message}`,
				)
				// We'll continue to update the local database
			} else {
				throw stripeError // Re-throw if it's not a StripeCardError
			}
		}

		console.log(
			`PUT /api/update-payment-method - Updating payment method ${id} in database`,
		)
		const updatedPaymentMethod = await prisma.paymentMethod.update({
			where: { id },
			data: {
				// id: 'paymentMethodId',
				cardHolder,
				billingAddressLine1: billingAddressLine1,
				billingAddressLine2: billingAddressLine2,
				billingCity: billingCity,
				billingState: billingState,
				billingPostalCode: billingPostalCode,
				billingCountry: billingCountry,
				updatedAt: new Date(),
			},
			//  {
			// 	cardHolder,
			// 	billingAddressLine1,
			// 	billingAddressLine2,
			// 	billingCity,
			// 	billingState,
			// 	billingPostalCode,
			// 	billingCountry,
			// 	updatedAt: new Date(),
			// },
		})

		console.log(
			`PUT /api/update-payment-method - Successfully updated payment method ${id}`,
		)
		return NextResponse.json({
			success: true,
			paymentMethod: updatedPaymentMethod,
			stripeUpdated: stripeUpdated,
			message: stripeUpdated
				? 'Payment method updated successfully'
				: 'Payment method updated in our database, but the update with the payment provider failed. The card may not support updates.',
		})
	} catch (error) {
		console.error('PUT /api/update-payment-method - Error:', error)
		return NextResponse.json(
			{ error: 'Failed to update payment method' },
			{ status: 500 },
		)
	}
}
