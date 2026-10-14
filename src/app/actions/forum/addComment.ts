'use server'

import getUserData from '@/app/api/user/getUserData'
import { db, T, must, withMeta } from '@/lib/db'
import { toAuthor } from '@/lib/forum'
import { AUTHOR } from './forumSelect'

export async function addComment(formData: FormData) {
	try {
		const { id: userId }: any = (await getUserData()) ?? {}
		if (!userId) return { success: false, error: 'NOT_SIGNED_IN' }

		const content = String(formData.get('content') ?? '').trim().slice(0, 5000)
		const postId = String(formData.get('postId') ?? '')
		const parentId = String(formData.get('parentId') ?? '') || null
		if (!content || !postId) return { success: false, error: 'INVALID' }

		// The post (and the comment replied to) must exist
		const post = must(await db.from(T.forumPosts).select('id').eq('id', postId).maybeSingle())
		if (!post) return { success: false, error: 'INVALID' }
		if (parentId) {
			const parent = must(
				await db.from(T.forumComments).select('id').eq('id', parentId).eq('postId', postId).maybeSingle(),
			)
			if (!parent) return { success: false, error: 'INVALID' }
		}

		const row: any = must(
			await db
				.from(T.forumComments)
				.insert(withMeta({ content, authorId: userId, postId, parentId, likedByIds: [], dislikedByIds: [] }))
				.select(`id, content, parentId, createdAt, likedByIds, ${AUTHOR}`)
				.single(),
		)

		return {
			success: true,
			comment: { ...row, likedByIds: row.likedByIds ?? [], author: toAuthor(row.author) },
		}
	} catch (error) {
		console.error('Error adding comment:', error)
		return { success: false, error: 'SERVER_ERROR' }
	}
}
