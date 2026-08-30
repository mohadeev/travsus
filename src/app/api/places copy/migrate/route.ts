export const dynamic = "force-dynamic";
import { placesClient } from '@/lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
	try {
		const prisma = placesClient

		const [allCountries, allCities, allPlaces] = await Promise.all([
			prisma.country.findMany({
				include: {
					nameContent: {
						include: {
							translations: true,
						},
					},
					descriptionContent: {
						include: {
							translations: true,
						},
					},
				},
			}),
			prisma.city.findMany({
				include: {
					nameContent: {
						include: {
							translations: true,
						},
					},
					descriptionContent: {
						include: {
							translations: true,
						},
					},
				},
			}),
			prisma.place.findMany({
				include: {
					nameContent: {
						include: {
							translations: true,
						},
					},
					descriptionContent: {
						include: {
							translations: true,
						},
					},
				},
			}),
		])

		let totalMigrated = 0
		const errors = []

		for (const country of allCountries) {
			try {
				const hasEnUSName = country.nameContent?.translations.some(
					(t) => t.languageCode === 'en-US',
				)
				const hasEnUSDesc = country.descriptionContent?.translations.some(
					(t) => t.languageCode === 'en-US',
				)

				if (!hasEnUSName && country.name) {
					if (!country.nameContentId) {
						const nameContent = await prisma.translatableContent.create({
							data: { contentType: 'country_name', entityId: country.id },
						})
						await prisma.country.update({
							where: { id: country.id },
							data: { nameContentId: nameContent.id },
						})
						country.nameContentId = nameContent.id
					}

					await prisma.translatedText.create({
						data: {
							contentId: country.nameContentId,
							languageCode: 'en-US',
							text: country.name,
						},
					})
				}

				if (!hasEnUSDesc && country.description) {
					if (!country.descriptionContentId) {
						const descContent = await prisma.translatableContent.create({
							data: {
								contentType: 'country_description',
								entityId: country.id,
							},
						})
						await prisma.country.update({
							where: { id: country.id },
							data: { descriptionContentId: descContent.id },
						})
						country.descriptionContentId = descContent.id
					}

					await prisma.translatedText.create({
						data: {
							contentId: country.descriptionContentId,
							languageCode: 'en-US',
							text: country.description,
						},
					})
				}

				totalMigrated++
			} catch (error) {
				console.error(`Error migrating country ${country.id}:`, error)
				errors.push(`Country ${country.name}: ${error.message}`)
			}
		}

		for (const city of allCities) {
			try {
				const hasEnUSName = city.nameContent?.translations.some(
					(t) => t.languageCode === 'en-US',
				)
				const hasEnUSDesc = city.descriptionContent?.translations.some(
					(t) => t.languageCode === 'en-US',
				)

				if (!hasEnUSName && city.name) {
					if (!city.nameContentId) {
						const nameContent = await prisma.translatableContent.create({
							data: { contentType: 'city_name', entityId: city.id },
						})
						await prisma.city.update({
							where: { id: city.id },
							data: { nameContentId: nameContent.id },
						})
						city.nameContentId = nameContent.id
					}

					await prisma.translatedText.create({
						data: {
							contentId: city.nameContentId,
							languageCode: 'en-US',
							text: city.name,
						},
					})
				}

				if (!hasEnUSDesc && city.description) {
					if (!city.descriptionContentId) {
						const descContent = await prisma.translatableContent.create({
							data: { contentType: 'city_description', entityId: city.id },
						})
						await prisma.city.update({
							where: { id: city.id },
							data: { descriptionContentId: descContent.id },
						})
						city.descriptionContentId = descContent.id
					}

					await prisma.translatedText.create({
						data: {
							contentId: city.descriptionContentId,
							languageCode: 'en-US',
							text: city.description,
						},
					})
				}

				totalMigrated++
			} catch (error) {
				console.error(`Error migrating city ${city.id}:`, error)
				errors.push(`City ${city.name}: ${error.message}`)
			}
		}

		for (const place of allPlaces) {
			try {
				const hasEnUSName = place.nameContent?.translations.some(
					(t) => t.languageCode === 'en-US',
				)
				const hasEnUSDesc = place.descriptionContent?.translations.some(
					(t) => t.languageCode === 'en-US',
				)

				if (!hasEnUSName && place.name) {
					if (!place.nameContentId) {
						const nameContent = await prisma.translatableContent.create({
							data: { contentType: 'place_name', entityId: place.id },
						})
						await prisma.place.update({
							where: { id: place.id },
							data: { nameContentId: nameContent.id },
						})
						place.nameContentId = nameContent.id
					}

					await prisma.translatedText.create({
						data: {
							contentId: place.nameContentId,
							languageCode: 'en-US',
							text: place.name,
						},
					})
				}

				if (!hasEnUSDesc && (place.description || place.address)) {
					if (!place.descriptionContentId) {
						const descContent = await prisma.translatableContent.create({
							data: { contentType: 'place_description', entityId: place.id },
						})
						await prisma.place.update({
							where: { id: place.id },
							data: { descriptionContentId: descContent.id },
						})
						place.descriptionContentId = descContent.id
					}

					await prisma.translatedText.create({
						data: {
							contentId: place.descriptionContentId,
							languageCode: 'en-US',
							text:
								place.description ||
								place.address ||
								`${place.type} in ${place.category || 'Unknown'}`,
						},
					})
				}

				totalMigrated++
			} catch (error) {
				console.error(`Error migrating place ${place.id}:`, error)
				errors.push(`Place ${place.name}: ${error.message}`)
			}
		}

		return NextResponse.json({
			success: true,
			message: `Successfully migrated ${totalMigrated} locations (${allCountries.length} countries, ${allCities.length} cities, ${allPlaces.length} places) to translation system`,
			totalMigrated,
			countries: allCountries.length,
			cities: allCities.length,
			places: allPlaces.length,
			errors: errors.length > 0 ? errors : undefined,
		})
	} catch (error) {
		console.error('Error during locations migration:', error)
		return NextResponse.json(
			{ success: false, message: 'Migration failed', error: error.message },
			{ status: 500 },
		)
	} finally {
		await placesClient.$disconnect()
	}
}
