import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'

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

		const prisma = placesClient

		// Fetch cities directly by countryId
		const cities = await prisma.city.findMany({
			where: {
				countryId: countryId, // Use countryId directly
				// Only get cities that have an image
				image: {
					isNot: null,
				},
			},
			include: {
				content: {
					include: {
						translations: {
							where: {
								language: 'en', // Default to English translations
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

		// Further filter to only include cities with an image URL
		const citiesWithImages = cities.filter(
			(city) => city.image && (city.image.url || city.image.uploadFrom),
		)

		return NextResponse.json({
			cities: citiesWithImages,
			total: citiesWithImages.length,
			countryId, // Return countryId instead of countryCode
		})
	} catch (error) {
		console.error('Error fetching cities:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch cities' },
			{ status: 500 },
		)
	}
}
