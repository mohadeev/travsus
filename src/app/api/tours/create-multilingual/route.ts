export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from 'next/server'
import { db, T, must, touch, withMeta, EMPTY_TOUR_LISTS } from '@/lib/db'
import { currentUser } from '@/lib/guards'
import { createTranslatableContent } from '@/lib/translations'

const FIELDS = ['name', 'subtitle', 'overview', 'conclusion'] as const

// POST /api/tours/create-multilingual - Create tour with translations
export async function POST(request: NextRequest) {
	try {
		const user = await currentUser()
		if (!user) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
		}

		const { translations, defaultLanguage = 'en-US', businessId } =
			await request.json()

		// A business can only be attached if the user owns it
		let ownBusinessId: string | null = null
		if (businessId) {
			const business = must(
				await db
					.from(T.businesses)
					.select('id')
					.match({ id: businessId, creatorId: user.id })
					.maybeSingle(),
			)
			ownBusinessId = business?.id ?? null
		}

		const defaultTranslation: any =
			translations[defaultLanguage] || Object.values(translations)[0]

		const tour = must(
			await db
				.from(T.tours)
				.insert(
					withMeta({
						...EMPTY_TOUR_LISTS,
						creatorId: user.id,
						businessId: ownBusinessId,
						lang: defaultLanguage,
						name: defaultTranslation.name,
						subtitle: defaultTranslation.subtitle,
						overview: defaultTranslation.overview,
						conclusion: defaultTranslation.conclusion,
					}),
				)
				.select('id')
				.single(),
		)

		// One translatable content per field, with a text per language
		const contentIds: Record<string, string> = {}
		for (const field of FIELDS) {
			const texts = Object.entries<any>(translations)
				.filter(([, t]) => t[field])
				.map(([languageCode, t]) => ({ languageCode, text: t[field] }))

			if (texts.length > 0) {
				contentIds[`${field}ContentId`] = await createTranslatableContent(
					`tour_${field}`,
					tour.id,
					texts,
				)
			}
		}

		const updatedTour = must(
			await db
				.from(T.tours)
				.update(touch(contentIds))
				.eq('id', tour.id)
				.select('*')
				.single(),
		)

		return NextResponse.json({ tour: updatedTour })
	} catch (error) {
		console.error('Error creating multilingual tour:', error)
		return NextResponse.json(
			{ error: 'Failed to create tour' },
			{ status: 500 },
		)
	}
}
