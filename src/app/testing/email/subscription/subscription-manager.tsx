import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
	console.log('GET request received')
	const token = request.nextUrl.searchParams.get('token')
	console.log('Token:', token)

	if (!token) {
		console.log('Invalid request: No token provided')
		return NextResponse.json(
			{ success: false, message: 'Invalid request' },
			{ status: 400 },
		)
	}

	try {
		console.log('Fetching subscription data')
		const subscription = await prisma.newsletterSubscription.findFirst({
			where: {
				tokens: {
					some: {
						token: token,
						expired: false,
					},
				},
			},
			select: {
				types: true,
				subscribed: true,
			},
		})
		console.log('Fetched subscription:', subscription)

		if (!subscription) {
			console.log('Invalid or expired token')
			return NextResponse.json(
				{ success: false, message: 'Invalid or expired token' },
				{ status: 400 },
			)
		}

		console.log('Returning subscription data')
		return NextResponse.json({
			success: true,
			types: subscription.types,
			subscribed: subscription.subscribed,
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
	const { token, types } = await request.json()
	console.log('Received token:', token)
	console.log('Received types:', types)

	if (!token) {
		console.log('Invalid request: No token provided')
		return NextResponse.json(
			{ success: false, message: 'Invalid request' },
			{ status: 400 },
		)
	}

	try {
		console.log('Fetching subscription data')
		const subscription = await prisma.newsletterSubscription.findFirst({
			where: {
				tokens: {
					some: {
						token: token,
						expired: false,
					},
				},
			},
		})
		console.log('Fetched subscription:', subscription)

		if (!subscription) {
			console.log('Invalid or expired token')
			return NextResponse.json(
				{ success: false, message: 'Invalid or expired token' },
				{ status: 400 },
			)
		}

		console.log('Updating subscription')
		const updatedSubscription = await prisma.newsletterSubscription.update({
			where: { id: subscription.id },
			data: {
				subscribed: types.length > 0,
				types: types,
				tokens: {
					updateMany: {
						where: { token: token },
						data: { expired: true },
					},
				},
			},
		})
		console.log('Updated subscription:', updatedSubscription)

		if (types.length === 0) {
			console.log('User unsubscribed from all newsletters')
			return NextResponse.json({
				success: true,
				message:
					"We're sorry to see you go. You've been unsubscribed from all newsletters.",
			})
		} else {
			console.log('User updated newsletter preferences')
			return NextResponse.json({
				success: true,
				message: 'Your newsletter preferences have been updated successfully.',
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
