export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { updateLineItemsLogic } from '../updateLineItems/updateLineItemsLogic'
import extractLanguageFromRequest from '../listing/get/getTourData/extractLanguageFromRequest'

const prisma = new PrismaClient()

// GET /api/tours/search/:query
export async function GET(request: Request) {
	try {
		// Parse the URL
		const { searchParams } = new URL(request.url)
		console.log('request.url', request.url)
		const language = extractLanguageFromRequest(request)

		// Extract query params
		const query = searchParams.get('query') || ''
		const start = searchParams.get('start')
		const end = searchParams.get('end')
		console.log(start, end)

		const minPrice = searchParams.get('minPrice') || '0'
		const maxPrice = searchParams.get('maxPrice') || '10000' // Set a high default max price
		const sortBy = searchParams.get('sortBy') || 'recommended'

		// Validate and calculate days - if dates are invalid, set daysNumber to null
		let daysNumber = null
		try {
			if (start && end && start !== 'null' && end !== 'null') {
				const days = daysBetween(start, end)
				if (!isNaN(Number(days)) && days > 0) {
					daysNumber = days
				}
			}
		} catch (error) {
			console.log('Invalid dates, ignoring date filter')
			daysNumber = null
		}

		// Build filter conditions dynamically
		const filterConditions: any[] = []

		// Text search condition - only apply if query is valid
		if (query && query.trim().length > 0) {
			filterConditions.push({
				$or: [
					{ name: { $regex: query, $options: 'i' } },
					{ subtitle: { $regex: query, $options: 'i' } },
					{ overview: { $regex: query, $options: 'i' } },
					{ conclusion: { $regex: query, $options: 'i' } },
					{ tags: query },
					{ keyphrase: query },
				],
			})
		}

		// Days filter condition - only apply if daysNumber is valid
		if (daysNumber !== null) {
			filterConditions.push({
				$expr: { $eq: [{ $size: '$days' }, daysNumber] },
			})
		}

		// If no filter conditions, get all tours
		const filter = filterConditions.length > 0 ? { $and: filterConditions } : {}

		const toursQuery = await prisma.$runCommandRaw({
			find: 'tours',
			filter: filter,
			limit: 50, // Increased limit since we might get more results
		})

		const tours = toursQuery.cursor.firstBatch
		console.log('tours found:', tours.length)
		console.log('daysNumber:', daysNumber)

		// Process tours with pricing
		const newTours = await Promise.all(
			tours.map(async (tour) => {
				try {
					const updated = await updateLineItemsLogic({
						tour,
						body: { guests: { guestAdults: 18, guestChildren: 0 } },
					})
					return {
						...tour,
						...updated,
						...tour.translations.find((trns) => trns.language === language),
					}
				} catch (error) {
					console.error('Error updating tour pricing:', error)
					return tour // Return original tour if pricing update fails
				}
			}),
		)

		// Filter and sort
		const filteredValidPrices = filterValidPrices(newTours)
		const filteredByPrice = filterByPrice(
			filteredValidPrices,
			parseInt(minPrice),
			parseInt(maxPrice),
		)
		const sortedTours = sortByPrice(filteredByPrice, sortBy)

		return NextResponse.json({
			tours: sortedTours,
			filtersApplied: {
				query: query && query.trim().length > 0,
				days: daysNumber !== null,
				price: true,
			},
		})
	} catch (error: any) {
		console.error('Search error:', error)
		return NextResponse.json(
			{ error: 'Failed to search tours' },
			{ status: 500 },
		)
	}
}

function sortByPrice(products: any[], sortBy: string) {
	if (!products.length) return products

	if (sortBy === 'price_low') {
		return [...products].sort(
			(a, b) => (a.startPrice || 0) - (b.startPrice || 0),
		)
	} else if (sortBy === 'price_high') {
		return [...products].sort(
			(a, b) => (b.startPrice || 0) - (a.startPrice || 0),
		)
	}
	return products // no sorting if sortBy is something else
}

function filterByPrice(products: any[], minPrice: number, maxPrice: number) {
	return products.filter(
		(product) =>
			(product.startPrice || 0) >= minPrice &&
			(product.startPrice || 0) <= maxPrice,
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

	if (isNaN(start.getTime()) || isNaN(end.getTime())) {
		throw new Error('Invalid date format')
	}

	// Get UTC dates only (ignore time)
	const startUTC = Date.UTC(
		start.getUTCFullYear(),
		start.getUTCMonth(),
		start.getUTCDate(),
	)
	const endUTC = Date.UTC(
		end.getUTCFullYear(),
		end.getUTCMonth(),
		end.getUTCDate(),
	)

	const diffTime = endUTC - startUTC
	const diffDays = diffTime / (1000 * 60 * 60 * 24)

	return diffDays + 1 // inclusive of start and end date
}
