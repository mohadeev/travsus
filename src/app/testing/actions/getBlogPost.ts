'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getBlogPost(id: string) {
	try {
		const post = await prisma.post.findUnique({
			where: {
				id: id,
			},
			include: {
				author: true, // Include the entire author object
			},
		})
		return post
	} catch (error) {
		console.error('Error fetching blog post:', error)
		console.error('Failed to fetch blog post')
	}
}
