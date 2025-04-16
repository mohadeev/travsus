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

		// Normalize the search term - lowercase, trim, and handle URL encoding
		const normalizedCityName = cityName.toLowerCase().trim()

		// Create variations of the city name to improve matching
		const cityVariations = [
			normalizedCityName, // Original normalized name
			normalizedCityName.replace(/-/g, ' '), // Replace hyphens with spaces
			normalizedCityName.replace(/-/g, ''), // Remove hyphens completely
			decodeURIComponent(normalizedCityName), // URL decoded version
			decodeURIComponent(normalizedCityName).replace(/-/g, ' '), // URL decoded with spaces
		]

		// Remove duplicates from variations
		const uniqueVariations = [...new Set(cityVariations)]
		console.log('Searching for city variations:', uniqueVariations)

		// First, try to find an exact match with any of the variations
		const exactMatchTranslations = await placesClient.translatedText.findMany({
			where: {
				OR: uniqueVariations.map((variation) => ({
					text: { equals: variation, mode: 'insensitive' },
				})),
				type: 'city',
			},
			select: { contentId: true, text: true },
		})

		// If we have exact matches, use those
		let contentIds = exactMatchTranslations.map((t) => t.contentId)

		// If no exact matches, try to find matches that contain any part of the compound name
		if (contentIds.length === 0) {
			// For compound names, split by hyphen or space and search for each part
			const nameParts = decodeURIComponent(normalizedCityName)
				.replace(/-/g, ' ')
				.split(' ')
				.filter((part) => part.length > 2) // Only use parts with more than 2 characters

			if (nameParts.length > 1) {
				console.log('Searching for compound name parts:', nameParts)

				// Search for cities that contain all parts of the compound name
				const compoundMatches = await placesClient.translatedText.findMany({
					where: {
						AND: nameParts.map((part) => ({
							text: { contains: part, mode: 'insensitive' },
						})),
						type: 'city',
					},
					select: { contentId: true, text: true },
				})

				contentIds = compoundMatches.map((t) => t.contentId)
			}
		}

		// If still no matches, try starts with for each variation
		if (contentIds.length === 0) {
			const startsWithTranslations = await placesClient.translatedText.findMany(
				{
					where: {
						OR: uniqueVariations.map((variation) => ({
							text: { startsWith: variation, mode: 'insensitive' },
						})),
						type: 'city',
					},
					select: { contentId: true, text: true },
				},
			)

			contentIds = startsWithTranslations.map((t) => t.contentId)
		}

		// If still no matches, fall back to contains search but with stricter matching
		if (contentIds.length === 0) {
			// Get all potential matches
			const containsTranslations = await placesClient.translatedText.findMany({
				where: {
					OR: uniqueVariations.map((variation) => ({
						text: { contains: variation, mode: 'insensitive' },
					})),
					type: 'city',
				},
				select: { contentId: true, text: true },
				take: 10, // Get more results to filter
			})

			// Filter results to prioritize better matches
			// Sort by relevance - shorter names are more likely to be exact matches
			const sortedTranslations = containsTranslations.sort((a, b) => {
				// Prioritize matches that contain more of the search terms
				const aLower = a.text.toLowerCase()
				const bLower = b.text.toLowerCase()

				// Count how many variations are found in each text
				const aMatches = uniqueVariations.filter((v) =>
					aLower.includes(v),
				).length
				const bMatches = uniqueVariations.filter((v) =>
					bLower.includes(v),
				).length

				if (aMatches !== bMatches) {
					return bMatches - aMatches // Higher match count first
				}

				// If same match count, prefer shorter names
				return a.text.length - b.text.length
			})

			contentIds = sortedTranslations.map((t) => t.contentId)
		}

		if (contentIds.length === 0) {
			return NextResponse.json({ error: 'City not found' }, { status: 404 })
		}

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
