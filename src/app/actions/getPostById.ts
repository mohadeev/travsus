'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getPostById(id: string) {
	try {
		const post = await prisma.post.findUnique({
			where: { id },
		})
		console.log('post:', post)
		return post
	} catch (error) {
		console.error('Error fetching post:', error)
		throw new Error('Failed to fetch post')
	}
}
