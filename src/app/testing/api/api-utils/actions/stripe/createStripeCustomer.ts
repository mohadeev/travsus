import { NextRequest, NextResponse } from 'next/server'
import stripe from '@/lib/stripe'
import prisma from '@/lib/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function createStripeCustomer() {
	console.log('POST /api/create-stripe-customer - Creating Stripe customer')
	try {
		const userData: any = await getUserData({})
		const { email: userEmail, id: userId } = userData

		if (!userId || !userEmail) {
			console.error('POST /api/create-stripe-customer - Missing user details')
		}

		// Check if the user already has a Stripe customer ID
		let user = await prisma.user.findUnique({
			where: { id: userId },
			select: { stripeCustomerId: true },
		})

		if (!user?.stripeCustomerId) {
			const customer = await stripe.customers.create({
				email: userEmail,
				metadata: { userId },
			})

			// Update user in the database with the Stripe customer ID
			user = await prisma.user.update({
				where: { id: userId },
				data: { stripeCustomerId: customer.id },
			})

			console.log(
				`POST /api/create-stripe-customer - Successfully created Stripe customer ${customer.id} for user ${userId}`,
			)
		} else {
			console.log(
				`POST /api/create-stripe-customer - Stripe customer already exists for user ${userId}: ${user.stripeCustomerId}`,
			)
		}

		// Return success response with customer details
		return {
			success: true,
			stripeCustomerId: user.stripeCustomerId,
		}
	} catch (error) {
		console.error(
			'POST /api/create-stripe-customer - Error creating Stripe customer:',
			error,
		)
		return { message: 'Failed to create Stripe customer', status: 500 }
	}
}
