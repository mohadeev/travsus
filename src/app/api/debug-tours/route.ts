import { placesClient } from '@/lib/prisma'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
	try {
		const tours = await prisma.tour.findMany({
			include: {
				startAddress: true,
				endAddress: true,
			},
		})

		console.log('[v0] Total tours found:', tours.length)

		const uniqueCityNames = new Set<string>()
		tours.forEach((tour) => {
			if (tour.startAddress?.city)
				uniqueCityNames.add(tour.startAddress.city.toLowerCase())
			if (tour.endAddress?.city)
				uniqueCityNames.add(tour.endAddress.city.toLowerCase())
		})

		console.log('[v0] Unique city names to search:', uniqueCityNames.size)

		const cityMatches = new Map<string, any>()

		for (const cityName of uniqueCityNames) {
			const matchingCities = await placesClient.city.findMany({
				where: {
					content: {
						translations: {
							some: {
								text: {
									contains: cityName,
									mode: 'insensitive',
								},
							},
						},
					},
				},
				include: {
					content: {
						include: {
							translations: true,
						},
					},
				},
				take: 5, // Limit results per search
			})

			if (matchingCities.length > 0) {
				cityMatches.set(cityName, matchingCities[0]) // Take first match
			}
		}

		console.log('[v0] Found city matches:', cityMatches.size)

		tours.forEach((tour, index) => {
			const startCityMatch = tour.startAddress?.city
				? cityMatches.get(tour.startAddress.city.toLowerCase())
				: null
			const endCityMatch = tour.endAddress?.city
				? cityMatches.get(tour.endAddress.city.toLowerCase())
				: null

			console.log(`[v0] Tour ${index + 1}:`, {
				id: tour.id,
				name: tour.name || 'No name',
				startAddress: {
					id: tour.startAddress?.id,
					city: tour.startAddress?.city,
					street: tour.startAddress?.street,
					country: tour.startAddress?.country,
					matchingCity: startCityMatch
						? {
								id: startCityMatch.id,
								translations: startCityMatch.content.translations.map(
									(t: any) => ({
										language: t.language,
										text: t.text,
									}),
								),
							}
						: 'No match found',
				},
				endAddress: {
					id: tour.endAddress?.id,
					city: tour.endAddress?.city,
					street: tour.endAddress?.street,
					country: tour.endAddress?.country,
					matchingCity: endCityMatch
						? {
								id: endCityMatch.id,
								translations: endCityMatch.content.translations.map(
									(t: any) => ({
										language: t.language,
										text: t.text,
									}),
								),
							}
						: 'No match found',
				},
			})
		})

		return Response.json({
			success: true,
			toursCount: tours.length,
			uniqueCityNames: uniqueCityNames.size,
			cityMatches: cityMatches.size,
			message: 'Check console for detailed tour data with city matches',
		})
	} catch (error) {
		console.error('[v0] Error fetching data:', error)
		return Response.json(
			{
				success: false,
				error: 'Failed to fetch tours and cities',
			},
			{ status: 500 },
		)
	}
}
