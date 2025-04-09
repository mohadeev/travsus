import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Removed dynamic = 'force-dynamic'

export async function GET(
	request: Request,
	{ params }: { params: { code: string } },
) {
	try {
		const code = params.code
		console.log('Searching for country with code:', code)

		if (!code) {
			return NextResponse.json(
				{ error: 'Country code is required' },
				{ status: 400 },
			)
		}

		// Get the country by code with its content and translations
		const country = await placesClient.country.findUnique({
			where: {
				code3: code.toLocaleUpperCase(),
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
			},
		})

		if (!country) {
			return NextResponse.json({ error: 'Country not found' }, { status: 404 })
		}

		// Extract the name and description from translations
		let name = ''
		let description = ''

		if (country.content && country.content.translations) {
			// Find name translation (type = "country")
			const nameTranslation = country.content.translations.find(
				(t) => t.type === 'country',
			)

			// Find description translation
			const descriptionTranslation = country.content.translations.find(
				(t) => t.type === 'description',
			)

			if (nameTranslation) {
				name = nameTranslation.text
			}

			if (descriptionTranslation) {
				description = descriptionTranslation.text
			}
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
