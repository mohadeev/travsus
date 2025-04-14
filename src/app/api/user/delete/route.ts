import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import getUserData from '../../user/getUserData'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
	console.log('POST /api/user/delete - Permanently deleting account')

	try {
		const userData = await getUserData({})
		if (!userData) {
			return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
		}

		const { id: userId } = userData
		if (!userId) {
			console.error('POST /api/user/delete - Missing userId')
			return NextResponse.json(
				{ message: 'User ID is required' },
				{ status: 400 },
			)
		}

		// Get the reason from the request body
		const { reason } = await request.json()

		// In a real application, you would want to:
		// 1. Log the deletion reason for analytics
		// 2. Backup or archive user data if required by regulations

		// We need to delete related data in the correct order to maintain referential integrity

		// First, delete all bookings where the user is the customer
		await prisma.booking.deleteMany({
			where: { customerId: userId },
		})

		// Delete all bookings where the user is the provider
		await prisma.booking.deleteMany({
			where: { providerId: userId },
		})

		// Delete payout methods
		await prisma.payoutMethod.deleteMany({
			where: { userId },
		})

		// Delete payment methods
		await prisma.paymentMethod.deleteMany({
			where: { userId },
		})

		// Delete forum comments
		// First, update the likedBy and dislikedBy relations
		await prisma.forumComment.updateMany({
			where: {
				OR: [
					{ likedByIds: { has: userId } },
					{ dislikedByIds: { has: userId } },
				],
			},
			data: {
				likedByIds: { set: [] },
				dislikedByIds: { set: [] },
			},
		})

		// Then delete the user's comments
		await prisma.forumComment.deleteMany({
			where: { authorId: userId },
		})

		// Delete forum posts
		await prisma.forumPost.deleteMany({
			where: { authorId: userId },
		})

		// Delete blog posts
		await prisma.post.deleteMany({
			where: { authorId: userId },
		})

		// Delete referral links
		await prisma.referralLink.deleteMany({
			where: { userId },
		})

		// Update users who were referred by this user
		await prisma.user.updateMany({
			where: { referredById: userId },
			data: { referredById: null },
		})

		// Delete tours created by the user
		await prisma.tour.deleteMany({
			where: { creatorId: userId },
		})

		// Delete subscriptions
		await prisma.subscription.deleteMany({
			where: { userId },
		})

		// Delete businesses
		await prisma.business.deleteMany({
			where: { creatorId: userId },
		})

		// Finally, delete the user
		await prisma.user.delete({
			where: { id: userId },
		})

		// Get the session to invalidate it on the server side
		const session = await getServerSession(authOptions)

		console.log(
			`POST /api/user/delete - Successfully deleted account for user ${userId}`,
		)
		return NextResponse.json({
			success: true,
			message: 'Account successfully deleted',
		})
	} catch (error) {
		console.error('POST /api/user/delete - Error deleting account:', error)

		// For debugging purposes, include more details about the error in the response
		const errorMessage =
			error instanceof Error ? error.message : 'Unknown error'
		const errorDetails =
			error instanceof Error && 'meta' in error ? (error as any).meta : {}

		return NextResponse.json(
			{
				message: 'Failed to delete account',
				error: errorMessage,
				details: errorDetails,
			},
			{ status: 500 },
		)
	}
}
