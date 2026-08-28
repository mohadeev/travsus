export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
// /pages/api/upload.ts
import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'stream'
import path from 'path'
import { writeFileSync } from 'fs'
import { writeFile } from 'fs/promises'
// /utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

if (
	!process.env.CLOUDINARY_CLOUD_NAME ||
	!process.env.CLOUDINARY_API_KEY ||
	!process.env.CLOUDINARY_API_SECRET
) {
	console.error('Missing Cloudinary environment variables')
	console.error('Missing Cloudinary environment variables')
} else {
	console.log('200, everything is good')
}

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
})
export async function POST(request: NextRequest) {
	console.log('POST request received')
	try {
		const formData = await request.formData()
		const file = formData.get('file') as File | null

		if (!file) {
			console.log('No file provided')
			return NextResponse.json({ error: 'No file provided' }, { status: 400 })
		}

		console.log('File received, size:', file.size)

		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)

		console.log('Uploading to Cloudinary')
		const result = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{ resource_type: 'auto' },
				(error, result) => {
					if (error) {
						console.error('Cloudinary upload error:', error)
						reject(error)
					} else {
						console.log('Cloudinary upload successful')
						resolve(result)
					}
				},
			)

			uploadStream.end(buffer)
		})

		const { secure_url } = result as { secure_url: string }

		console.log('Upload complete, returning URL:', secure_url)
		return NextResponse.json({ secure_url }, { status: 200 })
	} catch (error) {
		console.error('Error in upload route:', error)
		return NextResponse.json(
			{
				error: 'Internal server error',
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 },
		)
	}
}

export async function OPTIONS(request: NextRequest) {
	return NextResponse.json({}, { status: 200 })
}

export const runtime = 'nodejs'
