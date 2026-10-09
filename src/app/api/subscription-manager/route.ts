export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import getUserData from '../user/getUserData'
import { db, T, must, touch } from '@/lib/db'

/** Subscriptions are looked up by email, by unsubscribe token, or both. */
async function findSubscription(
	{ email, token }: { email?: string | null; token?: string | null },
	columns = '*',
) {
	let query = db.from(T.newsletter).select(columns)
	if (email) query = query.eq('email', email)
	if (token) query = query.contains('tokens', [{ token }])
	return must(await query.limit(1).maybeSingle()) as any
}

const VALID_TYPES = ['deals', 'tips', 'reviews', 'inspiration']

export async function GET(request: NextRequest) {
	const userData = await getUserData({})
	const email = userData?.email
	const token = request.nextUrl.searchParams.get('token')

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

	try {
		let subscription

		if (email && token) {
			// Both email and token provided, check for mismatch
			subscription = await findSubscription({ email, token }, 'id, email, types, subscribed')

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
			subscription = await findSubscription({ email }, 'types, subscribed, email')
		} else if (token) {
			// Only token provided (user is not logged in)
			subscription = await findSubscription({ token }, 'types, subscribed, email')
		}

		if (!subscription) {
			console.log('Subscription not found')
			return NextResponse.json(
				{ success: false, message: 'Subscription not found' },
				{ status: 404 },
			)
		}
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
	const userData = await getUserData({})
	const email = userData?.email
	const { token, types } = await request.json()

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

	// Validate types
	if (
		!Array.isArray(types) ||
		!types.every((type: string) => VALID_TYPES.includes(type))
	) {
		return NextResponse.json(
			{ success: false, message: 'Invalid types provided' },
			{ status: 400 },
		)
	}

	try {
		let subscription

		if (token) {
			// Token provided (user might not be logged in)
			subscription = await findSubscription({ token })
		} else if (email) {
			// Only email provided (user is logged in)
			subscription = await findSubscription({ email })
		}

		if (!subscription) {
			console.log('Subscription not found')
			return NextResponse.json(
				{ success: false, message: 'Subscription not found' },
				{ status: 404 },
			)
		}

		const removedTypes = (subscription.types ?? []).filter(
			(type: string) => !types.includes(type),
		)
		const updatedSubscription = must(
			await db
				.from(T.newsletter)
				.update(touch({ subscribed: types.length > 0, types }))
				.eq('id', subscription.id)
				.select('types')
				.single(),
		)

		if (types.length === 0) {
			return NextResponse.json({
				success: true,
				message:
					"We're sad to see you go 😢💔 You've been unsubscribed from all newsletters. We'll miss you! 👋",
				types: [],
			})
		} else {
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
