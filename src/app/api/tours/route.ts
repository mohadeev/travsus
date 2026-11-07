export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { unstable_cache } from '@/lib/stableCache'
import { db, T, must } from '@/lib/db'
import { TOURS_TAG } from '@/lib/tourCatalog'

const DEFAULT_LIMIT = 50
const MAX_LIMIT = 100

export type TourListItem = {
	id: string
	name: string
	subtitle: string
	availableLanguages: string[]
	translationCount: number
}

/**
 * Every tour with the languages its name is translated into, newest first.
 * Only what the tours list shows (the full tours made this answer ~9.5 MB).
 * Cached for 10 minutes; saving a tour clears it (TOURS_TAG).
 */
const listTours = unstable_cache(
	async (): Promise<TourListItem[]> => {
		const tours: any[] = must(
			await db
				.from(T.tours)
				.select(`id, name, subtitle, createdAt, nameContentId, nameContent:${T.translatableContents}!nameContentId(id, translations:${T.translatedTexts}(languageCode))`)
				.order('createdAt', { ascending: false }),
		)
		return tours.map((tour) => {
			const languages: string[] = tour.nameContent?.translations?.map((t: any) => t.languageCode) ?? []
			return {
				id: tour.id,
				name: tour.name ?? '',
				subtitle: tour.subtitle ?? '',
				availableLanguages: Array.from(new Set(languages)),
				translationCount: languages.length,
			}
		})
	},
	['api-tours-list-v1'],
	{ revalidate: 600, tags: [TOURS_TAG] },
)

// GET /api/tours?page=1&limit=50 - Tours, one page at a time
export async function GET(request: Request) {
	try {
		const params = new URL(request.url).searchParams
		const page = Math.max(1, Math.floor(Number(params.get('page')) || 1))
		const limit = Math.min(MAX_LIMIT, Math.max(1, Math.floor(Number(params.get('limit')) || DEFAULT_LIMIT)))

		const all = await listTours()
		const tours = all.slice((page - 1) * limit, page * limit)

		return NextResponse.json(
			{ tours, page, limit, total: all.length, hasMore: page * limit < all.length },
			{ headers: { 'Cache-Control': 'private, no-cache' } },
		)
	} catch (error) {
		console.error('Error fetching tours:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch tours' },
			{ status: 500 },
		)
	}
}
