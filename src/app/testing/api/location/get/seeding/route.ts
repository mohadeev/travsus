// import axios from 'axios'
// import { NextRequest, NextResponse } from 'next/server'
// import { PrismaClient } from '@prisma/client'

// export const dynamic = 'force-dynamic' // Ensure it's dynamic

// export async function GET(request: NextRequest) {
// 	try {
// 		const prisma = new PrismaClient()

// 		// Fetch all countries from our DB
// 		const countries = await prisma.country.findMany({
// 			include: {
// 				content: {
// 					include: {
// 						translations: true, // Ensure translations are included
// 					},
// 				},
// 			},
// 		})

// 		console.log('countries', countries.length)
// 		for (const country of countries) {
// 			try {
// 				// Check if translations exist and get the country name
// 				const countryName =
// 					country.content?.translations?.[0]?.text?.toLowerCase() || null

// 				if (!countryName) {
// 					console.warn(`⚠️ Skipping country with missing name: ${country.code}`)
// 					continue
// 				}

// 				// Fetch cities
// 				const response = await axios.post(
// 					'https://countriesnow.space/api/v0.1/countries/cities',
// 					{ country: countryName },
// 				)

// 				if (response.data.error || !response.data.data) {
// 					console.warn(`⚠️ No cities found for ${countryName}`)
// 					continue
// 				}

// 				const cities = response.data.data

// 				// Get existing cities for this country to avoid duplicates
// 				const existingCities = await prisma.city.findMany({
// 					where: {
// 						countryId: country.id,
// 					},
// 					include: {
// 						content: {
// 							include: {
// 								translations: true,
// 							},
// 						},
// 					},
// 				})

// 				const existingCityNames = new Set(
// 					existingCities.flatMap((city) =>
// 						city.content.translations.map((t) => t.text.toLowerCase()),
// 					),
// 				)

// 				// Filter out cities that already exist
// 				const newCities = cities.filter(
// 					(city) => !existingCityNames.has(city.toLowerCase()),
// 				)

// 				console.log(`Found ${newCities.length} new cities for ${countryName}`)

// 				if (newCities.length === 0) {
// 					console.log(`⚠️ No new cities to add for ${countryName}`)
// 					continue
// 				}

// 				// Create cities in batches to avoid potential issues with very large arrays
// 				const BATCH_SIZE = 100
// 				for (let i = 0; i < newCities.length; i += BATCH_SIZE) {
// 					const batch = newCities.slice(i, i + BATCH_SIZE)

// 					// Create all content records first with translations
// 					const contentRecords = await Promise.all(
// 						batch.map((city) =>
// 							prisma.translatableContent.create({
// 								data: {
// 									entity: 'City',
// 									translations: {
// 										create: {
// 											language: 'en',
// 											text: city,
// 										},
// 									},
// 								},
// 							}),
// 						),
// 					)

// 					// For MongoDB, we'll use individual creates in a transaction instead of createMany
// 					await prisma.$transaction(
// 						contentRecords.map((content) =>
// 							prisma.city.create({
// 								data: {
// 									country: {
// 										connect: { id: country.id },
// 									},
// 									content: {
// 										connect: { id: content.id },
// 									},
// 									geo: {
// 										lat: 0,
// 										log: 0, // Using "log" as defined in your schema
// 									},
// 								},
// 							}),
// 						),
// 					)

// 					console.log(
// 						`✅ Added batch of ${batch.length} cities for ${countryName}`,
// 					)
// 				}
// 			} catch (error) {
// 				console.error(`❌ Error processing country ${country.code}:`, error)
// 			}
// 		}

// 		return NextResponse.json({ message: 'Cities added successfully' })
// 	} catch (error) {
// 		console.error('Error fetching cities:', error)
// 		return NextResponse.json(
// 			{ message: 'Error fetching cities' },
// 			{ status: 500 },
// 		)
// 	}
// }

import { placesClient } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
// import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic' // Ensure it's dynamic

export async function GET(request: NextRequest) {
	try {
		const prisma = placesClient
		const countryCode = 'ZW'

		// Find the country by its code
		const country = await prisma.country.findUnique({
			where: {
				code: countryCode, // Use the hardcoded country code
			},
		})
		console.log('country:', country)

		if (!country) {
			return NextResponse.json(
				{ message: 'Country not found' },
				{ status: 404 },
			)
		}

		// Fetch all cities for the country
		// const cities = await prisma.city.findMany({
		// 	where: {
		// 		countryId: country.id, // Filter cities by the country's ID
		// 	},
		// 	include: {
		// 		content: {
		// 			include: {
		// 				translations: true, // Include translations for the city names
		// 			},
		// 		},
		// 	},
		// })

		// Format the response to include city names and translations
		// const formattedCities = cities.map((city) => ({
		// 	id: city.id,
		// 	name: city.content.translations.find((t) => t.language === 'en')?.text, // Default to English name
		// 	translations: city.content.translations,
		// 	geo: city.geo,
		// 	population: city.population,
		// 	timezone: city.timezone,
		// }))
		// console.log('formattedCities', formattedCities)

		return NextResponse.json({ cities: {} })
	} catch (error) {
		console.error('Error fetching cities:', error)
		return NextResponse.json(
			{ message: 'Error fetching cities' },
			{ status: 500 },
		)
	}
}
