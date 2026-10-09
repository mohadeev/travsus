export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from 'next/server'
import { db, T, must } from '@/lib/db'
import getUserData from '../../user/getUserData'
import { auth, clerkClient } from '@clerk/nextjs/server'

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

		await deleteUserAndData(userId)

		// Remove the Clerk login too, so signing in again can't recreate it
		const { userId: clerkUserId } = await auth()
		if (clerkUserId) await (await clerkClient()).users.deleteUser(clerkUserId)

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

		return NextResponse.json(
			{
				message: 'Failed to delete account',
				error: errorMessage,
			},
			{ status: 500 },
		)
	}
}

const ids = (rows: { id: string }[] | null) => (rows ?? []).map((r) => r.id)

/**
 * Deletes a user and everything that depends on them, children first so
 * foreign keys are never violated.
 */
async function deleteUserAndData(userId: string) {
	const tourIds = ids(must(await db.from(T.tours).select('id').eq('creatorId', userId)))
	const businessIds = ids(
		must(await db.from(T.businesses).select('id').eq('creatorId', userId)),
	)
	const forumPostIds = ids(
		must(await db.from(T.forumPosts).select('id').eq('authorId', userId)),
	)
	const paymentMethodIds = ids(
		must(await db.from(T.paymentMethods).select('id').eq('userId', userId)),
	)

	// Bookings made by, provided by, or on tours of this user
	must(await db.from(T.bookings).delete().or(`customerId.eq.${userId},providerId.eq.${userId}`))
	if (tourIds.length) must(await db.from(T.bookings).delete().in('tourId', tourIds))
	if (paymentMethodIds.length) {
		must(
			await db
				.from(T.bookings)
				.update({ paymentMethodId: null })
				.in('paymentMethodId', paymentMethodIds),
		)
	}

	// Reviews written by the user or left on the user's tours
	must(await db.from(T.reviews).delete().eq('userId', userId))
	if (tourIds.length) must(await db.from(T.reviews).delete().in('tourId', tourIds))

	must(await db.from(T.payoutMethods).delete().eq('userId', userId))
	must(await db.from(T.paymentMethods).delete().eq('userId', userId))

	// Remove the user's votes from other people's comments
	const voted = must(
		await db
			.from(T.forumComments)
			.select('id, likedByIds, dislikedByIds')
			.or(`likedByIds.cs.{${userId}},dislikedByIds.cs.{${userId}}`),
	)
	for (const c of voted ?? []) {
		must(
			await db
				.from(T.forumComments)
				.update({
					likedByIds: (c.likedByIds ?? []).filter((id: string) => id !== userId),
					dislikedByIds: (c.dislikedByIds ?? []).filter(
						(id: string) => id !== userId,
					),
				})
				.eq('id', c.id),
		)
	}

	// Comments by the user or on the user's posts; detach replies to them first
	const commentIds = ids(
		must(await db.from(T.forumComments).select('id').eq('authorId', userId)),
	)
	if (forumPostIds.length) {
		commentIds.push(
			...ids(must(await db.from(T.forumComments).select('id').in('postId', forumPostIds))),
		)
	}
	if (commentIds.length) {
		must(
			await db
				.from(T.forumComments)
				.update({ parentId: null })
				.in('parentId', commentIds),
		)
		must(await db.from(T.forumComments).delete().in('id', commentIds))
	}

	must(await db.from(T.forumPosts).delete().eq('authorId', userId))
	must(await db.from(T.posts).delete().eq('authorId', userId))
	must(await db.from(T.referralLinks).delete().eq('userId', userId))
	must(await db.from(T.subscriptions).delete().eq('userId', userId))
	must(await db.from(T.users).update({ referredById: null }).eq('referredById', userId))

	if (tourIds.length) must(await db.from(T.tours).delete().in('id', tourIds))
	if (businessIds.length) {
		must(await db.from(T.tours).update({ businessId: null }).in('businessId', businessIds))
		must(await db.from(T.businesses).delete().in('id', businessIds))
	}

	must(await db.from(T.users).delete().eq('id', userId))
}
