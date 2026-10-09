'use server'

import { db, T, must } from '@/lib/db'
import { AUTHOR } from './forumSelect'

export async function getRecentPosts(limit: number = 5) {
	try {
		const posts: any[] =
			must(
				await db
					.from(T.forumPosts)
					.select(`*, ${AUTHOR}, comments:${T.forumComments}(*, ${AUTHOR})`)
					.order('createdAt', { ascending: false })
					.order('createdAt', { referencedTable: 'comments', ascending: true })
					.limit(limit),
			) ?? []

		// Same shape as before: _count.comments
		const recentPosts = posts.map((post) => ({
			...post,
			_count: { comments: post.comments?.length ?? 0 },
		}))

		return { success: true, posts: recentPosts }
	} catch (error) {
		console.error('Error fetching recent posts:', error)
		return { success: false, error: 'Failed to fetch recent posts' }
	}
}
