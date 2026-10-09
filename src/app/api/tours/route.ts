export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { db, T, must } from '@/lib/db'

// GET /api/tours - Get all tours
export async function GET() {
	try {
		const tours: any[] = must(
			await db
				.from(T.tours)
				.select(
					`*, nameContent:${T.translatableContents}!nameContentId(*, translations:${T.translatedTexts}(languageCode))`,
				)
				.order('createdAt', { ascending: false }),
		)

		const toursWithLanguages = tours.map((tour) => {
			const languages: string[] =
				tour.nameContent?.translations?.map((t: any) => t.languageCode) ?? []
			return {
				...tour,
				availableLanguages: [...new Set(languages)],
				translationCount: languages.length,
			}
		})

		return NextResponse.json({ tours: toursWithLanguages })
	} catch (error) {
		console.error('Error fetching tours:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch tours' },
			{ status: 500 },
		)
	}
}
