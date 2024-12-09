'use server'

import { revalidatePath } from 'next/cache'

export async function updateSubscriptions(
	userId: string,
	token: string,
	subscriptions: { id: string; isSubscribed: boolean }[],
) {
	// Verify the token (implement your own token verification logic)
	if (!verifyToken(userId, token)) {
		throw new Error('Invalid token')
	}

	try {
		// In a real application, you would update the subscriptions in your database
		console.log('Updating subscriptions for user:', userId)
		console.log('New subscription preferences:', subscriptions)

		// Simulate API call
		//const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/post/subscription-manager`, {
		//  method: 'POST',
		//  headers: {
		//    'Content-Type': 'application/json',
		//  },
		//  body: JSON.stringify({ email, token, subscriptionTypes }),
		//})

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/user/post/subscription-manager`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId, token, subscriptions }),
			},
		)

		if (!response.ok) {
			const errorData = await response.json()
			console.error('Error details:', errorData)
			throw new Error(
				`Failed to update subscriptions: ${response.status} ${response.statusText}`,
			)
		}

		// Revalidate the page to reflect the changes
		revalidatePath('/email/subscription')

		return { success: true }
	} catch (error) {
		console.error('Error updating subscriptions:', error)
		console.error('Error details:', error)
		throw new Error('Failed to update subscriptions')
	}
}

function verifyToken(userId: string, token: string): boolean {
	// Implement your token verification logic here
	// This is a placeholder implementation
	return token.length > 0 && userId.length > 0
}
