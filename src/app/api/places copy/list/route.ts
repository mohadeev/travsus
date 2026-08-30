export const dynamic = "force-dynamic";
import { placesClient } from '@/lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
	try {
		const prisma = placesClient

		// Get all places with their translation content
		const places = await prisma.place.findMany({
			include: {
				content: {
					include: {
						translations: true,
					},
				},
				city: {
					include: {
						content: {
							include: {
								translations: true,
							},
						},
					},
				},
				country: {
					include: {
						content: {
							include: {
								translations: true,
							},
						},
					},
				},
			},
			take: 100,
		})

		// Transform places data
		const transformedPlaces = places.map((place) => ({
			id: place.id,
			name:
				place.content.translations.find((t) => t.language === 'en-US')?.text ||
				place.content.translations[0]?.text ||
				'Unnamed Place',
			type: place.type,
			category: place.category,
			subcategory: place.subcategory,
			rating: place.rating,
			address: place.address,
			website: place.website,
			phone: place.phone,
			geo: place.geo,
			image: place.image,
			city: place.city
				? {
						name:
							place.city.content.translations.find(
								(t) => t.language === 'en-US',
							)?.text ||
							place.city.content.translations[0]?.text ||
							'Unknown City',
					}
				: null,
			country: place.country
				? {
						name:
							place.country.content.translations.find(
								(t) => t.language === 'en-US',
							)?.text ||
							place.country.content.translations[0]?.text ||
							'Unknown Country',
					}
				: null,
			availableLanguages: [
				...new Set(place.content.translations.map((t) => t.language)),
			],
		}))

		return NextResponse.json({
			success: true,
			places: transformedPlaces,
		})
	} catch (error) {
		console.error('Error fetching places:', error)
		return NextResponse.json(
			{ success: false, message: 'Failed to fetch places' },
			{ status: 500 },
		)
	} finally {
		await placesClient.$disconnect()
	}
}
