'use server'

import { PrismaClient } from '@prisma/client'
import getUserData from '@/app/api/user/getUserData'

const prisma = new PrismaClient()

export async function updateCommentVotes(
	commentId: string,
	action: 'like' | 'dislike' | 'unlike' | 'undislike',
) {
	try {
		const { id: userId }: any = await getUserData()
		if (!userId) {
			throw new Error('User not authenticated')
		}

		const comment = await prisma.forumComment.findUnique({
			where: { id: commentId },
			include: { likedBy: true, dislikedBy: true },
		})

		if (!comment) {
			throw new Error('Comment not found')
		}

		let updateData: any = {}

		switch (action) {
			case 'like':
				updateData = {
					likedBy: { connect: { id: userId } },
					dislikedBy: { disconnect: { id: userId } },
				}
				break
			case 'dislike':
				updateData = {
					dislikedBy: { connect: { id: userId } },
					likedBy: { disconnect: { id: userId } },
				}
				break
			case 'unlike':
				updateData = { likedBy: { disconnect: { id: userId } } }
				break
			case 'undislike':
				updateData = { dislikedBy: { disconnect: { id: userId } } }
				break
		}

		const updatedComment = await prisma.forumComment.update({
			where: { id: commentId },
			data: updateData,
			include: { likedBy: true, dislikedBy: true },
		})

		return {
			success: true,
			likes: updatedComment.likedBy.length,
			dislikes: updatedComment.dislikedBy.length,
		}
	} catch (error) {
		console.error('Error updating comment votes:', error)
		return { success: false, error: 'Failed to update comment votes' }
	}
}
