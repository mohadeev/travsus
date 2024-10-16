// /pages/api/upload.ts
import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'stream'
import path from 'path'
import { writeFileSync } from 'fs'
import { writeFile } from 'fs/promises'
import prisma from '@/prisma'
// import cloudinary from '@/utils/cloudinary'
// /utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
})

export default cloudinary

export async function POST(request: any) {
	console.log('here')
	try {
		const formData = await request.formData()
		const file = formData.get('file')
		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)
		const response: any = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream({}, (error: any, result: any) => {
					if (error) {
						return reject(error)
					}
					resolve(result)
				})
				.end(buffer)
		})
		const secure_url = response?.secure_url
		// const newImages = [...story.images, response]

		return NextResponse.json(response, { status: 200 })
	} catch (error) {
		console.error('Error uploading image:', error)
		return NextResponse.json(
			{ error: 'Error uploading image' },
			{ status: 500 },
		)
	}
}
