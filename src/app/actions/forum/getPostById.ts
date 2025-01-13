import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getPostById(postId: string) {
	try {
		const post = await prisma.forumPost.findUnique({
			where: { id: postId },
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
				comments: {
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
					orderBy: {
						createdAt: 'asc',
					},
				},
			},
		})

		if (!post) {
			throw new Error('Post not found')
		}

		console.log('Fetched post with comments:', post)

		return { success: true, post }
	} catch (error) {
		console.error('Error fetching post:', error)
		return { success: false, error: 'Failed to fetch post' }
	}
}
