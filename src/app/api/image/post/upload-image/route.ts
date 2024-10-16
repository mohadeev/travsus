import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import { imageUploader } from '@/utils/api-utils/imageUploader'
import getUserData from '@/app/api/user/getUserData'
import cloudinary from '@/utils/cloudinary'

const uploadImage = async (
	file: Blob,
): Promise<{ url: string; public_id: string }> => {
	try {
		const arrayBuffer = await file.arrayBuffer()
		const fileBuffer = Buffer.from(arrayBuffer)
		const uploadResult = await imageUploader(fileBuffer, 'uploads')
		return {
			url: uploadResult.url,
			public_id: uploadResult.public_id,
		}
	} catch (error) {
		console.error('Error uploading image:', error)
		throw new Error('Failed to upload image')
	}
}

const updateUserProfileImage = async (
	userId: string,
	newImage: { url: string; public_id: string },
) => {
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { profileImage: true },
		})

		if (user?.profileImage) {
			await removeImageFromCloudinary(user.profileImage.public_id)
		}

		const updatedUser = await prisma.user.update({
			where: { id: userId },
			data: { profileImage: newImage },
		})
		return updatedUser.profileImage
	} catch (error) {
		console.error('Error updating user profile image:', error)
		throw new Error('Failed to update user profile image')
	}
}

const updateBusinessImage = async (
	businessId: string,
	newImage: { url: string; public_id: string },
	imageType: 'profile' | 'cover',
) => {
	try {
		const business = await prisma.business.findUnique({
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
		return updatedBusiness[
			imageType === 'profile' ? 'profileImage' : 'coverImage'
		]
	} catch (error) {
		console.error('Error updating business image:', error)
		throw new Error('Failed to update business image')
	}
}

const updateTourImages = async (
	tourId: string,
	newImage: { url: string; public_id: string },
) => {
	try {
		const updatedTour = await prisma.tour.update({
			where: { id: tourId },
			data: {
				images: {
					push: newImage,
				},
			},
		})
		return updatedTour.images
	} catch (error) {
		console.error('Error updating tour images:', error)
		throw new Error('Failed to update tour images')
	}
}

const removeImageFromCloudinary = async (public_id: string) => {
	try {
		await cloudinary.v2.uploader.destroy(public_id)
	} catch (error) {
		console.error('Error removing image from Cloudinary:', error)
		throw new Error('Failed to remove image from Cloudinary')
	}
}

export async function POST(request: NextRequest) {
	try {
		const userData = await getUserData()
		if (!userData?.id) {
			return NextResponse.json(
				{ message: 'User not authenticated' },
				{ status: 401 },
			)
		}

		const { searchParams } = new URL(request.url)
		const type = searchParams.get('type')
		const id = searchParams.get('id')
		const imageType = searchParams.get('imageType')

		if (!type || !id) {
			return NextResponse.json(
				{ message: 'Type and ID are required' },
				{ status: 400 },
			)
		}

		const formData = await request.formData()
		const file = formData.get('file') as Blob

		if (!file) {
			return NextResponse.json(
				{ message: 'Image file is required' },
				{ status: 400 },
			)
		}

		const newImage = await uploadImage(file)

		let result
		if (type === 'user') {
			result = await updateUserProfileImage(userData.id, newImage)
		} else if (type === 'business') {
			if (!imageType || (imageType !== 'profile' && imageType !== 'cover')) {
				return NextResponse.json(
					{
						message:
							'Valid image type (profile or cover) is required for business',
					},
					{ status: 400 },
				)
			}
			result = await updateBusinessImage(id, newImage, imageType)
		} else if (type === 'tour') {
			result = await updateTourImages(id, newImage)
		} else {
			return NextResponse.json(
				{ message: 'Invalid type provided' },
				{ status: 400 },
			)
		}

		return NextResponse.json(result, { status: 200 })
	} catch (error) {
		console.error('Unhandled error:', error)
		return NextResponse.json(
			{ message: 'An unexpected error occurred during the upload.' },
			{ status: 500 },
		)
	}
}
