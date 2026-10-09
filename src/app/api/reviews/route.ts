export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import extractLanguageFromRequest from '../listing/get/getTourData/extractLanguageFromRequest'
import { db, T, must, withMeta, asDate } from '@/lib/db'
import { createTranslatableContent } from '@/lib/translations'
import { REVIEW_SELECT, localizeReview } from '@/lib/reviews'

export async function POST(req: NextRequest) {
	try {
		// Check authentication
		const session = await getSession()
		if (!session || !session.user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		// Get user from session
		const user = must(
			await db
				.from(T.users)
				.select('id')
				.eq('email', session.user.email as string)
				.maybeSingle(),
		)

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
		const tour = must(await db.from(T.tours).select('id').eq('id', tourId).maybeSingle())

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
				// Continue with the review creation even if image upload fails
			}
		}

		// Create translatable content for title and content
		// Title and text are stored as translatable content (en-US first)
		const titleContentId = await createTranslatableContent('review_title', tourId, [
			{ languageCode: 'en-US', text: reviewTitle },
		])
		const contentContentId = await createTranslatableContent(
			'review_content',
			tourId,
			[{ languageCode: 'en-US', text: reviewText }],
		)

		const review: any = must(
			await db
				.from(T.reviews)
				.insert(
					withMeta({
						tourId,
						userId: user.id,
						rating,
						travelDate1: new Date(travelDate1).toISOString(),
						travelType,
						title: reviewTitle, // Kept as fallback
						content: reviewText, // Kept as fallback
						titleContentId,
						contentContentId,
						images: imageUrls,
						isVerified: isAgreed,
					}),
				)
				.select(`*, user:${T.users}(id, name, username, email, profileImage)`)
				.single(),
		)

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
			createdAt: asDate(review.createdAt)?.toISOString(),
			updatedAt: asDate(review.updatedAt)?.toISOString(),
		}

		return NextResponse.json({ success: true, review: formattedReview })
	} catch (error) {
		console.error('Error creating review:', error)
		return NextResponse.json(
			{ error: 'Failed to create review' },
			{ status: 500 },
		)
	}
}

export async function GET(req: NextRequest) {
	try {
		const tourId = new URL(req.url).searchParams.get('serviceId')

		if (!tourId) {
			return NextResponse.json(
				{ error: 'Tour ID is required' },
				{ status: 400 },
			)
		}

		const tourExists = must(
			await db.from(T.tours).select('id').eq('id', tourId).maybeSingle(),
		)
		if (!tourExists) {
			return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
		}

		const language = extractLanguageFromRequest(req)
		const reviews = must(
			await db
				.from(T.reviews)
				.select(REVIEW_SELECT)
				.eq('tourId', tourId)
				.order('createdAt', { ascending: false })
				.limit(10),
		)

		return NextResponse.json({
			reviews: (reviews ?? []).map((r) => localizeReview(r, language)),
		})
	} catch (error) {
		return NextResponse.json(
			{ error: 'Failed to fetch reviews' },
			{ status: 500 },
		)
	}
}
