'use server'

import getUserData from '@/app/api/user/getUserData'
import { db, T, must, withMeta } from '@/lib/db'
import { AUTHOR } from './forumSelect'

export async function addComment(formData: FormData) {
	try {
		const { id: userId }: any = (await getUserData()) ?? {}
		if (!userId) {
			throw new Error('User not authenticated')
		}

		const comment = must(
			await db
				.from(T.forumComments)
				.insert(
					withMeta({
						content: formData.get('content') as string,
						authorId: userId,
						postId: formData.get('postId') as string,
						parentId: (formData.get('parentId') as string | null) || null,
					}),
				)
				.select(`*, ${AUTHOR}`)
				.single(),
		)

		return { success: true, comment }
	} catch (error) {
		console.error('Error adding comment:', error)
		return { success: false, error: 'Failed to add comment' }
	}
}
