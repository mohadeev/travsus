'use server'

import { db, T, fetchAll } from '@/lib/db'

export async function getCategoryCounts() {
	try {
		const posts = await fetchAll<{ category: string }>(() =>
			db.from(T.forumPosts).select('category').order('id'),
		)

		const counts = posts.reduce(
			(acc, { category }) => {
				acc[category] = (acc[category] ?? 0) + 1
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
