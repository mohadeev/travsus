'use server'

import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'

const prisma = new PrismaClient()

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function saveBlogPost(formData: FormData) {
	const id = formData.get('id') as string | null
	const title = formData.get('title') as string
	const content = formData.get('content') as string
	const excerpt = formData.get('excerpt') as string
	const author = formData.get('author') as string
	const tags = (formData.get('tags') as string)
		.split(',')
		.map((tag) => tag.trim())
	const featuredImage = formData.get('featuredImage') as string | null
	const imageIds = (formData.get('imageIds') as string)?.split(',') || []
	console.log('featuredImage:', featuredImage)
	const postData: any = {
		title,
		content,
		excerpt,
		author,
		tags,
	}

	// Handle featured image
	if (featuredImage) {
		postData.featuredImage = featuredImage
	}

	// Prepare image IDs for the post
	const updatedImageIds = [...imageIds]

	if (id) {
		// Update existing post
		const post = await prisma.post.update({
			where: { id },
			data: {
				...postData,
				imageIds: updatedImageIds,
			},
		})
		return post
	} else {
		// Create new post
		const post = await prisma.post.create({
			data: {
				...postData,
				imageIds: updatedImageIds,
			},
		})
		return post
	}
}
