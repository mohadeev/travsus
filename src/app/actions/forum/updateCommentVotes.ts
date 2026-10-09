'use server'

import getUserData from '@/app/api/user/getUserData'
import { db, T, must, touch } from '@/lib/db'

const add = (ids: string[], id: string) => (ids.includes(id) ? ids : [...ids, id])
const remove = (ids: string[], id: string) => ids.filter((x) => x !== id)

export async function updateCommentVotes(
	commentId: string,
	action: 'like' | 'dislike' | 'unlike' | 'undislike',
) {
	try {
		const { id: userId }: any = (await getUserData()) ?? {}
		if (!userId) {
			throw new Error('User not authenticated')
		}

		const comment = must(
			await db
				.from(T.forumComments)
				.select('likedByIds, dislikedByIds')
				.eq('id', commentId)
				.maybeSingle(),
		)

		if (!comment) {
			throw new Error('Comment not found')
		}

		let likedByIds: string[] = comment.likedByIds ?? []
		let dislikedByIds: string[] = comment.dislikedByIds ?? []

		switch (action) {
			case 'like':
				likedByIds = add(likedByIds, userId)
				dislikedByIds = remove(dislikedByIds, userId)
				break
			case 'dislike':
				dislikedByIds = add(dislikedByIds, userId)
				likedByIds = remove(likedByIds, userId)
				break
			case 'unlike':
				likedByIds = remove(likedByIds, userId)
				break
			case 'undislike':
				dislikedByIds = remove(dislikedByIds, userId)
				break
		}

		must(
			await db
				.from(T.forumComments)
				.update(touch({ likedByIds, dislikedByIds }))
				.eq('id', commentId),
		)

		return {
			success: true,
			likes: likedByIds.length,
			dislikes: dislikedByIds.length,
		}
	} catch (error) {
		console.error('Error updating comment votes:', error)
		return { success: false, error: 'Failed to update comment votes' }
	}
}
