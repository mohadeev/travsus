import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { updateLineItemsLogic } from '../updateLineItems/updateLineItemsLogic'

const prisma = new PrismaClient()

// GET /api/tours/search/:query
export async function GET(request: Request) {
	try {
		// Parse the URL
		const { searchParams } = new URL(request.url)

		// Extract query params
		const query = searchParams.get('query')

		const start = searchParams.get('start')
		const end = searchParams.get('end')

		const minPrice = searchParams.get('minPrice')
		const maxPrice = searchParams.get('maxPrice')
		const sortBy = searchParams.get('sortBy')
		console.log('sortBy', sortBy)
		if (!query || query.trim().length === 0) {
			return NextResponse.json({ error: 'Query is required' }, { status: 400 })
		}

		// case-insensitive regex search
		const regexQuery = { contains: query, mode: 'insensitive' as const }

		const tours = await prisma.tour.findMany({
			where: {
				OR: [
					{ name: regexQuery },
					{ subtitle: regexQuery },
					{ overview: regexQuery },
					{ conclusion: regexQuery },
					{
						tags: {
							hasSome: [query],
						},
					},
					{
						keyphrase: {
							hasSome: [query],
						},
					},
				],
			},
			include: {
				business: {
					select: {
						id: true,
						name: true,
						email: true,
						profileImage: true,
					},
				},
				reviews: {
					select: {
						rating: true,
						content: true,
						createdAt: true,
						user: { select: { name: true, profileImage: true } },
					},
				},
			},
			orderBy: { createdAt: 'desc' },
			take: 20, // limit results
		})

		const newTours = await Promise.all(
			tours.map(async (tour) => {
				const updated = await updateLineItemsLogic({
					tour,
					body: {},
				})

				return {
					...tour,
					...updated,
				}
			}),
		)
		const sortedByTours = sortByPrice(newTours, sortBy)
		const filteredByPrice = filterByPrice(sortedByTours, minPrice, maxPrice)

		return NextResponse.json({ tours: filteredByPrice })
	} catch (error: any) {
		console.error('Search error:', error)
		return NextResponse.json(
			{ error: 'Failed to search tours' },
			{ status: 500 },
		)
	}
}

function sortByPrice(products: any[], sortBy: string) {
	if (sortBy === 'price_low') {
		return products.sort((a, b) => a.startPrice - b.startPrice) // low → high
	} else if (sortBy === 'price_high') {
		return products.sort((a, b) => b.startPrice - a.startPrice) // high → low
	}
	return products // no sorting if sortBy is something else
}

function filterByPrice(products: any[], minPrice: number, maxPrice: number) {
	return products.filter(
		(product) =>
			product.startPrice >= minPrice && product.startPrice <= maxPrice,
	)
}
