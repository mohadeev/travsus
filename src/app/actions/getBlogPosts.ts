'use server'

import { PrismaClient } from '@prisma/client'
import { getLocale } from 'next-intl/server'
const prisma = new PrismaClient()

export async function getBlogPosts() {
	const lang = await getLocale()
	console.log('---------------||||||||---------------')
	console.log('---------------||||||||---------------')
	console.log('---------------||||||||---------------')
	console.log('---------------||||||||---------------')
	console.log('---------------||||||||---------------')
	console.log('---------------||||||||---------------')
	console.log('lang:', lang)

	try {
		const posts = await prisma.post.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				translations: true,
				author: true, // Include the entire author object
			},
		})

		const thePosts = posts.map((post) => {
			return {
				...post,
				...post.translations.find(({ language }) => lang === language),
			}
		})
		return thePosts
	} catch (error) {
		console.error('Error fetching blog posts:', error)
		console.error('Failed to fetch blog posts')
	}
}
