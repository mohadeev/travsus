import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'
import cloudinary from '@/utils/cloudinary'

// Function to update user's profile image and remove the previous one
const updateUserProfileImage = async (
	userId: string,
	newImage: { url: string; public_id: string },
) => {
	console.log('Updating user profile image for userId:', userId)
	const user: any = await prisma.user.findUnique({
		where: { id: userId },
		select: { profileImage: true },
	})

	if (user?.profileImage) {
		console.log(
			'Removing previous user profile image:',
			user.profileImage.public_id,
		)
		// Remove previous image from Cloudinary if exists
		await removeImageFromCloudinary(user?.profileImage?.public_id)
	}

	// Update with the new image object
	console.log('Updating user with new profile image:', newImage)
	await prisma.user.update({
		where: { id: userId },
		data: {
			profileImage: newImage,
		},
	})
	return newImage
}

// Function to update business's profile/cover image and remove the previous one
const updateBusinessImage = async (
	businessId: string,
	newImage: { url: string; public_id: string },
	imageType: 'profile' | 'cover',
) => {
	console.log(
		`Updating business ${imageType} image for businessId:`,
		businessId,
	)
	const business: any = await prisma.business.findUnique({
		where: { id: businessId },
		select: { profileImage: true, coverImage: true },
	})

	if (imageType === 'profile' && business?.profileImage) {
		console.log(
			'Removing previous business profile image:',
			business.profileImage.public_id,
		)
		// Remove previous profile image from Cloudinary
		await removeImageFromCloudinary(business.profileImage.public_id)
	} else if (imageType === 'cover' && business?.coverImage) {
		console.log(
			'Removing previous business cover image:',
			business.coverImage.public_id,
		)
		// Remove previous cover image from Cloudinary
		await removeImageFromCloudinary(business.coverImage.public_id)
	}

	// Update with the new image object
	console.log(`Updating business with new ${imageType} image:`, newImage)
	await prisma.business.update({
		where: { id: businessId },
		data: {
			[imageType === 'profile' ? 'profileImage' : 'coverImage']: newImage,
		},
	})
	return newImage
}

// Function to push a new image into the tour's images array
const updateTourImages = async (
	tourId: string,
	newImage: { url: string; public_id: string },
) => {
	console.log('Adding new image to tour:', tourId)
	await prisma.tour.update({
		where: { id: tourId },
		data: {
			images: {
				push: newImage, // Add new image to the array
			},
		},
	})
	console.log('New image added to tour:', newImage)
}

// Function to remove an image from Cloudinary using its public_id
const removeImageFromCloudinary = async (public_id: string) => {
	console.log('Removing image from Cloudinary:', public_id)
	// Logic to remove the image from Cloudinary based on the public_id
	await cloudinary.v2.uploader.destroy(public_id)
	console.log('Image removed from Cloudinary:', public_id)
}

export async function POST(request: NextRequest) {
	console.log('POST request received')
	try {
		const userData: any = await getUserData()
		console.log('User data retrieved:', userData)

		// Ensure user is logged in
		if (!userData?.id) {
			console.log('User not authenticated')
			return NextResponse.json(
				{ message: 'User not authenticated' },
				{ status: 401 },
			)
		}

		// Extract the type and ID from the request URL
		const { searchParams } = new URL(request.url)
		const type = searchParams.get('type') // 'user', 'business', or 'tour'
		const id = searchParams.get('id')
		const imageType = searchParams.get('imageType') // 'profile' or 'cover' for businesses
		console.log('Request parameters:', { type, id, imageType })

		if (!type || !id) {
			console.log('Missing type or ID')
			return NextResponse.json(
				{ message: 'Type and ID are required' },
				{ status: 400 },
			)
		}

		// Extract the uploadedData from the request body
		const { uploadedData } = await request.json()
		console.log('Uploaded data received:', uploadedData)

		if (!uploadedData || !uploadedData.url || !uploadedData.public_id) {
			console.log('Invalid uploadedData')
			return NextResponse.json(
				{ message: 'Invalid uploadedData' },
				{ status: 400 },
			)
		}

		const newImage = {
			url: uploadedData.url,
			public_id: uploadedData.public_id,
		}
		console.log('New image object created:', newImage)

		// Handle image updates based on the type
		if (type === 'user') {
			console.log('Updating user profile image')
			// Update the user's profile image and remove the previous one
			const userProfileImage = await updateUserProfileImage(
				userData.id,
				newImage,
			)
			console.log('User profile image updated:', userProfileImage)
			return NextResponse.json(userProfileImage, { status: 200 })
		} else if (type === 'business') {
			console.log('Updating business image')
			// Update business profile/cover image and remove the previous one
			if (!imageType) {
				console.log('Missing imageType for business update')
				return NextResponse.json(
					{ message: 'Image type (profile or cover) is required for business' },
					{ status: 400 },
				)
			}
			const businessImage = await updateBusinessImage(
				id,
				newImage,
				imageType as 'profile' | 'cover',
			)
			console.log('Business image updated:', businessImage)
			return NextResponse.json(businessImage, { status: 200 })
		} else if (type === 'tour') {
			console.log('Updating tour images')
			// Push new image to the tour's images array
			await updateTourImages(id, newImage)
			console.log('Tour images updated')
			return NextResponse.json(newImage, { status: 200 })
		} else {
			console.log('Invalid type provided:', type)
			return NextResponse.json(
				{ message: 'Invalid type provided' },
				{ status: 400 },
			)
		}
	} catch (error) {
		console.error('Error occurred during update:', error)
		return NextResponse.json(
			{ message: 'An error occurred during the update.' },
			{ status: 500 },
		)
	}
}

export async function OPTIONS(request: NextRequest) {
	console.log('OPTIONS request received')
	return NextResponse.json({}, { status: 200 })
}

export const runtime = 'nodejs'

// import { NextRequest, NextResponse } from 'next/server'
// import prisma from '@/prisma' // Import Prisma client
// import { imageUploader } from '@/utils/api-utils/imageUploader'
// import getUserData from '@/app/api/user/getUserData'
// import cloudinary from '@/utils/cloudinary'

// // Function to upload image and return the image object
// const uploadImage = async (
// 	file: Blob,
// ): Promise<{ url: string; public_id: string }> => {
// 	// Convert ArrayBuffer to Buffer
// 	const arrayBuffer = await file.arrayBuffer()
// 	const fileBuffer = Buffer.from(arrayBuffer) // Convert to Buffer

// 	const uploadResult = await imageUploader(fileBuffer, 'uploads') // Pass Buffer
// 	return {
// 		url: uploadResult.url, // Use 'url'
// 		public_id: uploadResult.public_id,
// 	}
// }

// // Function to update user's profile image and remove the previous one
// const updateUserProfileImage = async (
// 	userId: string,
// 	newImage: { url: string; public_id: string },
// ) => {
// 	const user: any = await prisma.user.findUnique({
// 		where: { id: userId },
// 		select: { profileImage: true },
// 	})

// 	if (user?.profileImage) {
// 		// Remove previous image from Cloudinary if exists
// 		await removeImageFromCloudinary(user?.profileImage?.public_id)
// 	}

// 	// Update with the new image object
// 	await prisma.user.update({
// 		where: { id: userId },
// 		data: {
// 			profileImage: newImage,
// 		},
// 	})
// 	return newImage
// }

// // Function to update business's profile/cover image and remove the previous one
// const updateBusinessImage = async (
// 	businessId: string,
// 	newImage: { url: string; public_id: string },
// 	imageType: 'profile' | 'cover',
// ) => {
// 	const business: any = await prisma.business.findUnique({
// 		where: { id: businessId },
// 		select: { profileImage: true, coverImage: true },
// 	})

// 	if (imageType === 'profile' && business?.profileImage) {
// 		// Remove previous profile image from Cloudinary
// 		await removeImageFromCloudinary(business.profileImage.public_id)
// 	} else if (imageType === 'cover' && business?.coverImage) {
// 		// Remove previous cover image from Cloudinary
// 		await removeImageFromCloudinary(business.coverImage.public_id)
// 	}

// 	// Update with the new image object
// 	await prisma.business.update({
// 		where: { id: businessId },
// 		data: {
// 			[imageType === 'profile' ? 'profileImage' : 'coverImage']: newImage,
// 		},
// 	})
// 	return newImage
// }

// // Function to push a new image into the tour's images array
// const updateTourImages = async (
// 	tourId: string,
// 	newImage: { url: string; public_id: string },
// ) => {
// 	await prisma.tour.update({
// 		where: { id: tourId },
// 		data: {
// 			images: {
// 				push: newImage, // Add new image to the array
// 			},
// 		},
// 	})
// }

// // Function to remove an image from Cloudinary using its public_id
// const removeImageFromCloudinary = async (public_id: string) => {
// 	// Logic to remove the image from Cloudinary based on the public_id
// 	await cloudinary.v2.uploader.destroy(public_id)
// }

// export async function POST(request: NextRequest) {
// 	try {
// 		const userData: any = await getUserData()

// 		// Ensure user is logged in
// 		if (!userData?.id) {
// 			return NextResponse.json(
// 				{ message: 'User not authenticated' },
// 				{ status: 401 },
// 			)
// 		}

// 		// Extract the type and ID from the request URL
// 		const { searchParams } = new URL(request.url)
// 		const type = searchParams.get('type') // 'user', 'business', or 'tour'
// 		const id = searchParams.get('id')
// 		const imageType = searchParams.get('imageType') // 'profile' or 'cover' for businesses
// 		console.log('searchParams', request.url, searchParams)
// 		if (!type || !id) {
// 			return NextResponse.json(
// 				{ message: 'Type and ID are required' },
// 				{ status: 400 },
// 			)
// 		}

// 		// Extract the file from the request body
// 		const formData = await request.formData()
// 		const file = formData.get('file') as Blob

// 		if (!file) {
// 			return NextResponse.json(
// 				{ message: 'Image file is required' },
// 				{ status: 400 },
// 			)
// 		}

// 		// Upload the image
// 		const newImage = await uploadImage(file)
// 		let resData = null
// 		// Handle image updates based on the type
// 		if (type === 'user') {
// 			// Update the user's profile image and remove the previous one
// 			const userProfileImage = await updateUserProfileImage(
// 				userData.id,
// 				newImage,
// 			)
// 			return NextResponse.json(userProfileImage, { status: 200 })
// 		} else if (type === 'business') {
// 			// Update business profile/cover image and remove the previous one
// 			if (!imageType) {
// 				return NextResponse.json(
// 					{ message: 'Image type (profile or cover) is required for business' },
// 					{ status: 400 },
// 				)
// 			}
// 			const businessImage = await updateBusinessImage(
// 				id,
// 				newImage,
// 				imageType as 'profile' | 'cover',
// 			)
// 			// resData = businessImage
// 			return NextResponse.json(businessImage, { status: 200 })
// 		} else if (type === 'tour') {
// 			// Push new image to the tour's images array
// 			await updateTourImages(id, newImage)
// 		} else {
// 			return NextResponse.json(
// 				{ message: 'Invalid type provided' },
// 				{ status: 400 },
// 			)
// 		}
// 	} catch (error) {
// 		console.error(error)
// 		return NextResponse.json(
// 			{ message: 'An error occurred during the upload.' },
// 			{ status: 500 },
// 		)
// 	}
// }

// export async function OPTIONS(request: NextRequest) {
// 	return NextResponse.json({}, { status: 200 })
// }

// export const runtime = 'nodejs'
