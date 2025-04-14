import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
	request: Request,
	{ params }: { params: { city: string } },
) {
	try {
		const cityName = params.city
		console.log('Searching for city with name:', cityName)

		if (!cityName) {
			return NextResponse.json(
				{ error: 'City name is required' },
				{ status: 400 },
			)
		}

		// First, find translations that match the city name
		const cityTranslations = await placesClient.translatedText.findMany({
			where: {
				text: { contains: cityName, mode: 'insensitive' },
				type: 'city', // Specifically look for city type translations
			},
			select: { contentId: true },
			take: 5,
		})

		if (cityTranslations.length === 0) {
			return NextResponse.json({ error: 'City not found' }, { status: 404 })
		}

		const contentIds = cityTranslations.map((t) => t.contentId)

		// Find the city with matching content ID
		const city = await placesClient.city.findFirst({
			where: {
				contentId: { in: contentIds },
			},
			include: {
				content: {
					include: {
						translations: {
							where: {
								language: 'en',
							},
						},
					},
				},
				country: {
					select: {
						code: true,
						code3: true,
					},
				},
			},
		})

		if (!city) {
			return NextResponse.json({ error: 'City not found' }, { status: 404 })
		}

		// Extract the name and description from translations
		let name = ''
		let description = ''

		if (city.content && city.content.translations) {
			// Find name translation (type = "city")
			const nameTranslation = city.content.translations.find(
				(t) => t.type === 'city',
			)

			// Find description translation
			const descriptionTranslation = city.content.translations.find(
				(t) => t.type === 'description',
			)

			if (nameTranslation) {
				name = nameTranslation.text
			} else if (city.content.translations.length > 0) {
				// Fallback to first translation if specific type not found
				name = city.content.translations[0].text
			}

			if (descriptionTranslation) {
				description = descriptionTranslation.text
			}
		}

		// Prepare the response data to match the format expected by the frontend
		const cityData = {
			id: city.id,
			name: name,
			description: description,
			image: city.image?.url,
			geo: city.geo,
			countryCode: city.country?.code3 || null,
			population: city.population,
			timezone: city.timezone,
		}

		// Return the data without cache control headers
		return NextResponse.json(cityData)
	} catch (error) {
		console.error('Error fetching city:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch city data' },
			{ status: 500 },
		)
	}
}
