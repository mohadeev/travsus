import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import { placesClient } from '@/lib/prisma'
import { OpenAI } from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
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

		const responseText = completion.choices[0].message.content?.trim() || ''

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

		if (!id || id === 'undefined') {
			console.log('Invalid tour ID provided:', id)
			return NextResponse.json(
				{ message: 'Tour ID is required and must be valid' },
				{ status: 400 },
			)
		}

		console.log('Fetching tour data for ID:', id)

		const tour = await prisma.tour.findUnique({
			where: { id },
			include: {
				startAddress: true,
				endAddress: true,
				nameContent: {
					include: {
						translations: {
							where: {
								languageCode: languageCode,
							},
						},
					},
				},
				subtitleContent: {
					include: {
						translations: {
							where: {
								languageCode: languageCode,
							},
						},
					},
				},
				overviewContent: {
					include: {
						translations: {
							where: {
								languageCode: languageCode,
							},
						},
					},
				},
				conclusionContent: {
					include: {
						translations: {
							where: {
								languageCode: languageCode,
							},
						},
					},
				},
			},
		})

		if (!tour) {
			console.log('Tour not found for ID:', id)
			return NextResponse.json({ message: 'Tour not found' }, { status: 404 })
		}

		// Get translated tour content
		const translatedName = tour.nameContent?.translations[0]?.text || tour.name
		const translatedSubtitle =
			tour.subtitleContent?.translations[0]?.text || tour.subtitle
		const translatedOverview =
			tour.overviewContent?.translations[0]?.text || tour.overview
		const translatedConclusion =
			tour.conclusionContent?.translations[0]?.text || tour.conclusion

		// Process days with city translations
		let processedDays = tour.days || []
		let continentInfo = null

		if (Array.isArray(processedDays) && processedDays.length > 0) {
			// First get all day translations
			const daysWithTranslations = await Promise.all(
				processedDays.map(async (day) => {
					let translatedDayName = day.name
					let translatedDayDescription = day.description

					if (day.nameContentId) {
						const nameContent = await prisma.translatableContent.findUnique({
							where: { id: day.nameContentId },
							include: {
								translations: {
									where: { languageCode },
								},
							},
						})
						translatedDayName = nameContent?.translations[0]?.text || day.name
					}

					if (day.descriptionContentId) {
						const descContent = await prisma.translatableContent.findUnique({
							where: { id: day.descriptionContentId },
							include: {
								translations: {
									where: { languageCode },
								},
							},
						})
						translatedDayDescription =
							descContent?.translations[0]?.text || day.description
					}

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

			if (cityIds.length > 0) {
				console.log('Fetching city data for cityIds:', cityIds)

				try {
					const cities = await placesClient.city.findMany({
						where: { id: { in: cityIds } },
						include: {
							content: {
								include: {
									translations: true, // Get ALL translations
								},
							},
							country: {
								include: {
									content: {
										include: {
											translations: true,
										},
									},
									continent: {
										include: {
											content: {
												include: {
													translations: true,
												},
											},
										},
									},
								},
							},
							state: {
								include: {
									content: {
										include: {
											translations: true,
										},
									},
								},
							},
						},
					})

					console.log(`Found ${cities.length} cities`)

					// Process each city to get the correct translation
					const cityMap: Record<string, any> = {}
					for (const city of cities) {
						// Get city name in requested language
						const cityTranslation = city.content?.translations?.find(
							(t) => t.language === languageCode,
						)
						const cityName =
							cityTranslation?.text ||
							city.content?.translations?.find((t) => t.language === 'en-US')
								?.text ||
							'Unknown City'

						// Get country name in requested language
						let countryName = null
						if (city.country?.content?.translations) {
							const countryTranslation = city.country.content.translations.find(
								(t) => t.language === languageCode,
							)
							countryName =
								countryTranslation?.text ||
								city.country.content.translations.find(
									(t) => t.language === 'en-US',
								)?.text
						}

						// Get state/province name in requested language
						let stateName = null
						if (city.state?.content?.translations) {
							const stateTranslation = city.state.content.translations.find(
								(t) => t.language === languageCode,
							)
							stateName =
								stateTranslation?.text ||
								city.state.content.translations.find(
									(t) => t.language === 'en-US',
								)?.text
						}

						// Get continent information (only for the first day's city)
						if (!continentInfo && city.country?.continent) {
							const continentTranslation =
								city.country.continent.content?.translations?.find(
									(t) => t.language === languageCode,
								)
							continentInfo = {
								name:
									continentTranslation?.text ||
									city.country.continent.content?.translations?.find(
										(t) => t.language === 'en-US',
									)?.text ||
									'Unknown Continent',
								code: city.country.continent.code,
								id: city.country.continent.id,
							}
						}

						// Check for missing geo coordinates
						if (!city.geo || !city.geo.lat || !city.geo.log) {
							const geoCoordinates = await getGeoCoordinatesFromOpenAI(
								cityName,
								countryName,
							)
							if (geoCoordinates?.lat && geoCoordinates?.log) {
								await updateCityGeoCoordinates(city.id, geoCoordinates)
								city.geo = geoCoordinates
							}
						}

						cityMap[city.id] = {
							id: city.id,
							name: cityName,
							countryName: countryName,
							stateName: stateName,
							geoCoordinates: city.geo || null,
							originalName: city.content?.translations?.find(
								(t) => t.language === 'en-US',
							)?.text,
						}
					}

					// Update each day with translated city information
					processedDays = processedDays.map((day) => {
						if (day.cityId && cityMap[day.cityId]) {
							return {
								...day,
								cityName: cityMap[day.cityId].name,
								countryName: cityMap[day.cityId].countryName,
								stateName: cityMap[day.cityId].stateName,
								geoCoordinates: cityMap[day.cityId].geoCoordinates,
								originalCityName: cityMap[day.cityId].originalName,
							}
						}
						return day
					})
				} catch (cityError) {
					console.error('Error fetching city data:', cityError)
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
			language: languageCode,
			continentInfo, // Add the new continent information object
		}

		return NextResponse.json(tourData)
	} catch (error) {
		console.error('Error fetching tour data:', error)
		return NextResponse.json(
			{
				message: 'Error fetching tour data',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
		await placesClient.$disconnect()
	}
}
