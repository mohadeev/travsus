import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import authOptions from '../auth/[...nextauth]/authOptions'
import extractLanguageFromRequest from '../listing/get/getTourData/extractLanguageFromRequest'

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
		const tourId = formData.get('serviceId') as string
		const rating = Number.parseInt(formData.get('rating') as string)
		const travelDate1 = formData.get('travelDate1') as string
		const travelType = formData.get('travelType') as string
		const reviewText = formData.get('reviewText') as string
		const reviewTitle = formData.get('reviewTitle') as string
		const isAgreed = formData.get('isAgreed') === 'true'

		// Validate required fields
		if (
			!tourId ||
			!rating ||
			!travelDate1 ||
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
			where: { id: tourId },
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

		// Create translatable content for title and content
		const titleContent = await prisma.translatableContent.create({
			data: {
				contentType: 'review_title',
				entityId: tourId,
				translations: {
					create: {
						languageCode: 'en-US', // Default language
						text: reviewTitle,
					},
				},
			},
		})

		const contentContent = await prisma.translatableContent.create({
			data: {
				contentType: 'review_content',
				entityId: tourId,
				translations: {
					create: {
						languageCode: 'en-US', // Default language
						text: reviewText,
					},
				},
			},
		})

		// Create the review using the new Review model
		const review = await prisma.review.create({
			data: {
				tourId,
				userId: user.id,
				rating,
				travelDate1: new Date(travelDate1),
				travelType,
				title: reviewTitle, // Keep original for fallback
				content: reviewText, // Keep original for fallback
				titleContentId: titleContent.id,
				contentContentId: contentContent.id,
				images: imageUrls,
				isVerified: isAgreed,
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						username: true,
						email: true,
						profileImage: true,
					},
				},
			},
		})

		// Format the response to match your frontend expectations
		const formattedReview = {
			id: review.id,
			userId: review.userId,
			userName: review.user.name || review.user.username || review.user.email,
			userImage: review.user.profileImage
				? (review.user.profileImage as any).url
				: null,
			rating: review.rating,
			title: review.title,
			content: review.content,
			travelDate1: review.travelDate1,
			travelType: review.travelType,
			images: review.images,
			createdAt: review.createdAt.toISOString(),
			updatedAt: review.updatedAt.toISOString(),
		}

		return NextResponse.json({ success: true, review: formattedReview })
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
		const tourId = url.searchParams.get('serviceId')
		const includeUser = true
		const languageCode = url.searchParams.get('language') || 'en-US'

		if (!tourId) {
			return NextResponse.json(
				{ error: 'Tour ID is required' },
				{ status: 400 },
			)
		}

		// Check if tour exists
		const tourExists = await prisma.tour.findUnique({
			where: { id: tourId },
			select: { id: true },
		})

		if (!tourExists) {
			return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
		}

		// Fetch reviews with optional user data and translations
		const language = extractLanguageFromRequest(req)

		console.log('[v0] Requested language:', language)

		const reviews = await prisma.review.findMany({
			where: { tourId: '680bc6a5aa6f43072c7700f6' },
			take: 10,
			include: {
				user: {
					select: {
						accountData: true,
						profileImage: true,
					},
				},
				titleContent: {
					include: {
						translations: {
							where: {
								languageCode: language,
							},
						},
					},
				},
				contentContent: {
					include: {
						translations: {
							where: {
								languageCode: language,
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		console.log('[v0] Found reviews:', reviews.length)
		console.log('[v0] First review titleContent:', reviews[0]?.titleContent)
		console.log('[v0] First review contentContent:', reviews[0]?.contentContent)

		const translatedReviews = reviews.map((review) => {
			let translatedTitle = review.title
			let translatedContent = review.content

			// Check if titleContent exists and has translations
			if (review.titleContent?.translations?.length > 0) {
				translatedTitle = review.titleContent.translations[0].text
				console.log('[v0] Using translated title for review', review.id)
			} else {
				console.log(
					'[v0] Using original title for review',
					review.id,
					'- no translations found',
				)
			}

			// Check if contentContent exists and has translations
			if (review.contentContent?.translations?.length > 0) {
				translatedContent = review.contentContent.translations[0].text
				console.log('[v0] Using translated content for review', review.id)
			} else {
				console.log(
					'[v0] Using original content for review',
					review.id,
					'- no translations found',
				)
			}

			return {
				...review,
				title: translatedTitle,
				content: translatedContent,
				language: language,
				// Remove the translation objects from response to keep it clean
				titleContent: undefined,
				contentContent: undefined,
			}
		})
		// console.log(translatedReviews[0])
		return NextResponse.json({ reviews: translatedReviews })
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
