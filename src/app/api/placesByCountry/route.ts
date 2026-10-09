export const dynamic = "force-dynamic";
import { db, T, must } from '@/lib/db'
import { GEO_CONTENT, keepTranslations } from '@/lib/geo'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const countryId = searchParams.get('countryId')
		const limit = searchParams.get('limit')
			? parseInt(searchParams.get('limit')!)
			: 50

		if (!countryId) {
			return NextResponse.json(
				{ error: 'Country code is required' },
				{ status: 400 },
			)
		}

		const english = (row: any) => keepTranslations(row, (t) => t.language === 'en-US')

		const countryRow = must(
			await db.from(T.countries).select(`*, ${GEO_CONTENT}`).eq('id', countryId).maybeSingle(),
		)

		if (!countryRow) {
			return NextResponse.json({
				message: `No country found with code: ${countryId}`,
				found: false,
				data: [],
			})
		}

		const country: any = english(countryRow)
		const countryName = country.content?.translations[0]?.text || countryId

		// Up to 100 cities in this country
		const cities: any[] =
			must(await db.from(T.cities).select('id').eq('countryId', country.id).limit(100)) ?? []

		if (cities.length === 0) {
			return NextResponse.json({
				message: `No cities found in ${countryName}`,
				found: false,
				data: [],
			})
		}

		// Places with images in these cities, newest first
		const placeRows: any[] =
			must(
				await db
					.from(T.places)
					.select(`*, ${GEO_CONTENT}, city:${T.cities}(id, ${GEO_CONTENT})`)
					.in('cityId', cities.map((city) => city.id))
					.not('image', 'is', null)
					.order('createdAt', { ascending: false })
					.limit(limit),
			) ?? []
		const places = placeRows.map((p) => ({ ...english(p), city: p.city && english(p.city) }))

		// Transform the places data for the frontend
		const placesData = places.map((place) => {
			// Find name and description from translations
			const nameTranslation = place.content?.translations.find(
				(t: any) => t.type === 'name',
			)
			const descriptionTranslation = place.content?.translations.find(
				(t: any) => t.type === 'description',
			)

			// Get city name from translations
			const cityName =
				place.city?.content?.translations[0]?.text || 'Unknown City'

			return {
				id: place.id,
				name: nameTranslation?.text || 'Unnamed Place',
				title: nameTranslation?.text || 'Unnamed Place',
				description: descriptionTranslation?.text || '',
				image: place.image?.url,
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
				cityName: cityName,
				countryId: place.countryId,
				countryName: countryName,
			}
		})

		// Group places by category
		const placesByCategory: Record<string, any[]> = {}

		placesData.forEach((place) => {
			const category = place.category || 'other'

			if (!placesByCategory[category]) {
				placesByCategory[category] = []
			}

			placesByCategory[category].push(place)
		})

		// Create diverse collections by taking one place from each city for each category
		const diverseCategories: Record<string, any[]> = {}

		Object.entries(placesByCategory).forEach(([category, places]) => {
			// Group places by city
			const placesByCity: Record<string, any[]> = {}

			places.forEach((place) => {
				if (!placesByCity[place.cityId]) {
					placesByCity[place.cityId] = []
				}

				placesByCity[place.cityId].push(place)
			})

			// Take one place from each city for this category
			const diversePlaces = Object.values(placesByCity).map(
				(cityPlaces) => cityPlaces[0],
			)

			// Add to diverse categories
			diverseCategories[category] = diversePlaces
		})

		return NextResponse.json({
			message: `Places in ${countryName} found successfully`,
			found: true,
			country: {
				id: country.id,
				name: countryName,
				code3: countryId,
				image: country.image,
			},
			data: placesData,
			categorized: diverseCategories, // Use the diverse categories instead
			totalCount: places.length,
			cityCount: cities.length,
		})
	} catch (error: any) {
		console.error(
			'❌ Error fetching places by country:',
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
