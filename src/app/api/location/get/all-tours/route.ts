export const dynamic = 'force-dynamic'

import { type NextRequest, NextResponse } from 'next/server'
import extractLanguageFromRequest from '@/app/api/listing/get/getTourData/extractLanguageFromRequest'
import { getTourCatalog, cardPricing, toCard } from '@/lib/tourCatalog'

// Tours with photos, newest first, one page at a time.
// Reads the shared cached tour list; only the prices of the page's tours come from the database.
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = request.nextUrl
		const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1') || 1)
		const limit = Math.min(50, Math.max(1, Number.parseInt(searchParams.get('limit') || '8') || 8))
		const language = extractLanguageFromRequest(request)

		const catalog = await getTourCatalog()
		const pageTours = catalog.slice((page - 1) * limit, page * limit)
		const pricing = await cardPricing(pageTours.map((t) => t.id))

		return NextResponse.json({
			allToursData: pageTours.map((t) => toCard(t, language, pricing.get(t.id))),
			totalTours: catalog.length,
			page,
			totalPages: Math.ceil(catalog.length / limit),
			language,
		})
	} catch (error) {
		console.error('All tours error:', error)
		return NextResponse.json(
			{ message: 'Error fetching tour data', error: error instanceof Error ? error.message : 'Unknown error' },
			{ status: 500 },
		)
	}
}
