export const dynamic = "force-dynamic";
import { db, T, must } from '@/lib/db'
import { GEO_CONTENT, inLanguage, keepTranslations } from '@/lib/geo'
import { NextResponse } from 'next/server'

function extractLanguageFromRequest(request: Request): string {
	const referer = request.headers.get('referer') || ''
	const origin = request.headers.get('origin') || ''

	// Try to extract language from referer URL
	const urlToCheck = referer || origin
	const languageMatch = urlToCheck.match(/\/([a-z]{2}-[A-Z]{2})(?:\/|$)/)

	return languageMatch ? languageMatch[1] : 'en-US'
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const cityId = searchParams.get('cityId')

		if (!cityId) {
			return NextResponse.json(
				{ error: 'City ID is required' },
				{ status: 400 },
			)
		}

		const detectedLanguage = extractLanguageFromRequest(request)

		const cityRow: any = must(
			await db.from(T.cities).select(`*, ${GEO_CONTENT}`).eq('id', cityId).maybeSingle(),
		)

		if (!cityRow) {
			return NextResponse.json({
				message: 'No city found with that ID',
				found: false,
				data: [],
			})
		}

		const city: any = inLanguage(cityRow, detectedLanguage)
		const foundCityName = city.content?.translations[0]?.text || 'Unknown City'

		const placeRows: any[] =
			must(await db.from(T.places).select(`*, ${GEO_CONTENT}`).eq('cityId', city.id)) ?? []

		// Visitor's language when any place has it, otherwise English for all
		const hasLanguage = placeRows.some((p) =>
			p.content?.translations?.some((t: any) => t.language === detectedLanguage),
		)
		const placesLanguage = hasLanguage ? detectedLanguage : 'en-US'
		const places = placeRows.map((p) =>
			keepTranslations(p, (t) => t.language === placesLanguage),
		)

		// Transform the places data for the frontend
		const placesData = places.map((place) => {
			// Find name and description from translations
			const nameTranslation = place.content?.translations.find(
				(t: any) => t.type === 'name',
			)
			const descriptionTranslation = place.content?.translations.find(
				(t: any) => t.type === 'description',
			)

			return {
				id: place.id,
				name: nameTranslation?.text || 'Unnamed Place',
				title: nameTranslation?.text || 'Unnamed Place',
				description: descriptionTranslation?.text || '',
				image: place.image?.uploadFrom || place.image?.url,
				coordinates: place.geo,
				address: place.address,
				type: place.type,
				category: place.category,
				subcategory: place.subcategory,
				tags: place.tags,
				rating: place.rating,
				website: place.website,
				phone: place.phone,
				cityId: place.cityId,
				countryId: place.countryId,
			}
		})

		// Group places by category for better organization
		const placesByCategory: Record<string, any[]> = {}

		placesData.forEach((place) => {
			const category = place.category || 'other'

			if (!placesByCategory[category]) {
				placesByCategory[category] = []
			}

			placesByCategory[category].push(place)
		})

		return NextResponse.json({
			message: `Places in ${foundCityName} found successfully`,
			found: true,
			city: {
				id: city.id,
				name: foundCityName,
				image: city.image?.uploadFrom || city.image?.url,
				coordinates: city.geo,
			},
			data: placesData,
			categorized: placesByCategory,
			totalCount: places.length,
			language: detectedLanguage,
			languageAvailable:
				(city.content?.translations?.length ?? 0) > 0 &&
				places.some((p) => p.content?.translations?.length > 0),
		})
	} catch (error: any) {
		console.error(
			'❌ Error fetching places by city ID:',
			error?.message || error,
		)
		return NextResponse.json(
			{
				message: 'Internal Server Error',
				found: false,
				error: error?.message || 'Unknown error',
			},
			{ status: 500 },
		)
	}
}
