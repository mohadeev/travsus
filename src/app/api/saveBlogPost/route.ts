export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { v2 as cloudinary } from 'cloudinary'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must, newId } from '@/lib/db'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
	try {
		const { id: userId }: any = (await getUserData()) || {}
		if (!userId) {
			return NextResponse.json(
				{ success: false, error: 'Not authenticated' },
				{ status: 401 },
			)
		}
		const formData = await request.formData()
		const postId = formData.get('id') as string | null
		const title = formData.get('title') as string
		const content = formData.get('content') as string
		const excerpt = formData.get('excerpt') as string
		const byJson = formData.get('byJson') as string
		const translations = formData.get('translations') as any
		let post

		// Only the author can edit an existing post
		if (postId) {
			const existingPost = must(
				await db.from(T.posts).select('authorId').eq('id', postId).maybeSingle(),
			)

			if (!existingPost || existingPost.authorId !== userId) {
				return NextResponse.json(
					{ success: false, error: 'Unauthorized' },
					{ status: 403 },
				)
			}
		}

		if (byJson === 'true') {
			if (!postId) {
				return NextResponse.json(
					{ success: false, error: 'Post ID is required' },
					{ status: 400 },
				)
			}
			post = must(
				await db
					.from(T.posts)
					.update({ translations: JSON.parse(translations) })
					.eq('id', postId)
					.select('*')
					.single(),
			)
			revalidateTag('blog') // blog list and sitemap show the change right away
			return NextResponse.json({ success: true, post })
		}
		const tags = (formData.get('tags') as string)
			?.split(',')
			?.map((tag) => tag.trim())
		const newImages = formData.getAll('newImages') as File[]
		const imageIds =
			(formData.get('imageIds') as string)?.split(',').filter(Boolean) || []

		const postData: any = {
			title,
			content,
			excerpt,
			tags,
			authorId: userId,
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

		// Featured image: the cover chosen in the editor, else the first image in the content
		const cover = String(formData.get('featuredImage') ?? '').trim()
		const firstImageMatch = content.match(/<img.*?src="(.*?)"/)
		if (/^https:\/\//.test(cover)) {
			postData.featuredImage = cover
		} else if (firstImageMatch && firstImageMatch[1]) {
			postData.featuredImage = firstImageMatch[1]
		} else if (uploadedImages.length > 0) {
			postData.featuredImage = uploadedImages[0].url
		}

		if (postId) {
			// Update existing post
			post = must(
				await db
					.from(T.posts)
					.update({ ...postData, imageIds: updatedImageIds })
					.eq('id', postId)
					.select('*')
					.single(),
			)
		} else {
			// Create new post (Post has createdAt but no updatedAt column)
			post = must(
				await db
					.from(T.posts)
					.insert({
						id: newId(),
						createdAt: new Date().toISOString(),
						translations: [],
						...postData,
						imageIds: updatedImageIds,
					})
					.select('*')
					.single(),
			)
		}

		revalidateTag('blog') // blog list and sitemap show the change right away
		return NextResponse.json({ success: true, post })
	} catch (error) {
		console.error('Error saving post:', error)
		return NextResponse.json(
			{ success: false, error: 'Failed to save post' },
			{ status: 500 },
		)
	}
}
