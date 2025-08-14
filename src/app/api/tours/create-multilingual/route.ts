import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to validate or generate ObjectID
function validateOrGenerateObjectId(id: string): string {
	// Check if it's a valid 24-character hex string (MongoDB ObjectID format)
	if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
		return id
	}
	// Generate a new ObjectID-like string (24 hex characters)
	return Array.from({ length: 24 }, () =>
		Math.floor(Math.random() * 16).toString(16),
	).join('')
}

// POST /api/tours/create-multilingual - Create tour with translations
export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const {
			translations,
			defaultLanguage = 'en-US',
			creatorId,
			businessId,
		} = body

		const validCreatorId = validateOrGenerateObjectId(
			creatorId || 'default-creator',
		)
		const validBusinessId = businessId
			? validateOrGenerateObjectId(businessId)
			: undefined

		const result = await prisma.$transaction(async (tx) => {
			// Create the tour first with default language values
			const defaultTranslation =
				translations[defaultLanguage] || Object.values(translations)[0]

			const tour = await tx.tour.create({
				data: {
					creatorId: validCreatorId,
					businessId: validBusinessId,
					lang: defaultLanguage,
					name: defaultTranslation.name,
					subtitle: defaultTranslation.subtitle,
					overview: defaultTranslation.overview,
					conclusion: defaultTranslation.conclusion,
				},
			})

			// Create translatable content for each field
			const contentIds: Record<string, string> = {}
			const fields = ['name', 'subtitle', 'overview', 'conclusion'] as const

			for (const field of fields) {
				const fieldTranslations: Array<{
					languageCode: string
					text: string
				}> = []

				for (const [lang, translation] of Object.entries(translations)) {
					if (translation[field]) {
						fieldTranslations.push({
							languageCode: lang,
							text: translation[field],
						})
					}
				}

				if (fieldTranslations.length > 0) {
					const translatableContent = await tx.translatableContent.create({
						data: {
							contentType: `tour_${field}`,
							entityId: tour.id,
							translations: {
								create: fieldTranslations,
							},
						},
					})
					contentIds[`${field}ContentId`] = translatableContent.id
				}
			}

			// Update tour with content IDs
			const updatedTour = await tx.tour.update({
				where: { id: tour.id },
				data: contentIds,
			})

			return updatedTour
		})

		return NextResponse.json({ tour: result })
	} catch (error) {
		console.error('Error creating multilingual tour:', error)
		return NextResponse.json(
			{ error: 'Failed to create tour' },
			{ status: 500 },
		)
	}
}
