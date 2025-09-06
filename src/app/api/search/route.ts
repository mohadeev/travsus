import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { updateLineItemsLogic } from '../updateLineItems/updateLineItemsLogic'

const prisma = new PrismaClient()

// GET /api/tours/search/:query
export async function GET(request: Request) {
	try {
		// Parse the URL
		const { searchParams } = new URL(request.url)
		console.log('request.url', request.url)

		// Extract query params
		const query = searchParams.get('query')

		const start = searchParams.get('start')
		const end = searchParams.get('end')
		console.log(start, end)
		const searchQuery = query // your text query
		const days = daysBetween(start, end)
		const daysNumber = days
		const minPrice = searchParams.get('minPrice')
		const maxPrice = searchParams.get('maxPrice')
		const sortBy = searchParams.get('sortBy')
		if (!query || query.trim().length === 0) {
			return NextResponse.json({ error: 'Query is required' }, { status: 400 })
		}

		// case-insensitive regex search
		const regexQuery = { contains: query, mode: 'insensitive' as const }
		const isNumber = !isNaN(Number(days))
		const daysFilter = isNumber ? { days: { length: Number(days) } } : null

		const toursQuery = await prisma.$runCommandRaw({
			find: 'tours',
			filter: {
				$and: [
					{
						$or: [
							{ name: { $regex: searchQuery, $options: 'i' } },
							{ subtitle: { $regex: searchQuery, $options: 'i' } },
							{ overview: { $regex: searchQuery, $options: 'i' } },
							{ conclusion: { $regex: searchQuery, $options: 'i' } },
							{ tags: searchQuery },
							{ keyphrase: searchQuery },
						],
					},
					{ $expr: { $eq: [{ $size: '$days' }, daysNumber] } }, // array length filter
				],
			},
			limit: 20,
		})
		const tours = toursQuery.cursor.firstBatch
		console.log('tours', tours)
		console.log('daysNumber:', daysNumber)
		console.log('daysNumber:', daysNumber.length)
		const newTours = await Promise.all(
			tours.map(async (tour) => {
				const updated = await updateLineItemsLogic({
					tour,
					body: { guests: { guestAdults: 18, guestChildren: 0 } },
				})

				return {
					...tour,
					...updated,
				}
			}),
		)
		const sortedByTours = sortByPrice(newTours, sortBy)
		const filteredByPrice = filterByPrice(sortedByTours, minPrice, maxPrice)
		const filteredValidPrices = filterValidPrices(filteredByPrice)
		return NextResponse.json({ tours: filteredValidPrices })
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

function filterValidPrices(products: any[]) {
	return products.filter(
		(product) =>
			typeof product.startPrice === 'number' && product.startPrice > 0,
	)
}

function daysBetween(startDate: string, endDate: string): number {
	const start = new Date(startDate)
	const end = new Date(endDate)

	// Check for invalid dates
	if (isNaN(start.getTime()) || isNaN(end.getTime())) {
		throw new Error('Invalid date format')
	}

	const diffTime = Math.abs(end.getTime() - start.getTime())
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

	return diffDays
}
