export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from 'next/server'
import extractLanguageFromRequest from '../getTourData/extractLanguageFromRequest'
import { getTourCatalog, cardPricing, toCard } from '@/lib/tourCatalog'

const MAX_RELATED = 20

// Related tours = other tours with the same number of days.
// Reads the shared cached tour list; only the prices of the shown tours come from the database.
export async function GET(request: NextRequest) {
	try {
		const id = new URL(request.url).searchParams.get('id')
		const language = extractLanguageFromRequest(request)

		const catalog = await getTourCatalog()
		const daysNumber = catalog.find((t) => t.id === id)?.dayCount || 3

		const related = catalog.filter((t) => t.id !== id && t.dayCount === daysNumber).slice(0, MAX_RELATED)
		const pricing = await cardPricing(related.map((t) => t.id))

		return NextResponse.json({ allToursData: related.map((t) => toCard(t, language, pricing.get(t.id))), days: daysNumber })
	} catch (error: any) {
		console.error('Related tours error:', error)
		return NextResponse.json({ error: 'Failed to load related tours' }, { status: 500 })
	}
}
