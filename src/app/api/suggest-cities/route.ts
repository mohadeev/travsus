export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey:
		'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',
})

// Cache to store previously suggested cities and their coordinates
const citiesCache: Record<string, { lat: number; lng: number }> = {}

// Function to extract city data from various response formats
function extractCityData(
	responseText: string,
): Array<{ name: string; lat: number; lng: number }> {
	let cities: Array<{ name: string; lat: number; lng: number }> = []

	try {
		// First, try to parse the entire response as JSON
		let parsedData
		try {
			parsedData = JSON.parse(responseText.trim())
		} catch (e) {
			// If that fails, try to find and extract a JSON array or object
			const jsonMatch = responseText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/)
			if (jsonMatch) {
				try {
					parsedData = JSON.parse(jsonMatch[0])
				} catch (innerError) {
					console.error('Failed to parse extracted JSON:', innerError)
				}
			}
		}

		if (!parsedData) return []

		// Handle different response formats
		if (Array.isArray(parsedData)) {
			// Direct array of cities
			cities = parsedData
		} else if (parsedData.cities && Array.isArray(parsedData.cities)) {
			// Object with cities array
			cities = parsedData.cities
		} else if (typeof parsedData === 'object' && parsedData !== null) {
			// Check if it's a single city object
			if (
				parsedData.name &&
				(typeof parsedData.lat === 'number' ||
					typeof parsedData.lng === 'number')
			) {
				cities = [parsedData]
			} else {
				// Try to find arrays in the object
				const possibleArrays = Object.values(parsedData).filter((val) =>
					Array.isArray(val),
				)
				if (possibleArrays.length > 0) {
					cities = possibleArrays[0]
				} else {
					// Try to convert object properties to city objects
					const cityEntries = Object.entries(parsedData)
						.filter(
							([key, value]) =>
								typeof value === 'object' &&
								value !== null &&
								(value.hasOwnProperty('lat') || value.hasOwnProperty('lng')),
						)
						.map(([key, value]) => ({
							name: key,
							lat: (value as any).lat || 0,
							lng: (value as any).lng || 0,
						}))

					if (cityEntries.length > 0) {
						cities = cityEntries
					}
				}
			}
		}
	} catch (error) {
		console.error('Error extracting city data:', error)
	}

	// Validate city data
	return cities
		.filter(
			(city) =>
				city &&
				typeof city === 'object' &&
				city.name &&
				typeof city.name === 'string' &&
				(typeof city.lat === 'number' || typeof city.lat === 'string') &&
				(typeof city.lng === 'number' || typeof city.lng === 'string'),
		)
		.map((city) => ({
			name: city.name,
			lat: Number(city.lat),
			lng: Number(city.lng),
		}))
}

export async function POST(request: Request) {
	try {
		const data = await request.json()
		const {
			country,
			duration,
			existingCities = [],
			previousSuggestions = [],
			suggestionCount = 0,
		} = data

		// Ensure we have a valid country
		if (!country || typeof country !== 'string') {
			return NextResponse.json(
				{
					success: false,
					message: 'Please provide a valid country',
				},
				{ status: 400 },
			)
		}

		try {
			// Get the last selected city if any
			const lastCity =
				existingCities.length > 0
					? existingCities[existingCities.length - 1]
					: null

			// Create a detailed prompt for the AI to generate cities with coordinates
			let prompt = ''

			if (existingCities.length > 0) {
				prompt = `
          For a ${duration}-day trip to ${country}, suggest 5-7 cities to visit after ${lastCity}.
          Consider travel distances, cultural significance, and tourist attractions, please seguste the most touristique cities first that likely and comuneley  start in or end in or trips past from         
          Return ONLY a JSON array with objects containing name, lat, and lng properties.
          Example format: [{"name": "City1", "lat": 34.01, "lng": -5.00}, {"name": "City2", "lat": 35.16, "lng": -5.26}]
          
          Make sure to:
          1. Include only real cities in ${country}
          2. Provide accurate latitude and longitude coordinates
          3. Do not include any cities already in this list: ${[...existingCities, ...previousSuggestions].join(', ')}
          4. Return only the JSON array, no additional text
        `
			} else {
				prompt = `
          For a ${duration}-day trip to ${country}, suggest 5-7 popular cities to visit.
          Include major tourist destinations and culturally significant places.
          
          Return ONLY a JSON array with objects containing name, lat, and lng properties.
          Example format: [{"name": "City1", "lat": 34.01, "lng": -5.00}, {"name": "City2", "lat": 35.16, "lng": -5.26}]
          
          Make sure to:
          1. Include only real cities in ${country}
          2. Provide accurate latitude and longitude coordinates
          3. Return only the JSON array, no additional text
        `
			}

			console.log('Sending prompt to OpenAI:', prompt)

			// Use gpt-4o for better accuracy with coordinates
			const completion = await openai.chat.completions.create({
				model: 'gpt-4o',
				messages: [{ role: 'user', content: prompt }],
				temperature: 0.7,
				max_tokens: 800,
			})

			const responseText = completion.choices[0].message.content || ''
			console.log('OpenAI response:', responseText.substring(0, 200) + '...')

			// Extract city data from the response
			const suggestedCities = extractCityData(responseText)

			// If we couldn't extract any valid cities, try again with a simpler prompt
			if (suggestedCities.length === 0) {
				console.log(
					'No valid cities extracted from response, trying with simpler prompt',
				)

				const simplePrompt = `
          List 5 popular cities in ${country} with their coordinates.
          Return only a JSON array in this exact format: 
          [{"name": "CityName", "lat": latitude, "lng": longitude}]
        `

				const retryCompletion = await openai.chat.completions.create({
					model: 'gpt-4o',
					messages: [{ role: 'user', content: simplePrompt }],
					temperature: 0.5,
					max_tokens: 500,
				})

				const retryResponseText =
					retryCompletion.choices[0].message.content || ''
				const retryCities = extractCityData(retryResponseText)

				if (retryCities.length === 0) {
					return NextResponse.json({
						success: false,
						message:
							'Unable to generate city suggestions. Please try again or enter cities manually.',
					})
				}

				// Filter out cities that are already selected or were previously suggested
				const filteredCities = retryCities.filter(
					(city) =>
						!existingCities.some(
							(existing) => existing.toLowerCase() === city.name.toLowerCase(),
						) &&
						!previousSuggestions.some(
							(prev) => prev.toLowerCase() === city.name.toLowerCase(),
						),
				)

				// Update our cache with the new city coordinates
				filteredCities.forEach((city) => {
					citiesCache[city.name] = { lat: city.lat, lng: city.lng }
				})

				return NextResponse.json({
					success: true,
					cities: filteredCities.map((city) => city.name),
					coordinates: filteredCities.reduce(
						(acc, city) => {
							acc[city.name] = { lat: city.lat, lng: city.lng }
							return acc
						},
						{} as Record<string, { lat: number; lng: number }>,
					),
				})
			}

			// Filter out cities that are already selected or were previously suggested
			const filteredCities = suggestedCities.filter(
				(city) =>
					!existingCities.some(
						(existing) => existing.toLowerCase() === city.name.toLowerCase(),
					) &&
					!previousSuggestions.some(
						(prev) => prev.toLowerCase() === city.name.toLowerCase(),
					),
			)

			// Update our cache with the new city coordinates
			filteredCities.forEach((city) => {
				citiesCache[city.name] = { lat: city.lat, lng: city.lng }
			})

			return NextResponse.json({
				success: true,
				cities: filteredCities.map((city) => city.name),
				coordinates: filteredCities.reduce(
					(acc, city) => {
						acc[city.name] = { lat: city.lat, lng: city.lng }
						return acc
					},
					{} as Record<string, { lat: number; lng: number }>,
				),
			})
		} catch (error) {
			console.error('Error using OpenAI API:', error)

			return NextResponse.json({
				success: false,
				message:
					'Failed to generate city suggestions. Please try again or enter cities manually.',
			})
		}
	} catch (error) {
		console.error('Error suggesting cities:', error)
		return NextResponse.json(
			{
				success: false,
				message: 'Failed to suggest cities. Please try again.',
			},
			{ status: 500 },
		)
	}
}
