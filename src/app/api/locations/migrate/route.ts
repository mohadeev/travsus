export const dynamic = "force-dynamic";
import { placesClient } from '@/lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'


export async function GET(request: NextRequest) {
	try {
		const prisma = placesClient

		// Get all places that need migration (don't have en-US translations)
		const allPlaces = await prisma.place.findMany({
			include: {
				content: {
					include: {
						translations: true,
					},
				},
			},
		})

		const placesNeedingMigration = []
		const placesWithEnUS = []

		for (const place of allPlaces) {
			const hasEnUS = place.content.translations.some(
				(t) => t.language === 'en-US',
			)
			if (hasEnUS) {
				placesWithEnUS.push(place)
			} else {
				placesNeedingMigration.push(place)
			}
		}

		// Migrate places that don't have en-US translations
		let migratedCount = 0
		const errors = []

		for (const place of placesNeedingMigration) {
			try {
				// Create en-US translation from existing data or first available translation
				const existingTranslation = place.content.translations[0]
				const nameText = existingTranslation?.text || `Place ${place.id}`
				const descriptionText =
					place.address ||
					`${place.type} in ${place.category || 'Unknown Category'}`

				// Create name translation
				await prisma.translatedText.create({
					data: {
						contentId: place.contentId,
						language: 'en-US',
						text: nameText,
						type: 'name',
					},
				})

				// Create description translation
				await prisma.translatedText.create({
					data: {
						contentId: place.contentId,
						language: 'en-US',
						text: descriptionText,
						type: 'description',
					},
				})

				migratedCount++
			} catch (error) {
				console.error(`Error migrating place ${place.id}:`, error)
				errors.push(`Place ${place.id}: ${error.message}`)
			}
		}

		return NextResponse.json({
			success: true,
			message: `Successfully migrated ${migratedCount} places to translation system`,
			totalPlaces: allPlaces.length,
			placesNeedingMigration: placesNeedingMigration.length,
			placesWithEnUS: placesWithEnUS.length,
			migratedCount,
			errors: errors.length > 0 ? errors : undefined,
		})
	} catch (error) {
		console.error('Error during places migration:', error)
		return NextResponse.json(
			{ success: false, message: 'Migration failed', error: error.message },
			{ status: 500 },
		)
	} finally {
		await placesClient.$disconnect()
	}
}
