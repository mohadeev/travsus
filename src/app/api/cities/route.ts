export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { db, T, must } from '@/lib/db'
import { GEO_CONTENT, hasImage, inLanguage, languageFromReferer } from '@/lib/geo'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const countryId = searchParams.get('countryId')
		const limit = Number.parseInt(searchParams.get('limit') || '16')

		if (!countryId) {
			return NextResponse.json(
				{ error: 'Country ID is required' },
				{ status: 400 },
			)
		}

		const language = languageFromReferer(request)

		const cities: any[] =
			must(
				await db
					.from(T.cities)
					.select(`*, ${GEO_CONTENT}, country:${T.countries}(code3)`)
					.eq('countryId', countryId)
					.not('image', 'is', null)
					.limit(limit),
			) ?? []

		const languageAvailable = cities.some((city) =>
			city.content?.translations?.some((t: any) => t.language === language),
		)

		// Only cities with a usable image, translated (en-US fallback)
		const citiesWithImages = cities
			.filter((city) => hasImage(city.image))
			.map((city) => inLanguage(city, language))

		return NextResponse.json({
			cities: citiesWithImages,
			total: citiesWithImages.length,
			countryId,
			language,
			languageAvailable,
			fallbackUsed: !languageAvailable && language !== 'en-US',
		})
	} catch (error) {
		console.error('Error fetching cities:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch cities' },
			{ status: 500 },
		)
	}
}
