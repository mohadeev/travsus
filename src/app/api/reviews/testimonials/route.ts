export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import extractLanguageFromRequest from '../../listing/get/getTourData/extractLanguageFromRequest'
// import extractLanguageFromRequest from '../../(client-components)../extractLanguageFromRequest'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
	try {
		const language = extractLanguageFromRequest(request)

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
		return NextResponse.json(translatedReviews)
	} catch (error) {
		console.error('Error fetching translated reviews:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch translated reviews' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
