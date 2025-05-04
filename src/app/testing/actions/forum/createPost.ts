'use server'

import { PrismaClient } from '@prisma/client'
import getUserData from '@/app/api/user/getUserData'

const prisma = new PrismaClient()

export async function createForumPost(formData: FormData) {
	try {
		const { id: userId }: any = await getUserData()
		if (!userId) {
			throw new Error('User not authenticated')
		}

		const title = formData.get('title') as string
		const content = formData.get('content') as string
		const tags = (formData.get('tags') as string)
			.split(',')
			.map((tag) => tag.trim())
		const category = formData.get('category') as string

		const newForumPost = await prisma.forumPost.create({
			data: {
				title,
				content,
				excerpt: content.substring(0, 150) + '...',
				tags,
				category,
				author: {
					connect: { id: userId },
				},
			},
		})

		console.log('Forum post created successfully:', newForumPost.id)
		return { success: true, post: newForumPost }
	} catch (error) {
		console.error('Error creating forum post:', error)
		return { success: false, error: 'Failed to create forum post' }
	}
}
