export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/tours/[id]/translations - Get tour translations
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { searchParams } = new URL(request.url)
		const language = searchParams.get('language')

		const tour = await prisma.tour.findUnique({
			where: { id: params.id },
			include: {
				nameContent: {
					include: {
						translations: true,
					},
				},
				subtitleContent: {
					include: {
						translations: true,
					},
				},
				overviewContent: {
					include: {
						translations: true,
					},
				},
				conclusionContent: {
					include: {
						translations: true,
					},
				},
			},
		})

		if (!tour) {
			return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
		}

		const allTranslations: Record<string, Record<string, any>> = {}
		const availableLanguages = new Set<string>()

		// Process tour-level content fields
		const contentFields = [
			{ content: tour.nameContent, field: 'name' },
			{ content: tour.subtitleContent, field: 'subtitle' },
			{ content: tour.overviewContent, field: 'overview' },
			{ content: tour.conclusionContent, field: 'conclusion' },
		]

		contentFields.forEach(({ content, field }) => {
			if (content?.translations) {
				content.translations.forEach((translation) => {
					availableLanguages.add(translation.languageCode)

					if (!allTranslations[translation.languageCode]) {
						allTranslations[translation.languageCode] = { days: [] }
					}

					allTranslations[translation.languageCode][field] = translation.text
				})
			}
		})

		if (tour.days && Array.isArray(tour.days)) {
			// Collect all day content IDs
			const dayContentIds: string[] = []
			tour.days.forEach((day: any) => {
				if (day.nameContentId) dayContentIds.push(day.nameContentId)
				if (day.descriptionContentId)
					dayContentIds.push(day.descriptionContentId)
			})

			// Fetch all day translations at once
			const dayContents = await prisma.translatableContent.findMany({
				where: {
					id: { in: dayContentIds },
				},
				include: {
					translations: true,
				},
			})

			// Create a map for quick lookup
			const contentMap = new Map()
			dayContents.forEach((content) => {
				contentMap.set(content.id, content)
			})

			// Process each day
			tour.days.forEach((day: any, dayIndex: number) => {
				// Process day name translations
				if (day.nameContentId) {
					const nameContent = contentMap.get(day.nameContentId)
					if (nameContent?.translations) {
						nameContent.translations.forEach((translation: any) => {
							availableLanguages.add(translation.languageCode)

							if (!allTranslations[translation.languageCode]) {
								allTranslations[translation.languageCode] = { days: [] }
							}

							if (!allTranslations[translation.languageCode].days[dayIndex]) {
								allTranslations[translation.languageCode].days[dayIndex] = {}
							}

							allTranslations[translation.languageCode].days[dayIndex].name =
								translation.text
						})
					}
				}

				// Process day description translations
				if (day.descriptionContentId) {
					const descContent = contentMap.get(day.descriptionContentId)
					if (descContent?.translations) {
						descContent.translations.forEach((translation: any) => {
							availableLanguages.add(translation.languageCode)

							if (!allTranslations[translation.languageCode]) {
								allTranslations[translation.languageCode] = { days: [] }
							}

							if (!allTranslations[translation.languageCode].days[dayIndex]) {
								allTranslations[translation.languageCode].days[dayIndex] = {}
							}

							allTranslations[translation.languageCode].days[
								dayIndex
							].description = translation.text
						})
					}
				}
			})
		}

		return NextResponse.json({
			...tour,
			translations: language ? allTranslations[language] : allTranslations,
			availableLanguages: Array.from(availableLanguages),
		})
	} catch (error) {
		console.error('Error fetching tour translations:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch translations' },
			{ status: 500 },
		)
	}
}

// PUT /api/tours/[id]/translations - Update tour translations
export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const body = await request.json()
		const { translations } = body

		const tour = await prisma.tour.findUnique({
			where: { id: params.id },
		})

		if (!tour) {
			return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
		}

		const results = []
		const errors = []

		// Process each language's translations
		for (const [language, translation] of Object.entries(translations)) {
			try {
				// Process tour-level fields
				for (const [field, text] of Object.entries(translation)) {
					if (field !== 'days' && text) {
						const contentIdField = `${field}ContentId` as keyof typeof tour
						const contentId = tour[contentIdField] as string

						if (contentId) {
							try {
								await prisma.translatedText.upsert({
									where: {
										contentId_languageCode: {
											contentId,
											languageCode: language,
										},
									},
									update: {
										text: text as string,
										updatedAt: new Date(),
									},
									create: {
										contentId,
										languageCode: language,
										text: text as string,
									},
								})
								results.push(`Updated ${field} for ${language}`)
							} catch (error) {
								errors.push(
									`Failed to update ${field} for ${language}: ${error}`,
								)
							}
						}
					}
				}

				// Process day translations
				if (translation.days && Array.isArray(translation.days) && tour.days) {
					for (
						let dayIndex = 0;
						dayIndex < translation.days.length;
						dayIndex++
					) {
						const dayTranslation = translation.days[dayIndex]
						const day = tour.days[dayIndex]

						if (dayTranslation && day) {
							// Update day name translation
							if (dayTranslation.name && day.nameContentId) {
								try {
									await prisma.translatedText.upsert({
										where: {
											contentId_languageCode: {
												contentId: day.nameContentId,
												languageCode: language,
											},
										},
										update: {
											text: dayTranslation.name,
											updatedAt: new Date(),
										},
										create: {
											contentId: day.nameContentId,
											languageCode: language,
											text: dayTranslation.name,
										},
									})
									results.push(
										`Updated day ${dayIndex + 1} name for ${language}`,
									)
								} catch (error) {
									errors.push(
										`Failed to update day ${dayIndex + 1} name for ${language}: ${error}`,
									)
								}
							}

							// Update day description translation
							if (dayTranslation.description && day.descriptionContentId) {
								try {
									await prisma.translatedText.upsert({
										where: {
											contentId_languageCode: {
												contentId: day.descriptionContentId,
												languageCode: language,
											},
										},
										update: {
											text: dayTranslation.description,
											updatedAt: new Date(),
										},
										create: {
											contentId: day.descriptionContentId,
											languageCode: language,
											text: dayTranslation.description,
										},
									})
									results.push(
										`Updated day ${dayIndex + 1} description for ${language}`,
									)
								} catch (error) {
									errors.push(
										`Failed to update day ${dayIndex + 1} description for ${language}: ${error}`,
									)
								}
							}
						}
					}
				}
			} catch (error) {
				errors.push(`Failed to process translations for ${language}: ${error}`)
			}
		}

		return NextResponse.json({
			success: true,
			results: results.length,
			errors: errors.length,
			details: { results, errors },
		})
	} catch (error) {
		console.error('Error updating tour translations:', error)
		return NextResponse.json(
			{ error: 'Failed to update translations' },
			{ status: 500 },
		)
	}
}
