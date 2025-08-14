import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
	try {
		const allTours = await prisma.tour.findMany({
			select: {
				id: true,
				name: true,
				subtitle: true,
				overview: true,
				conclusion: true,
				days: true,
			},
		})

		const toursToMigrate = []
		const toursWithTranslations = []

		for (const tour of allTours) {
			try {
				const hasEnUSTranslations = await prisma.translatedText.findFirst({
					where: {
						languageCode: 'en-US',
						content: {
							entityId: tour.id,
						},
					},
				})

				if (hasEnUSTranslations) {
					toursWithTranslations.push({
						id: tour.id,
						name: tour.name,
						hasEnUS: true,
					})
				} else {
					toursToMigrate.push(tour)
				}
			} catch (error) {
				toursToMigrate.push(tour)
			}
		}

		let migratedCount = 0

		for (const tour of toursToMigrate) {
			await prisma.$transaction(async (tx) => {
				const contentIds: any = {}

				if (tour.name) {
					const nameContent = await tx.translatableContent.create({
						data: {
							contentType: 'tour_name',
							entityId: tour.id,
						},
					})

					await tx.translatedText.create({
						data: {
							contentId: nameContent.id,
							languageCode: 'en-US',
							text: tour.name,
						},
					})

					contentIds.nameContentId = nameContent.id
				}

				if (tour.subtitle) {
					const subtitleContent = await tx.translatableContent.create({
						data: {
							contentType: 'tour_subtitle',
							entityId: tour.id,
						},
					})

					await tx.translatedText.create({
						data: {
							contentId: subtitleContent.id,
							languageCode: 'en-US',
							text: tour.subtitle,
						},
					})

					contentIds.subtitleContentId = subtitleContent.id
				}

				if (tour.overview) {
					const overviewContent = await tx.translatableContent.create({
						data: {
							contentType: 'tour_overview',
							entityId: tour.id,
						},
					})

					await tx.translatedText.create({
						data: {
							contentId: overviewContent.id,
							languageCode: 'en-US',
							text: tour.overview,
						},
					})

					contentIds.overviewContentId = overviewContent.id
				}

				if (tour.conclusion) {
					const conclusionContent = await tx.translatableContent.create({
						data: {
							contentType: 'tour_conclusion',
							entityId: tour.id,
						},
					})

					await tx.translatedText.create({
						data: {
							contentId: conclusionContent.id,
							languageCode: 'en-US',
							text: tour.conclusion,
						},
					})

					contentIds.conclusionContentId = conclusionContent.id
				}

				let updatedDays = tour.days
				if (Array.isArray(tour.days) && tour.days.length > 0) {
					updatedDays = await Promise.all(
						tour.days.map(async (day: any) => {
							let dayNameContentId = null
							let dayDescriptionContentId = null

							if (day.name) {
								const dayNameContent = await tx.translatableContent.create({
									data: {
										contentType: 'tour_day_name',
										entityId: tour.id,
									},
								})

								await tx.translatedText.create({
									data: {
										contentId: dayNameContent.id,
										languageCode: 'en-US',
										text: day.name,
									},
								})

								dayNameContentId = dayNameContent.id
							}

							if (day.description) {
								const dayDescriptionContent =
									await tx.translatableContent.create({
										data: {
											contentType: 'tour_day_description',
											entityId: tour.id,
										},
									})

								await tx.translatedText.create({
									data: {
										contentId: dayDescriptionContent.id,
										languageCode: 'en-US',
										text: day.description,
									},
								})

								dayDescriptionContentId = dayDescriptionContent.id
							}

							return {
								...day,
								nameContentId: dayNameContentId,
								descriptionContentId: dayDescriptionContentId,
							}
						}),
					)
				}

				try {
					await tx.tour.update({
						where: { id: tour.id },
						data: {
							...contentIds,
							days: updatedDays,
						},
					})
				} catch (updateError) {
					console.log(
						`Could not update tour ${tour.id} with content IDs, but translations were created`,
					)
				}
			})

			migratedCount++
		}

		return NextResponse.json({
			success: true,
			totalToursInDatabase: allTours.length,
			toursAlreadyTranslated: toursWithTranslations.length,
			toursMigrated: migratedCount,
			message:
				migratedCount > 0
					? `Successfully migrated ${migratedCount} tours`
					: 'All tours already have translations',
			tours: {
				migrated: migratedCount,
				withTranslations: toursWithTranslations,
			},
		})
	} catch (error) {
		console.error('Migration error:', error)
		return NextResponse.json(
			{
				success: false,
				error: 'Migration failed',
				errorMessage: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	}
}

export async function POST() {
	try {
		const allTours = await prisma.tour.findMany({
			select: {
				id: true,
				name: true,
				subtitle: true,
				overview: true,
				conclusion: true,
				days: true,
			},
		})

		const toursToMigrate = []

		for (const tour of allTours) {
			try {
				const hasEnUSTranslations = await prisma.translatedText.findFirst({
					where: {
						languageCode: 'en-US',
						content: {
							entityId: tour.id,
						},
					},
				})

				if (!hasEnUSTranslations) {
					toursToMigrate.push(tour)
				}
			} catch (error) {
				toursToMigrate.push(tour)
			}
		}

		let migratedCount = 0

		for (const tour of toursToMigrate) {
			await prisma.$transaction(async (tx) => {
				const contentIds: any = {}

				if (tour.name) {
					const nameContent = await tx.translatableContent.create({
						data: {
							contentType: 'tour_name',
							entityId: tour.id,
						},
					})

					await tx.translatedText.create({
						data: {
							contentId: nameContent.id,
							languageCode: 'en-US',
							text: tour.name,
						},
					})

					contentIds.nameContentId = nameContent.id
				}

				if (tour.subtitle) {
					const subtitleContent = await tx.translatableContent.create({
						data: {
							contentType: 'tour_subtitle',
							entityId: tour.id,
						},
					})

					await tx.translatedText.create({
						data: {
							contentId: subtitleContent.id,
							languageCode: 'en-US',
							text: tour.subtitle,
						},
					})

					contentIds.subtitleContentId = subtitleContent.id
				}

				if (tour.overview) {
					const overviewContent = await tx.translatableContent.create({
						data: {
							contentType: 'tour_overview',
							entityId: tour.id,
						},
					})

					await tx.translatedText.create({
						data: {
							contentId: overviewContent.id,
							languageCode: 'en-US',
							text: tour.overview,
						},
					})

					contentIds.overviewContentId = overviewContent.id
				}

				if (tour.conclusion) {
					const conclusionContent = await tx.translatableContent.create({
						data: {
							contentType: 'tour_conclusion',
							entityId: tour.id,
						},
					})

					await tx.translatedText.create({
						data: {
							contentId: conclusionContent.id,
							languageCode: 'en-US',
							text: tour.conclusion,
						},
					})

					contentIds.conclusionContentId = conclusionContent.id
				}

				let updatedDays = tour.days
				if (Array.isArray(tour.days) && tour.days.length > 0) {
					updatedDays = await Promise.all(
						tour.days.map(async (day: any) => {
							let dayNameContentId = null
							let dayDescriptionContentId = null

							if (day.name) {
								const dayNameContent = await tx.translatableContent.create({
									data: {
										contentType: 'tour_day_name',
										entityId: tour.id,
									},
								})

								await tx.translatedText.create({
									data: {
										contentId: dayNameContent.id,
										languageCode: 'en-US',
										text: day.name,
									},
								})

								dayNameContentId = dayNameContent.id
							}

							if (day.description) {
								const dayDescriptionContent =
									await tx.translatableContent.create({
										data: {
											contentType: 'tour_day_description',
											entityId: tour.id,
										},
									})

								await tx.translatedText.create({
									data: {
										contentId: dayDescriptionContent.id,
										languageCode: 'en-US',
										text: day.description,
									},
								})

								dayDescriptionContentId = dayDescriptionContent.id
							}

							return {
								...day,
								nameContentId: dayNameContentId,
								descriptionContentId: dayDescriptionContentId,
							}
						}),
					)
				}

				try {
					await tx.tour.update({
						where: { id: tour.id },
						data: {
							...contentIds,
							days: updatedDays,
						},
					})
				} catch (updateError) {
					console.log(
						`Could not update tour ${tour.id} with content IDs, but translations were created`,
					)
				}
			})

			migratedCount++
		}

		return NextResponse.json({
			success: true,
			message: `Successfully migrated ${migratedCount} tours with days to translation system`,
			migratedCount,
			totalToursChecked: allTours.length,
		})
	} catch (error) {
		console.error('Migration error:', error)
		return NextResponse.json(
			{
				success: false,
				error: 'Migration failed',
				errorMessage: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	}
}
