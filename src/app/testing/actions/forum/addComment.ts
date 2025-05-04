'use server'

import { PrismaClient } from '@prisma/client'
import getUserData from '@/app/api/user/getUserData'

const prisma = new PrismaClient()

export async function addComment(formData: FormData) {
	try {
		const { id: userId }: any = await getUserData()
		if (!userId) {
			throw new Error('User not authenticated')
		}

		const postId = formData.get('postId') as string
		const content = formData.get('content') as string
		const parentId = formData.get('parentId') as string | null
		const rootParentId = formData.get('rootParentId') as string | null

		console.log('Adding comment:', {
			postId,
			content,
			parentId,
			rootParentId,
			userId,
		})

		const comment = await prisma.forumComment.create({
			data: {
				content,
				authorId: userId,
				postId,
				parentId,
				rootParentId: rootParentId || parentId,
			},
			include: {
				author: {
					select: {
						id: true,
						username: true,
						profileImage: true,
						accountData: {
							select: {
								firstname: true,
							},
						},
					},
				},
			},
		})

		console.log('Comment added successfully:', comment)

		return { success: true, comment }
	} catch (error) {
		console.error('Error adding comment:', error)
		return { success: false, error: 'Failed to add comment' }
	}
}
