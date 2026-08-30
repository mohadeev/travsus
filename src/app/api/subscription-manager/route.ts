export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import getUserData from '../user/getUserData'
// import getUserData from '../../lib/getUserData'

let prisma: PrismaClient = new PrismaClient()

// try {
// 	prisma = new PrismaClient()
// } catch (error) {
// 	console.error('Failed to initialize Prisma client:', error)
// 	prisma = null
// }

const VALID_TYPES = ['deals', 'tips', 'reviews', 'inspiration']

export async function GET(request: NextRequest) {
	console.log('GET request received')
	const userData = await getUserData({})
	const email = userData?.email
	const token = request.nextUrl.searchParams.get('token')
	console.log('Token:', token)
	console.log('User email:', email)

	if (!email && !token) {
		console.log('Invalid request: No email or token provided')
		return NextResponse.json(
			{
				success: false,
				message: 'Invalid request: No email or token provided',
			},
			{ status: 400 },
		)
	}

	if (!prisma) {
		console.error('Prisma client is not initialized')
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 },
		)
	}

	try {
		let subscription

		if (email && token) {
			// Both email and token provided, check for mismatch
			subscription = await prisma.newsletterSubscription.findFirst({
				where: {
					email: email,
					tokens: {
						some: {
							token: token,
						},
					},
				},
				select: {
					id: true,
					email: true,
					types: true,
					subscribed: true,
				},
			})

			if (!subscription) {
				console.log('Email mismatch or invalid token')
				return NextResponse.json(
					{
						success: false,
						message:
							'Email mismatch: The provided token does not match your account.',
						emailMismatch: true,
					},
					{ status: 400 },
				)
			}
		} else if (email) {
			// Only email provided
			subscription = await prisma.newsletterSubscription.findUnique({
				where: { email },
				select: {
					types: true,
					subscribed: true,
					email: true,
				},
			})
		} else if (token) {
			// Only token provided (user is not logged in)
			subscription = await prisma.newsletterSubscription.findFirst({
				where: {
					tokens: {
						some: {
							token: token,
						},
					},
				},
				select: {
					types: true,
					subscribed: true,
					email: true,
				},
			})
		}

		console.log('Fetched subscription:', subscription)

		if (!subscription) {
			console.log('Subscription not found')
			return NextResponse.json(
				{ success: false, message: 'Subscription not found' },
				{ status: 404 },
			)
		}

		console.log('Returning subscription data')
		return NextResponse.json({
			success: true,
			types: subscription.types,
			subscribed: subscription.subscribed,
			email: subscription.email,
		})
	} catch (error) {
		console.error('Error in GET request:', error)
		return NextResponse.json(
			{
				success: false,
				message: 'An error occurred while fetching your subscription data',
			},
			{ status: 500 },
		)
	}
}

export async function POST(request: Request) {
	console.log('POST request received')
	const userData = await getUserData({})
	const email = userData?.email
	const { token, types } = await request.json()
	console.log('Received token:', token)
	console.log('Received types to keep:', types)
	console.log('User email:', email)

	if (!email && !token) {
		console.log('Invalid request: No email or token provided')
		return NextResponse.json(
			{
				success: false,
				message: 'Invalid request: No email or token provided',
			},
			{ status: 400 },
		)
	}

	if (!prisma) {
		console.error('Prisma client is not initialized')
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 },
		)
	}

	// Validate types
	if (
		!Array.isArray(types) ||
		!types.every((type) => VALID_TYPES.includes(type))
	) {
		return NextResponse.json(
			{ success: false, message: 'Invalid types provided' },
			{ status: 400 },
		)
	}

	try {
		console.log('Fetching subscription data')
		let subscription

		if (token) {
			// Token provided (user might not be logged in)
			subscription = await prisma.newsletterSubscription.findFirst({
				where: {
					tokens: {
						some: {
							token: token,
						},
					},
				},
			})
		} else if (email) {
			// Only email provided (user is logged in)
			subscription = await prisma.newsletterSubscription.findUnique({
				where: { email },
			})
		}

		console.log('Fetched subscription:', subscription)

		if (!subscription) {
			console.log('Subscription not found')
			return NextResponse.json(
				{ success: false, message: 'Subscription not found' },
				{ status: 404 },
			)
		}

		const removedTypes = subscription.types.filter(
			(type) => !types.includes(type),
		)
		console.log('Types removed:', removedTypes)

		console.log('Updating subscription')
		const updatedSubscription = await prisma.newsletterSubscription.update({
			where: { id: subscription.id },
			data: {
				subscribed: types.length > 0,
				types: types,
			},
		})
		console.log('Updated subscription:', updatedSubscription)

		if (types.length === 0) {
			console.log('User unsubscribed from all newsletters')
			return NextResponse.json({
				success: true,
				message:
					"We're sad to see you go 😢💔 You've been unsubscribed from all newsletters. We'll miss you! 👋",
				types: [],
			})
		} else {
			console.log('User updated newsletter preferences')
			return NextResponse.json({
				success: true,
				message:
					removedTypes.length > 0
						? `Your newsletter preferences have been updated. You've unsubscribed from: ${removedTypes.join(', ')}. 🔄`
						: 'Your newsletter preferences have been updated successfully. 🎉',
				types: updatedSubscription.types,
			})
		}
	} catch (error) {
		console.error('Error in POST request:', error)
		return NextResponse.json(
			{
				success: false,
				message: 'An error occurred while processing your request',
			},
			{ status: 500 },
		)
	}
}
