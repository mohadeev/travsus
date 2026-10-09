'use server'

import { db, T, must } from '@/lib/db'
import { AUTHOR } from './forumSelect'

export async function getPostById(postId: string) {
	try {
		const post: any = must(
			await db
				.from(T.forumPosts)
				.select(`*, ${AUTHOR}, comments:${T.forumComments}(*, ${AUTHOR})`)
				.eq('id', postId)
				.order('createdAt', { referencedTable: 'comments', ascending: true })
				.maybeSingle(),
		)

		if (!post) {
			throw new Error('Post not found')
		}

		return { success: true, post }
	} catch (error) {
		console.error('Error fetching post:', error)
		return { success: false, error: 'Failed to fetch post' }
	}
}
