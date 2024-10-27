import { NextRequest, NextResponse } from 'next/server'
import { unstable_noStore as noStore } from 'next/cache'
import prisma from '@/prisma'
import { imageUploader } from '@/utils/api-utils/imageUploader'
import getUserData from '@/app/api/user/getUserData'
import cloudinary from '@/utils/cloudinary'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

const uploadImage = async (
	file: Blob,
): Promise<{ url: string; public_id: string }> => {
	const arrayBuffer = await file.arrayBuffer()
	const fileBuffer = Buffer.from(arrayBuffer)

	const uploadResult = await imageUploader(fileBuffer, 'uploads')
	return {
		url: uploadResult.url,
		public_id: uploadResult.public_id,
	}
}

export async function POST(request: NextRequest) {
	noStore()

	try {
		const formData = await request.formData()
		const file = formData.get('file') as Blob

		if (!file) {
			return NextResponse.json({ error: 'No file provided' }, { status: 400 })
		}

		const newImage = await uploadImage(file)
		console.log(newImage)

		return NextResponse.json(newImage, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			},
		})
	} catch (error) {
		console.log('Error processing upload:', error)
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		)
	}
}

export async function OPTIONS() {
	return NextResponse.json(
		{},
		{
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			},
		},
	)
}
