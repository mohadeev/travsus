import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import { imageUploader } from '@/utils/api-utils/imageUploader'
import getUserData from '@/app/api/user/getUserData'
import cloudinary from '@/utils/cloudinary'

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
	const formData = await request.formData()
	const file = formData.get('file') as Blob
	const newImage = await uploadImage(file)
	console.log(newImage)
	return NextResponse.json(newImage)
}
