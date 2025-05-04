import { placesClient } from '@/lib/prisma'
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

		console.log(`🔎 Searching for country by code: ${countryId}`)
		const prisma = placesClient

		// Find the country by code3
		const country = await prisma.country.findFirst({
			where: {
				id: countryId,
			},
			include: {
				content: {
					include: {
						translations: {
							where: { language: 'en' },
						},
					},
				},
			},
		})

		if (!country) {
			return NextResponse.json({
				message: `No country found with code: ${countryId}`,
				found: false,
				data: [],
			})
		}

		const countryName = country.content.translations[0]?.text || countryId
		console.log(`🌍 Found country: ${countryName} (ID: ${country.id})`)

		// Find cities in this country
		const cities = await prisma.city.findMany({
			where: {
				countryId: country.id,
			},
			include: {
				content: {
					include: {
						translations: {
							where: { language: 'en' },
						},
					},
				},
			},
			take: 100, // Limit to top 10 cities
		})

		if (cities.length === 0) {
			return NextResponse.json({
				message: `No cities found in ${countryName}`,
				found: false,
				data: [],
			})
		}

		console.log(`🏙️ Found ${cities.length} cities in ${countryName}`)

		// Get city IDs
		const cityIds = cities.map((city) => city.id)

		// Get city names for reference
		const cityNames = cities.map((city) => {
			return city.content.translations[0]?.text || 'Unknown City'
		})

		// console.log(`🏙️ Cities: ${cityNames.join(', ')}`)

		// Find places in these cities
		const places = await prisma.place.findMany({
			where: {
				cityId: {
					in: cityIds,
				},
				// Only include places with images
				image: {
					isNot: null,
				},
			},
			include: {
				content: {
					include: {
						translations: {
							where: { language: 'en' },
						},
					},
				},
				city: {
					include: {
						content: {
							include: {
								translations: {
									where: { language: 'en' },
								},
							},
						},
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: limit,
		})

		console.log(`📍 Found ${places.length} places in ${countryName}`)

		// Transform the places data for the frontend
		const placesData = places.map((place) => {
			// Find name and description from translations
			const nameTranslation = place.content.translations.find(
				(t) => t.type === 'name',
			)
			const descriptionTranslation = place.content.translations.find(
				(t) => t.type === 'description',
			)

			// Get city name from translations
			const cityName =
				place.city?.content.translations[0]?.text || 'Unknown City'

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

		console.log(
			'🚀 Places by Country Response prepared with diverse collections',
		)
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
