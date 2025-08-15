import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import { placesClient } from '@/lib/prisma'
import { OpenAI } from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey:
		'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',
})

function extractLanguageFromRequest(request: NextRequest): string {
	// Try to get language from referer URL first
	const referer = request.headers.get('referer')
	if (referer) {
		const match = referer.match(/\/([a-z]{2}-[A-Z]{2})\//)
		if (match) {
			return match[1]
		}
	}

	// Try to get from origin header
	const origin = request.headers.get('origin')
	if (origin) {
		const match = origin.match(/\/([a-z]{2}-[A-Z]{2})\//)
		if (match) {
			return match[1]
		}
	}

	// Default to en-US
	return 'en-US'
}

async function getTranslatedText(
	contentId: string | null,
	languageCode: string,
): Promise<string | null> {
	if (!contentId) return null

	try {
		const translatedText = await prisma.translatedText.findFirst({
			where: {
				contentId: contentId,
				languageCode: languageCode,
			},
		})

		return translatedText?.text || null
	} catch (error) {
		console.error('Error fetching translated text:', error)
		return null
	}
}

// Function to get geo coordinates from OpenAI for a city
async function getGeoCoordinatesFromOpenAI(
	cityName: string,
	countryName?: string,
) {
	try {
		console.log(
			`Getting geo coordinates for ${cityName}${countryName ? `, ${countryName}` : ''} from OpenAI`,
		)

		const locationText = countryName ? `${cityName}, ${countryName}` : cityName

		const prompt = `
      I need the precise latitude and longitude coordinates for ${locationText}.
      Please provide ONLY a valid JSON object with these fields:
      {
        "lat": [latitude as a number],
        "log": [longitude as a number]
      }
      
      Only return the JSON object, nothing else. Ensure the values are numbers, not strings.
    `

		const completion = await openai.chat.completions.create({
			model: 'gpt-4-turbo',
			messages: [{ role: 'user', content: prompt }],
			temperature: 0.3,
		})

		const responseText = completion.choices[0].message.content.trim()

		// Extract JSON from the response
		const jsonMatch = responseText.match(/\{[\s\S]*\}/)
		if (!jsonMatch) {
			console.error(
				`Failed to extract JSON from OpenAI response: ${responseText}`,
			)
			return null
		}

		const geoInfo = JSON.parse(jsonMatch[0])
		console.log(`OpenAI provided coordinates for ${cityName}:`, geoInfo)

		return geoInfo
	} catch (error) {
		console.error(
			`Error getting geo coordinates from OpenAI for ${cityName}:`,
			error,
		)
		return null
	}
}

// Function to update city geo coordinates in the database
async function updateCityGeoCoordinates(
	cityId: string,
	geoCoordinates: { lat: number; log: number },
) {
	try {
		console.log(`Updating geo coordinates for city ${cityId}:`, geoCoordinates)

		await placesClient.city.update({
			where: { id: cityId },
			data: {
				geo: geoCoordinates,
			},
		})

		console.log(`Successfully updated geo coordinates for city ${cityId}`)
		return true
	} catch (error) {
		console.error(`Error updating geo coordinates for city ${cityId}:`, error)
		return false
	}
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id')

		const languageCode = extractLanguageFromRequest(request)
		console.log('Detected language:', languageCode)

		// Strict validation for id
		if (!id || id === 'undefined') {
			console.log('Invalid tour ID provided:', id)
			return NextResponse.json(
				{ message: 'Tour ID is required and must be valid' },
				{ status: 400 },
			)
		}

		console.log('Fetching tour data for ID:', id)

		const tour = await prisma.tour.findUnique({
			where: {
				id: id,
			},
			include: {
				startAddress: true,
				endAddress: true,
			},
		})

		if (!tour) {
			console.log('Tour not found for ID:', id)
			return NextResponse.json({ message: 'Tour not found' }, { status: 404 })
		}

		const translatedName =
			(await getTranslatedText(tour.nameContentId, languageCode)) || tour.name
		const translatedSubtitle =
			(await getTranslatedText(tour.subtitleContentId, languageCode)) ||
			tour.subtitle
		const translatedOverview =
			(await getTranslatedText(tour.overviewContentId, languageCode)) ||
			tour.overview
		const translatedConclusion =
			(await getTranslatedText(tour.conclusionContentId, languageCode)) ||
			tour.conclusion

		// Process days to ensure each has city information
		let processedDays = tour.days || []

		if (Array.isArray(processedDays) && processedDays.length > 0) {
			const daysWithTranslations = await Promise.all(
				processedDays.map(async (day) => {
					const translatedDayName =
						(await getTranslatedText(day.nameContentId, languageCode)) ||
						day.name
					const translatedDayDescription =
						(await getTranslatedText(day.descriptionContentId, languageCode)) ||
						day.description

					return {
						...day,
						name: translatedDayName,
						description: translatedDayDescription,
					}
				}),
			)

			processedDays = daysWithTranslations

			// Get all unique cityIds from the days
			const cityIds = processedDays
				.filter((day) => day.cityId && day.cityId !== 'undefined')
				.map((day) => day.cityId)

			// If there are cityIds, fetch the corresponding cities
			if (cityIds.length > 0) {
				console.log('Fetching city data for cityIds:', cityIds)

				try {
					const cities = await placesClient.city.findMany({
						where: {
							id: {
								in: cityIds,
							},
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
							country: true,
						},
					})

					console.log(`Found ${cities.length} cities`)

					// Create a map of cityId to city data for quick lookup
					const cityMap = {}

					// Process each city - check for missing geo coordinates and fetch if needed
					for (const city of cities) {
						const cityName =
							city.content?.translations?.find((t) => t.language === 'en')
								?.text ||
							city.content?.translations[0]?.text ||
							'Unknown City'

						const countryName =
							city.country?.content?.translations?.find(
								(t) => t.language === 'en',
							)?.text || null

						// Check if geo coordinates are missing or incomplete
						if (!city.geo || !city.geo.lat || !city.geo.log) {
							console.log(`Missing geo coordinates for city: ${cityName}`)

							// Get geo coordinates from OpenAI
							const geoCoordinates = await getGeoCoordinatesFromOpenAI(
								cityName,
								countryName,
							)

							// If we got coordinates, update the city in the database
							if (geoCoordinates && geoCoordinates.lat && geoCoordinates.log) {
								await updateCityGeoCoordinates(city.id, geoCoordinates)

								// Update the city object with the new coordinates
								city.geo = geoCoordinates
							}
						}

						// Add city to the map
						cityMap[city.id] = {
							id: city.id,
							name: cityName,
							geoCoordinates: city.geo || null,
						}
					}

					// Update each day with city information
					processedDays = processedDays.map((day) => {
						if (day.cityId && cityMap[day.cityId]) {
							return {
								...day,
								cityName: cityMap[day.cityId].name,
								geoCoordinates: cityMap[day.cityId].geoCoordinates,
							}
						}
						return day
					})
				} catch (cityError) {
					console.error('Error fetching city data:', cityError)
					// Continue with original days if city fetching fails
				}
			}
		}

		const tourData = {
			...tour,
			name: translatedName,
			subtitle: translatedSubtitle,
			overview: translatedOverview,
			conclusion: translatedConclusion,
			days: processedDays,
		}

		return NextResponse.json(tourData)
	} catch (error) {
		console.error('Error fetching tour data:', error)
		return NextResponse.json(
			{ message: 'Error fetching tour data', error },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
		await placesClient.$disconnect()
	}
}
