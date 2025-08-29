import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import { placesClient } from '@/lib/prisma'
import { slugify } from 'transliteration'
import { getTranslations } from 'next-intl/server'
import extractLanguageFromRequest from '../getTourData/extractLanguageFromRequest'
// import extractLanguageFromRequest from './extractLanguageFromRequest'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id')
		if (!id) {
			return NextResponse.json(
				{ message: 'Tour ID is required' },
				{ status: 400 },
			)
		}

		const languageCode = extractLanguageFromRequest(request)
		// Use namespaced translations
		const t = await getTranslations({
			locale: languageCode,
			namespace: 'Jan03_TourHeader_x9k2',
		})

		// Fetch tour with days and city/country/continent info
		const tour = await prisma.tour.findUnique({
			where: { id },
			include: {
				days: {
					include: {
						city: {
							include: {
								country: {
									include: { continent: true },
								},
								province: true,
							},
						},
					},
				},
				nameContent: {
					include: {
						translations: {
							where: { languageCode },
						},
					},
				},
			},
		})

		if (!tour) {
			return NextResponse.json({ message: 'Tour not found' }, { status: 404 })
		}

		const day = tour.days[0]
		if (!day || !day.city || !day.city.country || !day.city.province) {
			return NextResponse.json(
				{ message: 'Tour day/city data incomplete' },
				{ status: 400 },
			)
		}

		// Translated tour title
		const translatedTitle = tour.nameContent?.translations[0]?.text || tour.name

		// Build slugified URL like ExperiencesCard
		const locale = languageCode
		const href = slugify(
			`${locale}/${slugify(day.city.country.continent.name)}/${slugify(day.city.country.name)}/${slugify(day.city.province.name)}/${slugify(day.city.name)}/${slugify(t('things_to_do_slug'))}/${slugify(t('tours'))}/${slugify(translatedTitle)}/${id}/q=tour}`,
		)

		return NextResponse.json({ link: href })
	} catch (error) {
		console.error('Error generating tour link:', error)
		return NextResponse.json(
			{
				message: 'Error generating tour link',
				error: error instanceof Error ? error.message : 'Unknown',
			},
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
		await placesClient.$disconnect()
	}
}
