import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const cityId = searchParams.get('cityId')
		const limit = 16
		// searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 16

		if (!cityId) {
			return NextResponse.json(
				{ error: 'City ID is required' },
				{ status: 400 },
			)
		}

		console.log('🔎 Searching for city by ID:', cityId)

		const prisma = placesClient

		// Find the city directly by ID
		const city = await prisma.city.findUnique({
			where: {
				id: cityId,
			},
			include: {
				content: {
					include: {
						translations: {
							where: { language: 'en-US' },
						},
					},
				},
			},
		})

		if (!city) {
			return NextResponse.json({
				message: 'No city found with that ID',
				found: false,
				data: [],
			})
		}

		const foundCityName = city.content.translations[0]?.text || 'Unknown City'
		console.log(`🏙️ Found city: ${foundCityName} (ID: ${city.id})`)

		// Fetch places for this city
		const places = await prisma.place.findMany({
			where: {
				cityId: city.id,
				// Only include places with images
				// image: {
				// 	isNot: null,
				// },
			},
			include: {
				content: {
					include: {
						translations: {
							where: { language: 'en-US' },
						},
					},
				},
				// category: true,
				// subcategory: true,
			},
			// orderBy: {
			// 	createdAt: 'desc',
			// },
			// take: limit,
		})
		console.log('places:', places.length)

		// Transform the places data for the frontend
		const placesData = places.map((place) => {
			// Find name and description from translations
			const nameTranslation = place.content.translations.find(
				(t) => t.type === 'name',
			)
			const descriptionTranslation = place.content.translations.find(
				(t) => t.type === 'description',
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

		console.log('🚀 Places by City ID Response prepared')
		console.log('placesData', placesData)

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
