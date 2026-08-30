export const dynamic = "force-dynamic";
import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'

function extractLanguageFromRequest(request: Request): string {
	const referer = request.headers.get('referer') || ''
	const origin = request.headers.get('origin') || ''

	// Try to extract language from referer or origin URL
	const urlToCheck = referer || origin
	const languageMatch = urlToCheck.match(/\/([a-z]{2}-[A-Z]{2})(?:\/|$)/)

	return languageMatch ? languageMatch[1] : 'en-US'
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const countryId = searchParams.get('countryId')
		const limit = searchParams.get('limit')
			? Number.parseInt(searchParams.get('limit')!)
			: 16

		if (!countryId) {
			return NextResponse.json(
				{ error: 'Country ID is required' },
				{ status: 400 },
			)
		}

		const detectedLanguage = extractLanguageFromRequest(request)

		const prisma = placesClient

		let cities = await prisma.city.findMany({
			where: {
				countryId: countryId,
				image: {
					isNot: null,
				},
			},
			include: {
				content: {
					include: {
						translations: {
							where: {
								language: detectedLanguage,
							},
						},
					},
				},
				country: {
					select: {
						code3: true,
					},
				},
			},
			take: limit,
		})

		if (
			cities.length === 0 ||
			cities.every((city) => !city.content?.translations?.length)
		) {
			cities = await prisma.city.findMany({
				where: {
					countryId: countryId,
					image: {
						isNot: null,
					},
				},
				include: {
					content: {
						include: {
							translations: {
								where: {
									language: 'en-US',
								},
							},
						},
					},
					country: {
						select: {
							code3: true,
						},
					},
				},
				take: limit,
			})
		}

		// Further filter to only include cities with an image URL
		const citiesWithImages = cities.filter(
			(city) => city.image && (city.image.url || city.image.uploadFrom),
		)

		const languageAvailable = citiesWithImages.some((city) =>
			city.content?.translations?.some((t) => t.language === detectedLanguage),
		)

		return NextResponse.json({
			cities: citiesWithImages,
			total: citiesWithImages.length,
			countryId,
			language: detectedLanguage,
			languageAvailable,
			fallbackUsed: !languageAvailable && detectedLanguage !== 'en-US',
		})
	} catch (error) {
		console.error('Error fetching cities:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch cities' },
			{ status: 500 },
		)
	}
}
