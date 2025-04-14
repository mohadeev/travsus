import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import { placesClient } from '@/lib/prisma'
import { OpenAI } from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey:
		'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',
})

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

		// Strict validation for id
		if (!id || id === 'undefined') {
			console.log('Invalid tour ID provided:', id)
			return NextResponse.json(
				{ message: 'Tour ID is required and must be valid' },
				{ status: 400 },
			)
		}

		console.log('Fetching tour data for ID:', id)

		// Fetch the tour data
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

		// Process days to ensure each has city information
		let processedDays = tour.days || []

		// If days exist, process each day to ensure it has city information
		if (Array.isArray(processedDays) && processedDays.length > 0) {
			// Get all unique cityIds from the days
			const cityIds = processedDays
				.filter((day) => day.cityId && day.cityId !== 'undefined')
				.map((day) => day.cityId)

			// If there are cityIds, fetch the corresponding cities
			if (cityIds.length > 0) {
				console.log('Fetching city data for cityIds:', cityIds)

				try {
					// Use placesClient to fetch cities
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

		// Create the final tour object with processed days
		const tourData = {
			...tour,
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
		// Ensure Prisma clients are disconnected
		await prisma.$disconnect()
		await placesClient.$disconnect()
	}
}
