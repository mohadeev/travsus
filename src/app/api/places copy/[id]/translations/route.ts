export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { placesClient } from '@/lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const prisma = placesClient
		const placeId = params.id

		// Get place with all translations
		const place = await prisma.place.findUnique({
			where: { id: placeId },
			include: {
				content: {
					include: {
						translations: true,
					},
				},
			},
		})

		if (!place) {
			return NextResponse.json(
				{ success: false, message: 'Place not found' },
				{ status: 404 },
			)
		}

		// Group translations by language
		const translationsByLanguage: any = {}
		const availableLanguages: string[] = []

		place.content.translations.forEach((translation) => {
			if (!translationsByLanguage[translation.language]) {
				translationsByLanguage[translation.language] = {}
				availableLanguages.push(translation.language)
			}

			if (translation.type === 'name') {
				translationsByLanguage[translation.language].name = translation.text
			} else if (translation.type === 'description') {
				translationsByLanguage[translation.language].description =
					translation.text
			}
		})

		return NextResponse.json({
			success: true,
			translations: translationsByLanguage,
			availableLanguages: [...new Set(availableLanguages)],
		})
	} catch (error) {
		console.error('Error fetching place translations:', error)
		return NextResponse.json(
			{ success: false, message: 'Failed to fetch translations' },
			{ status: 500 },
		)
	} finally {
		await placesClient.$disconnect()
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const prisma = placesClient
		const placeId = params.id
		const { translations } = await request.json()

		// Get place to verify it exists
		const place = await prisma.place.findUnique({
			where: { id: placeId },
			select: { contentId: true },
		})

		if (!place) {
			return NextResponse.json(
				{ success: false, message: 'Place not found' },
				{ status: 404 },
			)
		}

		const results = []
		const errors = []

		// Process each language
		for (const [languageCode, translation] of Object.entries(translations)) {
			const typedTranslation = translation as {
				name?: string
				description?: string
			}

			try {
				// Update name translation
				if (typedTranslation.name) {
					await prisma.translatedText.upsert({
						where: {
							contentId_language: {
								contentId: place.contentId,
								language: languageCode,
							},
						},
						update: {
							text: typedTranslation.name,
						},
						create: {
							contentId: place.contentId,
							language: languageCode,
							text: typedTranslation.name,
							type: 'name',
						},
					})
				}

				// Update description translation
				if (typedTranslation.description) {
					await prisma.translatedText.upsert({
						where: {
							contentId_language: {
								contentId: place.contentId,
								language: languageCode,
							},
						},
						update: {
							text: typedTranslation.description,
						},
						create: {
							contentId: place.contentId,
							language: languageCode,
							text: typedTranslation.description,
							type: 'description',
						},
					})
				}

				results.push(`${languageCode}: Updated successfully`)
			} catch (error) {
				console.error(`Error updating ${languageCode}:`, error)
				errors.push(`${languageCode}: ${error.message}`)
			}
		}

		return NextResponse.json({
			success: errors.length === 0,
			message: `Processed ${Object.keys(translations).length} languages`,
			results,
			errors: errors.length > 0 ? errors : undefined,
		})
	} catch (error) {
		console.error('Error updating place translations:', error)
		return NextResponse.json(
			{ success: false, message: 'Failed to update translations' },
			{ status: 500 },
		)
	} finally {
		await placesClient.$disconnect()
	}
}
