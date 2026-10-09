'use server'

import { getLocale } from 'next-intl/server'
import { db, T, must } from '@/lib/db'
import { POST_WITH_AUTHOR } from './blogSelect'

export async function getBlogPosts() {
	const lang = await getLocale()

	try {
		const posts: any[] =
			must(
				await db
					.from(T.posts)
					.select(POST_WITH_AUTHOR)
					.order('createdAt', { ascending: false }),
			) ?? []

		// Overlay the translation for the current locale
		return posts.map((post) => ({
			...post,
			...(post.translations ?? []).find(({ language }: any) => lang === language),
		}))
	} catch (error) {
		console.error('Error fetching blog posts:', error)
	}
}
