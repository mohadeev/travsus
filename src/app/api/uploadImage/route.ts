// /pages/api/upload.ts
import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'stream'
import path from 'path'
import { writeFileSync } from 'fs'
import { writeFile } from 'fs/promises'
// /utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
})

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData()
		const file = formData.get('file') as File

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 })
		}

		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)

		const result = await new Promise((resolve, reject) => {
			const uploadStream = cloudinary.uploader.upload_stream(
				{ resource_type: 'auto' },
				(error, result) => {
					if (error) reject(error)
					else resolve(result)
				},
			)

			uploadStream.end(buffer)
		})

		const { secure_url } = result as { secure_url: string }

		return NextResponse.json({ secure_url }, { status: 200 })
	} catch (error) {
		console.error('Error uploading image:', error)
		return NextResponse.json(
			{ error: 'Error uploading image' },
			{ status: 500 },
		)
	}
}
