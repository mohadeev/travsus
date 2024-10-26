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

const updateUserProfileImage = async (
	userId: string,
	newImage: { url: string; public_id: string },
) => {
	const user: any = await prisma.user.findUnique({
		where: { id: userId },
		select: { profileImage: true },
	})

	if (user?.profileImage) {
		await removeImageFromCloudinary(user?.profileImage?.public_id)
	}

	const updatedUser = await prisma.user.update({
		where: { id: userId },
		data: {
			profileImage: newImage,
		},
	})
	return updatedUser.profileImage
}

const updateBusinessImage = async (
	businessId: string,
	newImage: { url: string; public_id: string },
	imageType: 'profile' | 'cover',
) => {
	const business: any = await prisma.business.findUnique({
		where: { id: businessId },
		select: { profileImage: true, coverImage: true },
	})

	if (imageType === 'profile' && business?.profileImage) {
		await removeImageFromCloudinary(business.profileImage.public_id)
	} else if (imageType === 'cover' && business?.coverImage) {
		await removeImageFromCloudinary(business.coverImage.public_id)
	}

	const updatedBusiness = await prisma.business.update({
		where: { id: businessId },
		data: {
			[imageType === 'profile' ? 'profileImage' : 'coverImage']: newImage,
		},
	})
	return imageType === 'profile'
		? updatedBusiness.profileImage
		: updatedBusiness.coverImage
}

const updateTourImages = async (
	tourId: string,
	newImage: { url: string; public_id: string },
) => {
	const updatedTour = await prisma.tour.update({
		where: { id: tourId },
		data: {
			images: {
				push: newImage,
			},
		},
	})
	return updatedTour.images
}

const removeImageFromCloudinary = async (public_id: string) => {
	await cloudinary.v2.uploader.destroy(public_id)
}

export async function POST(request: NextRequest) {
	try {
		const userData: any = await getUserData()

		if (!userData?.id) {
			return NextResponse.json(
				{ message: 'User not authenticated' },
				{
					status: 401,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
						'Access-Control-Allow-Headers': 'Content-Type, Authorization',
					},
				},
			)
		}

		const { searchParams } = new URL(request.url)
		const type = searchParams.get('type')
		const id = searchParams.get('id')
		const imageType = searchParams.get('imageType')

		if (!type || !id) {
			return NextResponse.json(
				{ message: 'Type and ID are required' },
				{
					status: 400,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
						'Access-Control-Allow-Headers': 'Content-Type, Authorization',
					},
				},
			)
		}

		const formData = await request.formData()
		const file = formData.get('file') as Blob

		if (!file) {
			return NextResponse.json(
				{ message: 'Image file is required' },
				{
					status: 400,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
						'Access-Control-Allow-Headers': 'Content-Type, Authorization',
					},
				},
			)
		}

		const newImage = await uploadImage(file)
		let resData = null

		if (type === 'user') {
			resData = await updateUserProfileImage(userData.id, newImage)
		} else if (type === 'business') {
			if (!imageType) {
				return NextResponse.json(
					{ message: 'Image type (profile or cover) is required for business' },
					{
						status: 400,
						headers: {
							'Access-Control-Allow-Origin': '*',
							'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
							'Access-Control-Allow-Headers': 'Content-Type, Authorization',
						},
					},
				)
			}
			resData = await updateBusinessImage(
				id,
				newImage,
				imageType as 'profile' | 'cover',
			)
		} else if (type === 'tour') {
			resData = await updateTourImages(id, newImage)
		} else {
			return NextResponse.json(
				{ message: 'Invalid type provided' },
				{
					status: 400,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
						'Access-Control-Allow-Headers': 'Content-Type, Authorization',
					},
				},
			)
		}

		return NextResponse.json(resData, {
			status: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			},
		})
	} catch (error) {
		console.error('Error in image upload:', error)
		return NextResponse.json(
			{ message: 'An error occurred during the upload.' },
			{
				status: 500,
				headers: {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization',
				},
			},
		)
	}
}

export async function OPTIONS(request: NextRequest) {
	return NextResponse.json(
		{},
		{
			status: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			},
		},
	)
}

export const config = {
	api: {
		bodyParser: false,
	},
}

export const runtime = 'nodejs'
