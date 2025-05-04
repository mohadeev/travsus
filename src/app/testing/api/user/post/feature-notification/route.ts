import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { email, featureName } = body

		// Validate email
		if (!email) {
			return NextResponse.json({ code: 'EMAIL_REQUIRED' }, { status: 400 })
		}

		if (email.length > 60) {
			return NextResponse.json({ code: 'INVALID_EMAIL' }, { status: 400 })
		}

		// Check if already subscribed to this feature
		const existingSubscription = await prisma.newsletterSubscription.findUnique(
			{
				where: { email },
			},
		)

		const featureType = featureName.toLowerCase().replace(/\s+/g, '-')

		if (existingSubscription) {
			// If already subscribed to this specific feature
			if (existingSubscription.types.includes(featureType)) {
				return NextResponse.json(
					{
						code: 'ALREADY_SUBSCRIBED',
						message:
							"You're already subscribed to receive updates about this feature.",
					},
					{ status: 200 },
				)
			}

			// Update existing subscription with the new feature type
			const updatedTypes = [...existingSubscription.types, featureType]

			await prisma.newsletterSubscription.update({
				where: { email },
				data: {
					types: updatedTypes,
					subscribed: true,
				},
			})
		} else {
			// Create new subscription specifically for this feature
			await prisma.newsletterSubscription.create({
				data: {
					email,
					types: [featureType],
					subscribed: true,
					tokens: {
						token: Math.random().toString(36).substring(2, 15),
						expired: false,
					},
				},
			})
		}

		// Return success
		return NextResponse.json(
			{
				code: 'SUBSCRIPTION_SUCCESS',
				message:
					"Thanks! We'll notify you as soon as this feature becomes available.",
			},
			{ status: 200 },
		)
	} catch (error) {
		console.error('Feature notification subscription error:', error)
		return NextResponse.json(
			{
				code: 'SERVER_ERROR',
				message: 'Something went wrong on our end. Please try again later.',
			},
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
