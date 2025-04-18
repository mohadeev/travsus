// import { placesClient } from '@/libs/prisma'
import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: { countryId: string } },
) {
	try {
		const { countryId } = params

		if (!countryId) {
			return NextResponse.json(
				{ error: 'Country ID is required' },
				{ status: 400 },
			)
		}

		const prisma = placesClient

		// Get the country with its translations
		const country = await prisma.country.findUnique({
			where: {
				id: countryId,
			},
			include: {
				content: {
					include: {
						translations: {
							where: {
								language: 'en',
								type: 'country',
							},
						},
					},
				},
			},
		})

		if (!country) {
			return NextResponse.json({ error: 'Country not found' }, { status: 404 })
		}

		// Get the country name from translations
		const countryName =
			country.content?.translations[0]?.text || 'Unknown Country'

		// First, find cities in this country that have images
		const citiesWithImages = await prisma.city.findMany({
			where: {
				countryId,
				image: { isNot: null },
			},
			include: {
				content: {
					include: {
						translations: {
							where: {
								language: 'en',
								type: 'city',
							},
						},
					},
				},
			},
		})

		// Get city IDs to use in the places query
		const cityIds = citiesWithImages.map((city) => city.id)

		// Get all places for these cities
		const places = await prisma.place.findMany({
			where: {
				cityId: { in: cityIds.length > 0 ? cityIds : undefined },
			},
			include: {
				city: {
					select: {
						id: true,
						content: {
							include: {
								translations: {
									where: {
										language: 'en',
										type: 'city',
									},
								},
							},
						},
					},
				},
				content: {
					include: {
						translations: {
							where: {
								language: 'en',
							},
						},
					},
				},
			},
		})

		// Format cities data
		const formattedCities = citiesWithImages.map((city) => {
			const cityName = city.content?.translations[0]?.text || 'Unknown City'
			return {
				id: city.id,
				name: cityName,
				image: city.image,
			}
		})

		// Transform the places data to a more usable format
		const formattedPlaces = places.map((place) => {
			// Find name and description translations
			const nameTranslation = place.content?.translations.find(
				(t) => t.type === 'name',
			)
			const descriptionTranslation = place.content?.translations.find(
				(t) => t.type === 'description',
			)

			// Get city name
			const cityName =
				place.city?.content?.translations[0]?.text || 'Unknown City'

			return {
				id: place.id,
				name: nameTranslation?.text || 'Unnamed Place',
				description: descriptionTranslation?.text || '',
				category: place.category,
				type: place.type,
				image: place.image,
				geo: place.geo,
				rating: place.rating,
				address: place.address,
				cityId: place.cityId,
				cityName: cityName,
			}
		})

		// Return country data, cities with images, and places in one response
		return NextResponse.json({
			country: {
				id: country.id,
				name: countryName,
				code: country.code,
				code3: country.code3,
				image: country.image,
			},
			cities: formattedCities,
			places: formattedPlaces,
		})
	} catch (error) {
		console.error('Error fetching country and places:', error)
		return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
	}
}
