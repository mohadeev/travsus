'use server'

import getUserData from '@/app/api/user/getUserData'
import { db, T, must, withMeta } from '@/lib/db'
import { isForumCategory } from '@/app/[locale]/forum/categories'

const clean = (value: FormDataEntryValue | null, max: number) =>
	String(value ?? '').trim().slice(0, max)

export async function createForumPost(formData: FormData) {
	try {
		const { id: userId }: any = (await getUserData()) ?? {}
		if (!userId) return { success: false, error: 'NOT_SIGNED_IN' }

		const title = clean(formData.get('title'), 140)
		const content = clean(formData.get('content'), 10000)
		const category = clean(formData.get('category'), 40)
		const tags = Array.from(new Set(
			clean(formData.get('tags'), 200)
				.split(',')
				.map((tag) => tag.trim().toLowerCase())
				.filter(Boolean),
		)).slice(0, 5)
		if (title.length < 5 || content.length < 10 || !isForumCategory(category)) {
			return { success: false, error: 'INVALID' }
		}

		const excerpt = content.length > 180 ? `${content.slice(0, 180).replace(/\s+\S*$/, '')}…` : content

		const post = must(
			await db
				.from(T.forumPosts)
				.insert(withMeta({ title, content, excerpt, tags, category, authorId: userId }))
				.select('id')
				.single(),
		)

		return { success: true, id: post?.id as string }
	} catch (error) {
		console.error('Error creating forum post:', error)
		return { success: false, error: 'SERVER_ERROR' }
	}
}
