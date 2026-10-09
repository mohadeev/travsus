'use server'

import getUserData from '@/app/api/user/getUserData'
import { db, T, must, withMeta } from '@/lib/db'

export async function createForumPost(formData: FormData) {
	try {
		const { id: userId }: any = (await getUserData()) ?? {}
		if (!userId) {
			throw new Error('User not authenticated')
		}

		const content = formData.get('content') as string
		const tags = ((formData.get('tags') as string) || '')
			.split(',')
			.map((tag) => tag.trim())

		const newForumPost = must(
			await db
				.from(T.forumPosts)
				.insert(
					withMeta({
						title: formData.get('title') as string,
						content,
						excerpt: content.substring(0, 150) + '...',
						tags,
						category: formData.get('category') as string,
						authorId: userId,
					}),
				)
				.select('*')
				.single(),
		)

		return { success: true, post: newForumPost }
	} catch (error) {
		console.error('Error creating forum post:', error)
		return { success: false, error: 'Failed to create forum post' }
	}
}
