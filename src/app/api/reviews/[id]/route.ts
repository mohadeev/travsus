export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from 'next/server'
import { db, T, must, touch } from '@/lib/db'
import { canEdit, currentUser } from '@/lib/guards'
import { REVIEW_SELECT, localizeReview } from '@/lib/reviews'

function extractLanguageFromRequest(request: NextRequest): string {
	// ?lang= first, then the first Accept-Language entry, then en-US
	const langQuery = new URL(request.url).searchParams.get('lang')
	if (langQuery) return langQuery

	const acceptLanguage = request.headers.get('accept-language')
	if (acceptLanguage) return acceptLanguage.split(',')[0].trim()

	return 'en-US'
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const existing = must(
			await db.from(T.reviews).select('userId').eq('id', params.id).maybeSingle(),
		)
		if (!existing) {
			return NextResponse.json({ error: 'Review not found' }, { status: 404 })
		}
		if (!canEdit(await currentUser(), existing.userId)) {
			return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
		}

		const { travelDate } = await request.json()
		const language = extractLanguageFromRequest(request)

		const updatedReview = must(
			await db
				.from(T.reviews)
				.update(touch({ travelDate1: new Date(travelDate).toISOString() }))
				.eq('id', params.id)
				.select(REVIEW_SELECT)
				.single(),
		)

		return NextResponse.json({
			success: true,
			review: localizeReview(updatedReview, language),
		})
	} catch (error) {
		console.error('Error updating review:', error)
		return NextResponse.json(
			{ error: 'Failed to update review' },
			{ status: 500 },
		)
	}
}
