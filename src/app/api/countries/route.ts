export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { db, T, must } from '@/lib/db'
import { GEO_CONTENT, hasImage, inLanguage, languageFromReferer } from '@/lib/geo'

// Countries shown when no ?codes= is given
const DEFAULT_COUNTRY_CODES = [
	'MAR', 'FRA', 'ITA', 'JPN', 'PER', 'THA', 'VNM', 'AUS', 'USA',
	'ARE', 'ZAF', 'GRC', 'TUR', 'PYF', 'ESP', 'EGY', 'CAN', 'IDN',
]

export async function GET(request: Request) {
	try {
		const codes = new URL(request.url).searchParams.get('codes')
		const language = languageFromReferer(request)

		const countryCodesList = [
			...new Set(codes ? codes.split(',') : DEFAULT_COUNTRY_CODES),
		]

		const countries: any[] =
			must(
				await db
					.from(T.countries)
					.select(`*, ${GEO_CONTENT}`)
					.in('code3', countryCodesList)
					.not('image', 'is', null),
			) ?? []

		const countriesWithImages = countries
			.filter((country) => hasImage(country.image))
			.map((country) => inLanguage(country, language))

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
