export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import prisma from '@/lib/prisma'
import getUserData from '../user/getUserData'

export async function GET(request: NextRequest) {
	//async function removeAllPaymentMethods() {
	//   try {
	//     const deleted = await prisma.paymentMethod.deleteMany({});
	//     console.log(`Deleted ${deleted.count} payment methods.`);
	//   } catch (error) {
	//     console.error('Error deleting payment methods:', error);
	//   } finally {
	//     await prisma.$disconnect();
	//   }
	// }

	// removeAllPaymentMethods();

	console.log('GET /api/payment-methods - Fetching payment methods')
	const userData = await getUserData({})
	if (!userData) {
		return NextResponse.json(
			{ message: 'User not authenticated' },
			{ status: 401 },
		)
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
				exp_month: true,
				exp_year: true,
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
		return NextResponse.json(
			{ message: 'User not authenticated' },
			{ status: 401 },
		)
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
		// Step 1: Get user data
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { id: true, stripeCustomerId: true },
		})

		let stripeCustomerId = user?.stripeCustomerId

		// Step 2: Verify Stripe customer exists and is valid
		if (stripeCustomerId) {
			try {
				console.log(
					`POST /api/payment-methods - Verifying Stripe customer ${stripeCustomerId}`,
				)
				await stripe.customers.retrieve(stripeCustomerId)
				console.log(
					`POST /api/payment-methods - Stripe customer ${stripeCustomerId} verified`,
				)
			} catch (customerError) {
				console.error(
					`POST /api/payment-methods - Stripe customer ${stripeCustomerId} not found, will create new one:`,
					customerError,
				)

				// Clear invalid customer ID from database
				await prisma.user.update({
					where: { id: userId },
					data: { stripeCustomerId: null },
				})

				stripeCustomerId = null
			}
		}

		// Step 3: Create new Stripe customer if needed
		if (!stripeCustomerId) {
			console.log(
				`POST /api/payment-methods - Creating new Stripe customer for user ${userId}`,
			)
			try {
				const customer = await stripe.customers.create({
					email: userEmail,
					metadata: { userId: userId },
				})

				stripeCustomerId = customer.id

				await prisma.user.update({
					where: { id: userId },
					data: { stripeCustomerId: stripeCustomerId },
				})
				console.log(
					`POST /api/payment-methods - Created new Stripe customer ${stripeCustomerId}`,
				)
			} catch (customerError) {
				console.error(
					'POST /api/payment-methods - Error creating Stripe customer:',
					customerError,
				)
				return NextResponse.json(
					{ message: 'Failed to create customer account' },
					{ status: 500 },
				)
			}
		}

		// Step 4: Safely retrieve and validate payment method
		let paymentMethod
		try {
			paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
			console.log(
				`POST /api/payment-methods - Retrieved payment method ${paymentMethodId}`,
			)
		} catch (retrieveError) {
			console.error(
				'POST /api/payment-methods - Error retrieving payment method:',
				retrieveError,
			)
			return NextResponse.json(
				{ message: 'Invalid payment method ID' },
				{ status: 400 },
			)
		}

		// Step 5: Validate payment method type
		if (paymentMethod.type !== 'card' || !paymentMethod.card) {
			console.error(
				`POST /api/payment-methods - Invalid payment method type: ${paymentMethod.type}`,
			)
			return NextResponse.json(
				{ message: 'Invalid payment method type' },
				{ status: 400 },
			)
		}

		// Step 6: Handle payment method attachment with comprehensive error handling
		try {
			if (!paymentMethod.customer) {
				// Payment method not attached to any customer
				console.log(
					`POST /api/payment-methods - Attaching unattached payment method ${paymentMethodId} to customer ${stripeCustomerId}`,
				)
				await stripe.paymentMethods.attach(paymentMethodId, {
					customer: stripeCustomerId,
				})
				console.log(
					`POST /api/payment-methods - Successfully attached payment method to customer`,
				)
			} else if (paymentMethod.customer !== stripeCustomerId) {
				// Payment method attached to different customer
				console.log(
					`POST /api/payment-methods - Payment method attached to different customer (${paymentMethod.customer}), transferring to ${stripeCustomerId}`,
				)

				// Detach from old customer
				try {
					await stripe.paymentMethods.detach(paymentMethodId)
					console.log(
						`POST /api/payment-methods - Successfully detached payment method from old customer`,
					)
				} catch (detachError) {
					console.error(
						'POST /api/payment-methods - Error detaching payment method (continuing anyway):',
						detachError,
					)
				}

				// Attach to new customer
				await stripe.paymentMethods.attach(paymentMethodId, {
					customer: stripeCustomerId,
				})
				console.log(
					`POST /api/payment-methods - Successfully attached payment method to new customer`,
				)
			} else {
				// Payment method already attached to correct customer
				console.log(
					`POST /api/payment-methods - Payment method already correctly attached to customer ${stripeCustomerId}`,
				)
			}
		} catch (attachError) {
			console.error(
				'POST /api/payment-methods - Error during payment method attachment:',
				attachError,
			)

			// If attachment failed, try creating a completely new customer as last resort
			try {
				console.log(
					'POST /api/payment-methods - Attempting recovery with new customer...',
				)

				// Create a brand new customer
				const newCustomer = await stripe.customers.create({
					email: userEmail,
					metadata: { userId: userId, recovery: 'true' },
				})

				// Update database with new customer ID
				await prisma.user.update({
					where: { id: userId },
					data: { stripeCustomerId: newCustomer.id },
				})

				// Try attaching to new customer
				await stripe.paymentMethods.attach(paymentMethodId, {
					customer: newCustomer.id,
				})

				stripeCustomerId = newCustomer.id
				console.log(
					`POST /api/payment-methods - Recovery successful with new customer ${newCustomer.id}`,
				)
			} catch (recoveryError) {
				console.error(
					'POST /api/payment-methods - Recovery attempt failed:',
					recoveryError,
				)
				return NextResponse.json(
					{ message: 'Failed to attach payment method. Please try again.' },
					{ status: 500 },
				)
			}
		}

		// Step 7: Get final payment method details after successful attachment
		try {
			paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
			console.log(
				`POST /api/payment-methods - Final payment method retrieval successful`,
			)
		} catch (finalRetrieveError) {
			console.error(
				'POST /api/payment-methods - Error retrieving final payment method:',
				finalRetrieveError,
			)
			return NextResponse.json(
				{ message: 'Payment method processing error' },
				{ status: 500 },
			)
		}

		const { last4, brand, exp_month, exp_year } = paymentMethod.card

		// Step 8: Check for existing payment method in database
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
				`POST /api/payment-methods - Payment method already exists in database for user ${userId}`,
			)
			return NextResponse.json({
				success: true,
				message: 'Payment method already exists',
				paymentMethod: {
					id: existingPaymentMethod.id,
					stripePaymentMethodId: existingPaymentMethod.stripePaymentMethodId,
					last4: existingPaymentMethod.last4,
					brand: existingPaymentMethod.brand,
					isDefault: existingPaymentMethod.isDefault,
				},
			})
		}

		// Step 9: Save payment method to database
		const savedPaymentMethod = await prisma.paymentMethod.create({
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
			paymentMethod: {
				id: savedPaymentMethod.id,
				stripePaymentMethodId: savedPaymentMethod.stripePaymentMethodId,
				last4: savedPaymentMethod.last4,
				brand: savedPaymentMethod.brand,
				isDefault: savedPaymentMethod.isDefault,
			},
		})
	} catch (error) {
		console.error('POST /api/payment-methods - Unexpected error:', error)
		return NextResponse.json(
			{ message: 'Failed to save payment method' },
			{ status: 500 },
		)
	}
}
