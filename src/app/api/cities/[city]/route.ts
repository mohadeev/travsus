export const dynamic = "force-dynamic";
import { db, T, must, newId } from '@/lib/db'
import { GEO_CONTENT, keepTranslations } from '@/lib/geo'
import { NextResponse } from 'next/server'



export async function GET(
	request: Request,
	{ params }: { params: { city: string } },
) {
	try {
		const cityId = params.city

		if (!cityId) {
			return NextResponse.json(
				{ error: 'City ID is required' },
				{ status: 400 },
			)
		}

		// Find the city directly by ID
		const row: any = must(
			await db
				.from(T.cities)
				.select(`*, ${GEO_CONTENT}, country:${T.countries}(code, code3, ${GEO_CONTENT})`)
				.eq('id', cityId)
				.maybeSingle(),
		)

		if (!row) {
			return NextResponse.json({ error: 'City not found' }, { status: 404 })
		}

		// English city texts; English country name
		const city: any = keepTranslations(row, (t) => t.language === 'en-US')
		if (city.country) {
			city.country = keepTranslations(
				city.country,
				(t) => t.language === 'en-US' && t.type === 'country',
			)
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
				(t: any) => t.type === 'city',
			)

			// Find description translation
			const descriptionTranslation = city.content.translations.find(
				(t: any) => t.type === 'description',
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
			// No description: none is shown (descriptions are no longer generated on page views)
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
