export const dynamic = "force-dynamic";
import { db, T, must, newId } from '@/lib/db'
import { GEO_CONTENT, keepTranslations } from '@/lib/geo'
import { NextResponse } from 'next/server'


function extractLanguageFromRequest(request: Request): string {
	const referer = request.headers.get('referer') || ''
	const origin = request.headers.get('origin') || ''

	// Try to extract language from referer first, then origin
	const urlToCheck = referer || origin
	const languageMatch = urlToCheck.match(/\/([a-z]{2}-[A-Z]{2})(?:\/|$)/)

	return languageMatch ? languageMatch[1] : 'en-US'
}


export async function GET(
	request: Request,
	{ params }: { params: { code: string } },
) {
	try {
		const detectedLanguage = extractLanguageFromRequest(request)

		const countryId = params.code

		if (!countryId) {
			return NextResponse.json(
				{ error: 'Country ID is required' },
				{ status: 400 },
			)
		}

		const row: any = must(
			await db
				.from(T.countries)
				.select(`*, ${GEO_CONTENT}`)
				.eq('id', countryId)
				.maybeSingle(),
		)

		// Texts in the visitor's language, otherwise English
		let country: any = row && keepTranslations(row, (t) => t.language === detectedLanguage)
		let languageAvailable = true
		if (row && !country.content?.translations?.length) {
			languageAvailable = false
			country = keepTranslations(row, (t) => t.language === 'en-US')
		}

		if (!country) {
			return NextResponse.json({ error: 'Country not found' }, { status: 404 })
		}

		// Extract the name and description from translations
		let name = ''
		let description = ''

		if (country.content && country.content.translations) {
			// Find name translation (type = "country")
			const nameTranslation = country.content.translations.find(
				(t: any) => t.type === 'country',
			)

			// Find description translation
			const descriptionTranslation = country.content.translations.find(
				(t: any) => t.type === 'description',
			)

			if (nameTranslation) {
				name = nameTranslation.text
			} else if (country.content.translations.length > 0) {
				// Fallback to first translation if specific type not found
				name = country.content.translations[0].text
			}

			if (descriptionTranslation) {
				description = descriptionTranslation.text
			}
			// No description: none is shown (descriptions are no longer generated on page views)
		}

		// Prepare the response data
		const countryData = {
			id: country.id,
			code: country.code,
			code3: country.code3,
			name: name,
			description: description,
			image: country.image?.url,
			geo: country.geo,
			languageAvailable: languageAvailable,
			detectedLanguage: detectedLanguage,
			message: languageAvailable
				? `Content available in ${detectedLanguage}`
				: `Language ${detectedLanguage} not available, showing English content`,
		}

		// Return the data without cache control headers
		return NextResponse.json(countryData)
	} catch (error) {
		console.error('Error fetching country:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch country data' },
			{ status: 500 },
		)
	}
}
