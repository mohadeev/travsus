'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getRecentPosts(limit: number = 5) {
	try {
		const recentPosts = await prisma.forumPost.findMany({
			take: limit,
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				author: {
					select: {
						id: true,
						accountData: true,
						username: true,
						profileImage: true,
					},
				},
				comments: {
					include: {
						author: {
							select: {
								id: true,
								accountData: true,
								username: true,
								profileImage: true,
							},
						},
					},
					orderBy: {
						createdAt: 'asc',
					},
				},
				_count: {
					select: { comments: true },
				},
			},
		})

		return { success: true, posts: recentPosts }
	} catch (error) {
		console.error('Error fetching recent posts:', error)
		return { success: false, error: 'Failed to fetch recent posts' }
	}
}
