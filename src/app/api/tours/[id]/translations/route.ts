export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from 'next/server'
import { db, T, must } from '@/lib/db'
import { canEdit, currentUser } from '@/lib/guards'
import { contentWithTexts, upsertTranslatedText } from '@/lib/translations'

// GET /api/tours/[id]/translations - Get tour translations
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { searchParams } = new URL(request.url)
		const language = searchParams.get('language')

		const tour: any = must(
			await db
				.from(T.tours)
				.select(
					`*,
					nameContent:${contentWithTexts('nameContentId')},
					subtitleContent:${contentWithTexts('subtitleContentId')},
					overviewContent:${contentWithTexts('overviewContentId')},
					conclusionContent:${contentWithTexts('conclusionContentId')}`,
				)
				.eq('id', params.id)
				.maybeSingle(),
		)

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
				content.translations.forEach((translation: any) => {
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
			const dayContents: any[] = dayContentIds.length
				? must(
						await db
							.from(T.translatableContents)
							.select(`*, translations:${T.translatedTexts}(*)`)
							.in('id', dayContentIds),
					)
				: []

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

		const tour: any = must(
			await db.from(T.tours).select('*').eq('id', params.id).maybeSingle(),
		)

		if (!tour) {
			return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
		}
		if (!canEdit(await currentUser(), tour.creatorId)) {
			return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
		}

		const results = []
		const errors = []

		// Process each language's translations
		for (const [language, translation] of Object.entries<any>(translations)) {
			try {
				// Process tour-level fields
				for (const [field, text] of Object.entries(translation)) {
					if (field !== 'days' && text) {
						const contentId = tour[`${field}ContentId`] as string

						if (contentId) {
							try {
								await upsertTranslatedText(contentId, language, text as string)
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
									await upsertTranslatedText(
										day.nameContentId,
										language,
										dayTranslation.name,
									)
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
									await upsertTranslatedText(
										day.descriptionContentId,
										language,
										dayTranslation.description,
									)
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
