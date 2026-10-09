export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import extractLanguageFromRequest from '../getTourData/extractLanguageFromRequest'
import { db, T, must } from '@/lib/db'

const MAX_RELATED = 20

// Related tours = other tours with the same number of days
export async function GET(request: Request) {
	try {
		const id = new URL(request.url).searchParams.get('id')
		const language = extractLanguageFromRequest(request)

		const tour = id
			? must(await db.from(T.tours).select('days').eq('id', id).maybeSingle())
			: null
		const daysNumber = Array.isArray(tour?.days) ? tour.days.length : 3

		const allTours: any[] = must(await db.from(T.tours).select('*')) ?? []

		const relatedTours = allTours
			.filter((t) => t.id !== id && Array.isArray(t.days) && t.days.length === daysNumber)
			.slice(0, MAX_RELATED)
			.map((t) => ({
				...t,
				...(t.translations ?? []).find((trns: any) => trns.language === language),
			}))

		return NextResponse.json({ allToursData: relatedTours, days: daysNumber })
	} catch (error: any) {
		console.error('Search error:', error)
		return NextResponse.json(
			{ error: 'Failed to search tours' },
			{ status: 500 },
		)
	}
}
