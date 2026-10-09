export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from 'next/server'
import extractLanguageFromRequest from '../../listing/get/getTourData/extractLanguageFromRequest'
import { db, T, must } from '@/lib/db'
import { REVIEW_SELECT, localizeReview } from '@/lib/reviews'

// Home page testimonials come from this tour's reviews
const TESTIMONIALS_TOUR_ID = '680bc6a5aa6f43072c7700f6'

export async function GET(request: NextRequest) {
	try {
		const language = extractLanguageFromRequest(request)

		const reviews = must(
			await db
				.from(T.reviews)
				.select(REVIEW_SELECT)
				.eq('tourId', TESTIMONIALS_TOUR_ID)
				.order('createdAt', { ascending: false })
				.limit(10),
		)

		return NextResponse.json((reviews ?? []).map((r) => localizeReview(r, language)))
	} catch (error) {
		console.error('Error fetching translated reviews:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch translated reviews' },
			{ status: 500 },
		)
	}
}
