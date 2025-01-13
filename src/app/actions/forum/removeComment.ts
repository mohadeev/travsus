'use server'

import { PrismaClient } from '@prisma/client'
import getUserData from '@/app/api/user/getUserData'

const prisma = new PrismaClient()

export async function removeComment(commentId: string) {
	try {
		const { id: userId }: any = await getUserData()
		if (!userId) {
			throw new Error('User not authenticated')
		}

		const comment = await prisma.forumComment.findUnique({
			where: { id: commentId },
			select: { authorId: true },
		})

		if (!comment) {
			throw new Error('Comment not found')
		}

		if (comment.authorId !== userId) {
			throw new Error('Not authorized to remove this comment')
		}

		await prisma.forumComment.delete({
			where: { id: commentId },
		})

		return { success: true }
	} catch (error) {
		console.error('Error removing comment:', error)
		return { success: false, error: 'Failed to remove comment' }
	}
}
