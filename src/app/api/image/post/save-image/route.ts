export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { db, T, must, touch } from '@/lib/db'
import { canEdit } from '@/lib/guards'
import getUserData from '@/app/api/user/getUserData'
import cloudinary from '@/utils/cloudinary'

// Function to update user's profile image and remove the previous one
const updateUserProfileImage = async (
	userId: string,
	newImage: { url: string; public_id: string },
) => {
	const user: any = must(
		await db.from(T.users).select('profileImage').eq('id', userId).maybeSingle(),
	)

	if (user?.profileImage) {
		// Remove previous image from Cloudinary if exists
		await removeImageFromCloudinary(user?.profileImage?.public_id)
	}

	must(await db.from(T.users).update(touch({ profileImage: newImage })).eq('id', userId))
	return newImage
}

// Function to update business's profile/cover image and remove the previous one
const updateBusinessImage = async (
	business: any,
	newImage: { url: string; public_id: string },
	imageType: 'profile' | 'cover',
) => {

	if (imageType === 'profile' && business?.profileImage) {
		// Remove previous profile image from Cloudinary
		await removeImageFromCloudinary(business.profileImage.public_id)
	} else if (imageType === 'cover' && business?.coverImage) {
		// Remove previous cover image from Cloudinary
		await removeImageFromCloudinary(business.coverImage.public_id)
	}

	must(
		await db
			.from(T.businesses)
			.update(
				touch({ [imageType === 'profile' ? 'profileImage' : 'coverImage']: newImage }),
			)
			.eq('id', business.id),
	)
	return newImage
}

// Function to push a new image into the tour's images array
const updateTourImages = async (
	tour: any,
	newImage: { url: string; public_id: string },
) => {
	must(
		await db
			.from(T.tours)
			.update(touch({ images: [...(tour.images ?? []), newImage] }))
			.eq('id', tour.id),
	)
}

// Function to remove an image from Cloudinary using its public_id
const removeImageFromCloudinary = async (public_id: string) => {
	await cloudinary.v2.uploader.destroy(public_id)
}

export async function POST(request: NextRequest) {
	console.log('POST request received')
	try {
		const userData: any = await getUserData()

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
			const business = must(
				await db
					.from(T.businesses)
					.select('id, creatorId, profileImage, coverImage')
					.eq('id', id)
					.maybeSingle(),
			)
			if (!business || !canEdit(userData, business.creatorId)) {
				return NextResponse.json({ message: 'Business not found' }, { status: 404 })
			}
			const businessImage = await updateBusinessImage(
				business,
				newImage,
				imageType as 'profile' | 'cover',
			)
			console.log('Business image updated:', businessImage)
			return NextResponse.json(businessImage, { status: 200 })
		} else if (type === 'tour') {
			console.log('Updating tour images')
			// Push new image to the tour's images array
			const tour = must(
				await db.from(T.tours).select('id, creatorId, images').eq('id', id).maybeSingle(),
			)
			if (!tour || !canEdit(userData, tour.creatorId)) {
				return NextResponse.json({ message: 'Tour not found' }, { status: 404 })
			}
			await updateTourImages(tour, newImage)
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
