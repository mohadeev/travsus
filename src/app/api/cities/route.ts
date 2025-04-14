import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const countryCode = searchParams.get('countryCode')
		const limit = searchParams.get('limit')
			? parseInt(searchParams.get('limit')!)
			: 16

		if (!countryCode) {
			return NextResponse.json(
				{ error: 'Country code is required' },
				{ status: 400 },
			)
		}

		const prisma = placesClient

		// Fetch cities directly by country code (code3)
		const cities = await prisma.city.findMany({
			where: {
				country: {
					code3: countryCode,
				},
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
			countryCode,
		})
	} catch (error) {
		console.error('Error fetching cities:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch cities' },
			{ status: 500 },
		)
	}
}
