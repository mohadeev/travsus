import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import authOptions from '../auth/[...nextauth]/authOptions'
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
	try {
		// Check authentication
		const session = await getServerSession(authOptions)
		if (!session || !session.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Get user from session
		const user = await prisma.user.findUnique({
			where: { email: session.user.email as string },
		})

		if (!user) {
			return NextResponse.json({ error: 'User not found' }, { status: 404 })
		}

		// Parse form data
		const formData = await req.formData()
		const serviceId = formData.get('serviceId') as string
		const rating = Number.parseInt(formData.get('rating') as string)
		const travelDate = formData.get('travelDate') as string
		const travelType = formData.get('travelType') as string
		const reviewText = formData.get('reviewText') as string
		const reviewTitle = formData.get('reviewTitle') as string
		const isAgreed = formData.get('isAgreed') === 'true'

		// Validate required fields
		if (
			!serviceId ||
			!rating ||
			!travelDate ||
			!travelType ||
			!reviewText ||
			!reviewTitle ||
			!isAgreed
		) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 },
			)
		}

		// Find the tour
		const tour = await prisma.tour.findUnique({
			where: { id: serviceId },
		})

		if (!tour) {
			return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
		}

		// Handle image uploads
		const imageUrls: string[] = []
		const images = formData.getAll('images') as File[]

		// Upload images to Cloudinary
		if (images.length > 0) {
			try {
				for (const image of images) {
					const formData = new FormData()
					formData.append('file', image)
					formData.append(
						'upload_preset',
						process.env.CLOUDINARY_UPLOAD_PRESET || '',
					)

					const response = await fetch(
						`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
						{
							method: 'POST',
							body: formData,
						},
					)

					if (!response.ok) {
						throw new Error(`Failed to upload image: ${response.statusText}`)
					}

					const data = await response.json()
					imageUrls.push(data.secure_url)
				}
			} catch (error) {
				console.error('Error uploading images:', error)
				// Continue with the review creation even if image upload fails
			}
		}

		// Create the review
		const newReview = {
			id: Math.random().toString(36).substring(2, 15),
			userId: user.id,
			userName: user.name || user.username || user.email,
			userImage: user.profileImage ? (user.profileImage as any).url : null,
			rating,
			title: reviewTitle,
			content: reviewText,
			travelDate,
			travelType,
			images: imageUrls,
			createdAt: new Date().toISOString(),
		}

		// Update the tour with the new review
		// Note: This assumes your Tour model has a reviews field that is a JSON array
		const updatedTour = await prisma.tour.update({
			where: { id: serviceId },
			data: {
				reviews: {
					push: newReview,
				},
			},
		})

		return NextResponse.json({ success: true, review: newReview })
	} catch (error) {
		console.error('Error creating review:', error)
		return NextResponse.json(
			{ error: 'Failed to create review' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}

export async function GET(req: NextRequest) {
	try {
		const url = new URL(req.url)
		const serviceId = url.searchParams.get('serviceId')

		if (!serviceId) {
			return NextResponse.json(
				{ error: 'Service ID is required' },
				{ status: 400 },
			)
		}

		const tour = await prisma.tour.findUnique({
			where: { id: serviceId },
			select: { reviews: true },
		})

		if (!tour) {
			return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
		}

		return NextResponse.json({ reviews: tour.reviews })
	} catch (error) {
		console.error('Error fetching reviews:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch reviews' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
