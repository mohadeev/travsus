export const dynamic = "force-dynamic";
import { placesClient } from '@/lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'


export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const prisma = placesClient
		const locationId = params.id
		const { searchParams } = new URL(request.url)
		const type = searchParams.get('type') || 'country'

		let location
		if (type === 'country') {
			location = await prisma.country.findUnique({
				where: { id: locationId },
				include: {
					content: { include: { translations: true } },
				},
			})
		} else if (type === 'city') {
			location = await prisma.city.findUnique({
				where: { id: locationId },
				include: {
					content: { include: { translations: true } },
				},
			})
		} else {
			location = await prisma.place.findUnique({
				where: { id: locationId },
				include: {
					content: { include: { translations: true } },
				},
			})
		}

		if (!location) {
			return NextResponse.json(
				{ success: false, message: 'Location not found' },
				{ status: 404 },
			)
		}

		const translationsByLanguage: any = {}
		const availableLanguages: string[] = []

		location.content?.translations.forEach((translation) => {
			if (!translationsByLanguage[translation.language]) {
				translationsByLanguage[translation.language] = {
					name: '',
					description: '',
				}
				availableLanguages.push(translation.language)
			}

			// Handle different translation types
			if (translation.type === type) {
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
		console.error('Error fetching location translations:', error)
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
		const locationId = params.id
		const { translations } = await request.json()
		const { searchParams } = new URL(request.url)
		const type = searchParams.get('type') || 'country'

		let location
		if (type === 'country') {
			location = await prisma.country.findUnique({
				where: { id: locationId },
				select: { contentId: true },
			})
		} else if (type === 'city') {
			location = await prisma.city.findUnique({
				where: { id: locationId },
				select: { contentId: true },
			})
		} else {
			location = await prisma.place.findUnique({
				where: { id: locationId },
				select: { contentId: true },
			})
		}

		if (!location || !location.contentId) {
			return NextResponse.json(
				{ success: false, message: 'Location not found' },
				{ status: 404 },
			)
		}

		const results = []
		const errors = []

		for (const [language, translationData] of Object.entries(translations)) {
			if (!translationData || typeof translationData !== 'object') continue

			const { name, description } = translationData as {
				name: string
				description: string
			}

			// Handle name translation
			if (name && name.trim()) {
				try {
					const existingNameTranslation = await prisma.translatedText.findFirst(
						{
							where: {
								contentId: location.contentId,
								language: language,
								type: type,
							},
						},
					)

					if (existingNameTranslation) {
						await prisma.translatedText.update({
							where: { id: existingNameTranslation.id },
							data: { text: name.trim() },
						})
					} else {
						await prisma.translatedText.create({
							data: {
								contentId: location.contentId,
								language: language,
								text: name.trim(),
								type: type,
							},
						})
					}

					results.push(`${language} name: Updated successfully`)
				} catch (error) {
					console.error(`Error updating ${language} name:`, error)
					errors.push(`${language} name: ${error.message}`)
				}
			}

			// Handle description translation
			if (description && description.trim()) {
				try {
					const existingDescTranslation = await prisma.translatedText.findFirst(
						{
							where: {
								contentId: location.contentId,
								language: language,
								type: 'description',
							},
						},
					)

					if (existingDescTranslation) {
						await prisma.translatedText.update({
							where: { id: existingDescTranslation.id },
							data: { text: description.trim() },
						})
					} else {
						await prisma.translatedText.create({
							data: {
								contentId: location.contentId,
								language: language,
								text: description.trim(),
								type: 'description',
							},
						})
					}

					results.push(`${language} description: Updated successfully`)
				} catch (error) {
					console.error(`Error updating ${language} description:`, error)
					errors.push(`${language} description: ${error.message}`)
				}
			}
		}

		return NextResponse.json({
			success: errors.length === 0,
			message: `Processed ${Object.keys(translations).length} languages`,
			results,
			errors: errors.length > 0 ? errors : undefined,
		})
	} catch (error) {
		console.error('Error updating location translations:', error)
		return NextResponse.json(
			{ success: false, message: 'Failed to update translations' },
			{ status: 500 },
		)
	} finally {
		await placesClient.$disconnect()
	}
}
