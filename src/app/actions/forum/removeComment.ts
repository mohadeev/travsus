'use server'

import getUserData from '@/app/api/user/getUserData'
import { db, T, must } from '@/lib/db'

export async function removeComment(commentId: string) {
	try {
		const { id: userId }: any = (await getUserData()) ?? {}
		if (!userId) {
			throw new Error('User not authenticated')
		}

		const comment = must(
			await db.from(T.forumComments).select('authorId').eq('id', commentId).maybeSingle(),
		)

		if (!comment) {
			throw new Error('Comment not found')
		}

		if (comment.authorId !== userId) {
			throw new Error('Not authorized to remove this comment')
		}

		// Replies stay, detached from the removed comment
		must(await db.from(T.forumComments).update({ parentId: null }).eq('parentId', commentId))
		must(await db.from(T.forumComments).delete().eq('id', commentId))

		return { success: true }
	} catch (error) {
		console.error('Error removing comment:', error)
		return { success: false, error: 'Failed to remove comment' }
	}
}
