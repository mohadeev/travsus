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
export async function POST(request: any) {
	console.log('reesut maded her')

	try {
		const formData = await request.formData()
		const file = formData.get('file')

		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)
		const response: any = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream({}, (error, result: any) => {
					if (error) {
						return reject(error)
					}
					resolve(result)
				})
				.end(buffer)
		})
		console.log('response', response)
		const secure_url: any = response?.secure_url

		return NextResponse.json({ secure_url: secure_url }, { status: 200 })
	} catch (error) {
		console.error('Error uploading image:', error)
		return NextResponse.json(
			{ error: 'Error uploading image' },
			{ status: 500 },
		)
	}
}

// // /pages/api/upload.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { Readable } from 'stream'
// import path from 'path'
// import { writeFileSync } from 'fs'
// import { writeFile } from 'fs/promises'
// import prisma from '@/prisma'
// // import cloudinary from '@/utils/cloudinary'
// // /utils/cloudinary.ts
// import { v2 as cloudinary } from 'cloudinary'
// const CLOUDINARY_CLOUD_NAME = 'travsus'
// const CLOUDINARY_API_KEY = '897269291229847'
// const CLOUDINARY_API_SECRET = 'AQyEfyG6TSHFyGZx8epX_X5doaM'
// const CLOUDINARY_URL =
// 	'cloudinary://897269291229847:AQyEfyG6TSHFyGZx8epX_X5doaM@travsus'
// cloudinary.config({
// 	cloud_name: CLOUDINARY_CLOUD_NAME,
// 	api_key: CLOUDINARY_API_KEY,
// 	api_secret: CLOUDINARY_API_SECRET,
// 	secure: true,
// })

// // export default cloudinary

// export async function POST(request: any) {
// 	console.log('here')
// 	try {
// 		const formData = await request.formData()
// 		const file = formData.get('file')
// 		const bytes = await file.arrayBuffer()
// 		const buffer = Buffer.from(bytes)
// 		const response: any = await new Promise((resolve, reject) => {
// 			cloudinary.uploader
// 				.upload_stream({}, (error: any, result: any) => {
// 					if (error) {
// 						return reject(error)
// 					}
// 					resolve(result)
// 				})
// 				.end(buffer)
// 		})
// 		const secure_url = response?.secure_url
// 		// const newImages = [...story.images, response]
// 		console.log(response)
// 		return NextResponse.json(response, { status: 200 })
// 	} catch (error) {
// 		console.error('Error uploading image:', error)
// 		return NextResponse.json(
// 			{ error: 'Error uploading image' },
// 			{ status: 500 },
// 		)
// 	}
// }
