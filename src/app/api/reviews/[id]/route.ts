import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function extractLanguageFromRequest(request: NextRequest): string {
	// Try to get language from query parameter first
	const url = new URL(request.url)
	const langQuery = url.searchParams.get('lang')

	if (langQuery) {
		return langQuery
	}

	// Try to get language from Accept-Language header
	const acceptLanguage = request.headers.get('accept-language')
	if (acceptLanguage) {
		// Get the first language from the header (e.g., "en-US,en;q=0.9" -> "en-US")
		const firstLanguage = acceptLanguage.split(',')[0].trim()
		return firstLanguage
	}

	// Default fallback
	return 'en-US'
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { travelDate } = await request.json()
		const language = extractLanguageFromRequest(request)

		console.log('[Review Update] Requested language:', language)

		const updatedReview = await prisma.review.update({
			where: { id: params.id },
			data: { travelDate1: new Date(travelDate) },
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
		})

		console.log('[Review Update] Updated review:', updatedReview.id)
		console.log(
			'[Review Update] Review titleContent:',
			updatedReview.titleContent,
		)
		console.log(
			'[Review Update] Review contentContent:',
			updatedReview.contentContent,
		)

		let translatedTitle = updatedReview.title
		let translatedContent = updatedReview.content

		// Check if titleContent exists and has translations
		if (updatedReview.titleContent?.translations?.length > 0) {
			translatedTitle = updatedReview.titleContent.translations[0].text
			console.log(
				'[Review Update] Using translated title for review',
				updatedReview.id,
			)
		} else {
			console.log(
				'[Review Update] Using original title for review',
				updatedReview.id,
				'- no translations found',
			)
		}

		// Check if contentContent exists and has translations
		if (updatedReview.contentContent?.translations?.length > 0) {
			translatedContent = updatedReview.contentContent.translations[0].text
			console.log(
				'[Review Update] Using translated content for review',
				updatedReview.id,
			)
		} else {
			console.log(
				'[Review Update] Using original content for review',
				updatedReview.id,
				'- no translations found',
			)
		}

		const translatedReview = {
			...updatedReview,
			title: translatedTitle,
			content: translatedContent,
			language: language,
			// Remove the translation objects from response to keep it clean
			titleContent: undefined,
			contentContent: undefined,
		}

		return NextResponse.json({ success: true, review: translatedReview })
	} catch (error) {
		console.error('Error updating review:', error)
		return NextResponse.json(
			{ error: 'Failed to update review' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
