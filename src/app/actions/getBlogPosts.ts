'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getBlogPosts() {
	try {
		const posts = await prisma.post.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				author: true, // Include the entire author object
			},
		})
		return posts
	} catch (error) {
		console.error('Error fetching blog posts:', error)
		throw new Error('Failed to fetch blog posts')
	}
}
