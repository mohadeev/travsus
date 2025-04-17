import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI
const openai = new OpenAI({
	apiKey:
		'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',
})

/**
 * Generate a concise description for a city using OpenAI
 */
async function generateCityDescription(cityName: string, countryName: string) {
	const prompt = `Write a concise, engaging description of ${cityName} in ${countryName} in about 110-120 words.
    
  Focus on:
  - Key attractions and characteristics
  - Cultural highlights and famous features
  - Practical information for visitors
  
  Use a lively, descriptive style similar to this example about Cannes:
  "Galas, regattas, the Film Festival and an outrageously attractive and affluent set characterize Cannes. Vast yachts obscure the view and the town lives up to its motto, 'Life is a festival.' People-watching is the activity that brings most visitors to Cannes, and hotel-lined La Croisette provides a fine promenade. First popularized by Coco Chanel, Cannes beaches are a huge draw. Get expensive seaside food and drinks service on hotel sand or opt for the free public beaches, Plages du Midi and de la Boca."
  
  Make it informative but concise, with vivid details that capture the essence of ${cityName}.`

	try {
		const completion = await openai.chat.completions.create({
			model: 'gpt-4-turbo',
			messages: [{ role: 'user', content: prompt }],
			max_tokens: 250, // Reduced token limit for shorter responses
			temperature: 0.7, // Keep this for creative descriptions
		})

		return completion.choices[0].message.content.trim()
	} catch (error) {
		console.error(`Error generating description for ${cityName}:`, error)

		// Fallback to a generic description if API fails
		return `${cityName} charms visitors with its distinctive character and vibrant atmosphere. Historic architecture stands alongside modern developments, while local markets and cafés offer authentic cultural experiences. The city is known for its unique cuisine and lively arts scene. Visitors can explore museums, stroll through picturesque neighborhoods, and enjoy seasonal festivals that showcase local traditions. Public transportation makes navigating easy, while nearby attractions provide options for day trips. Whether seeking cultural immersion or simply relaxation, ${cityName} offers a perfect blend of experiences.`
	}
}

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

		console.log('here')

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
					// Use only select instead of both include and select
					select: {
						code: true,
						code3: true,
						// Include content and its translations
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
				},
			},
		})

		if (!city) {
			return NextResponse.json({ error: 'City not found' }, { status: 404 })
		}

		// Extract the name and description from translations
		let name = ''
		let description = ''
		let countryName = ''

		// Get country name for context
		if (
			city.country?.content?.translations &&
			city.country.content.translations.length > 0
		) {
			countryName = city.country.content.translations[0].text
		} else {
			countryName = city.country?.code3 || 'Unknown Country'
		}

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
			} else {
				// No description found, generate one
				console.log(`No description found for ${name}, generating one...`)

				// Generate description
				description = await generateCityDescription(name, countryName)

				// Save the generated description to the database
				try {
					await placesClient.translatedText.create({
						data: {
							contentId: city.content.id,
							language: 'en',
							text: description,
							type: 'description',
							code3: city.country?.code3 || null,
						},
					})
					console.log(`Saved generated description for ${name}`)
				} catch (error) {
					console.error(`Error saving description for ${name}:`, error)
					// Continue with the generated description even if saving fails
				}
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

		console.log("",)
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
