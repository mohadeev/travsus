'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getCategoryCounts() {
	try {
		const categoryCounts = await prisma.forumPost.groupBy({
			by: ['category'],
			_count: {
				_all: true,
			},
		})

		const counts = categoryCounts.reduce(
			(acc, { category, _count }) => {
				acc[category] = _count._all
				return acc
			},
			{} as Record<string, number>,
		)

		return { success: true, counts }
	} catch (error) {
		console.error('Error fetching category counts:', error)
		return { success: false, error: 'Failed to fetch category counts' }
	}
}
