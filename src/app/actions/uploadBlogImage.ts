'use server'
// Blog editor image upload → Cloudinary (folder blog_images). Signed-in
// writers only; images up to 10 MB. Returns the https URL to put in the post.
import { v2 as cloudinary } from 'cloudinary'
import getUserData from '@/app/api/user/getUserData'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

const MAX_BYTES = 10 * 1024 * 1024

export async function uploadBlogImage(formData: FormData): Promise<{ url: string } | { error: string }> {
	const { id: userId }: any = (await getUserData().catch(() => null)) || {}
	if (!userId) return { error: 'Please sign in to upload images.' }

	const file = formData.get('file')
	if (!(file instanceof File) || !file.type.startsWith('image/')) return { error: 'Choose an image file.' }
	if (file.size > MAX_BYTES) return { error: 'Images can be up to 10 MB.' }

	try {
		const dataUri = `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`
		const result = await cloudinary.uploader.upload(dataUri, { folder: 'blog_images', resource_type: 'image' })
		return { url: result.secure_url }
	} catch (error: any) {
		console.error('Blog image upload failed:', error?.message ?? error)
		return { error: 'Upload failed. Please try again.' }
	}
}
