import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getPostById(id: string) {
	try {
		const post = await prisma.post.findUnique({
			where: { id },
		})
		return post
	} catch (error) {
		console.error('Error fetching blog post:', error)
		throw error
	}
}
