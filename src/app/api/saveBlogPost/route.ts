import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'
import getUserData from '@/app/api/user/getUserData'

const prisma = new PrismaClient()

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
	try {
		const { id: userId }: any = (await getUserData()) || {}
		const formData = await request.formData()
		const postId = formData.get('id') as string | null
		const title = formData.get('title') as string
		const content = formData.get('content') as string
		const excerpt = formData.get('excerpt') as string
		const byJson = formData.get('byJson') as string
		const translations = formData.get('translations') as any
		console.log('----------------------------------------------------')
		console.log('----------------------------------------------------')
		console.log('----------------------------------------------------')
		console.log('----------------------------------------------------')
		console.log('postId:', postId)
		console.log('----------------------------------------------------')
		console.log('----------------------------------------------------')
		console.log('----------------------------------------------------')
		console.log('----------------------------------------------------')
		let post

		if (byJson === 'true') {
			// Update existing post
			post = await prisma.post.update({
				where: { id: postId },
				data: {
					translations: JSON.parse(translations),
				},
			})
			return NextResponse.json({ success: true, post })
		}
		const tags = (formData.get('tags') as string)
			?.split(',')
			?.map((tag) => tag.trim())
		const newImages = formData.getAll('newImages') as File[]
		const imageIds =
			(formData.get('imageIds') as string)?.split(',').filter(Boolean) || []

		if (postId) {
			const existingPost = await prisma.post.findUnique({
				where: { id: postId },
				select: { authorId: true },
			})

			if (!existingPost || existingPost.authorId !== userId) {
				return NextResponse.json(
					{ success: false, error: 'Unauthorized' },
					{ status: 403 },
				)
			}
		}

		const postData: any = {
			title,
			content,
			excerpt,
			tags,
			author: { connect: { id: userId } },
		}

		// Handle new image uploads
		const uploadedImages = await Promise.all(
			newImages.map(async (file) => {
				const buffer = await file.arrayBuffer()
				const base64Image = Buffer.from(buffer).toString('base64')
				const dataURI = `data:${file.type};base64,${base64Image}`

				const result = await cloudinary.uploader.upload(dataURI, {
					folder: 'blog_images',
				})
				return {
					id: result.public_id,
					url: result.secure_url,
					publicId: result.public_id,
				}
			}),
		)

		// Prepare image IDs for the post
		const updatedImageIds = [
			...imageIds,
			...uploadedImages.map((img) => img.id),
		]

		// Set the featured image to the first image in the content
		const firstImageMatch = content.match(/<img.*?src="(.*?)"/)
		if (firstImageMatch && firstImageMatch[1]) {
			postData.featuredImage = firstImageMatch[1]
		} else if (uploadedImages.length > 0) {
			postData.featuredImage = uploadedImages[0].url
		}

		if (postId) {
			// Update existing post
			post = await prisma.post.update({
				where: { id: postId },
				data: {
					...postData,
					imageIds: updatedImageIds,
				},
			})
		} else {
			// Create new post
			post = await prisma.post.create({
				data: {
					...postData,
					imageIds: updatedImageIds,
				},
			})
		}

		return NextResponse.json({ success: true, post })
	} catch (error) {
		console.error('Error saving post:', error)
		return NextResponse.json(
			{ success: false, error: 'Failed to save post' },
			{ status: 500 },
		)
	}
}
