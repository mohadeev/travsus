import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// List of country codes to fetch if none specified
const DEFAULT_COUNTRY_CODES = [
	'MAR',
	'FRA',
	'ITA',
	'JPN',
	'PER',
	'THA',
	'VNM',
	'AUS',
	'USA',
	'ARE',
	'ZAF',
	'GRC',
	'TUR',
	'PYF',
	'ESP',
	'EGY',
	'CAN',
	'IDN',
]

function extractLanguageFromRequest(request: Request): string {
	const referer = request.headers.get('referer') || ''
	const origin = request.headers.get('origin') || ''

	// Try to extract language from referer first, then origin
	const urlToCheck = referer || origin
	const languageMatch = urlToCheck.match(/\/([a-z]{2}-[A-Z]{2})(?:\/|$)/)

	return languageMatch ? languageMatch[1] : 'en-US'
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const codes = searchParams.get('codes')

		const language = extractLanguageFromRequest(request)

		// Use the codes from the query params if provided, otherwise use the default list
		// Remove duplicates using Set
		const countryCodesList = codes
			? [...new Set(codes.split(','))]
			: [...new Set(DEFAULT_COUNTRY_CODES)]

		const prisma = placesClient

		// Fetch countries with their translations
		const countries = await prisma.country.findMany({
			where: {
				code3: {
					in: countryCodesList,
				},
				// Only get countries that have an image
				image: {
					isNot: null,
				},
			},
			include: {
				content: {
					include: {
						translations: {
							where: {
								language: language, // Use detected language instead of hardcoded 'en'
							},
						},
					},
				},
			},
		})

		// Further filter to only include countries with an image URL
		const countriesWithImages = countries.filter(
			(country) =>
				country.image && (country.image.url || country.image.uploadFrom),
		)

		return NextResponse.json({
			countries: countriesWithImages,
			total: countriesWithImages.length,
		})
	} catch (error) {
		console.error('Error fetching countries:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch countries' },
			{ status: 500 },
		)
	}
}
