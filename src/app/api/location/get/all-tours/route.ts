// app/api/tours/route.ts
import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { placesClient } from '@/lib/prisma'

const prisma = new PrismaClient()

export const dynamic = 'force-dynamic'

// Function to extract language from request
function extractLanguageFromRequest(request: NextRequest): string {
	const acceptLanguage = request.headers.get('accept-language') || 'en'
	const preferredLanguage = acceptLanguage.split(',')[0].split('-')[0]
	return preferredLanguage
}

// Function to get optimized tours with translations
async function getOptimizedToursWithTranslations(
	language: string,
	page: number = 1,
	limit: number = 12,
	filters: any = {},
) {
	try {
		// Build where clause based on filters
		const whereClause: any = {
			images: {
				isEmpty: false,
			},
		}

		// Add price filter if provided
		if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
			whereClause.price = {}
			if (filters.minPrice !== undefined) {
				whereClause.price.gte = parseFloat(filters.minPrice)
			}
			if (filters.maxPrice !== undefined) {
				whereClume.price.lte = parseFloat(filters.maxPrice)
			}
		}

		// Add date filter if provided
		if (filters.date && filters.date !== 'all') {
			const today = new Date()
			if (filters.date === 'today') {
				whereClause.startDate = {
					gte: today,
					lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
				}
			} else if (filters.date === 'tomorrow') {
				const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
				whereClause.startDate = {
					gte: tomorrow,
					lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
				}
			}
		}

		// Add immediate confirmation filter if provided
		if (filters.immediateConfirmation) {
			whereClause.immediateConfirmation = true
		}

		// Get tours with pagination
		const tours = await prisma.tour.findMany({
			where: whereClause,
			skip: (page - 1) * limit,
			take: limit,
			select: {
				id: true,
				images: true,
				nameContentId: true,
				subtitleContentId: true,
				overviewContentId: true,
				conclusionContentId: true,
				days: true,
				accommodations: true,
				price: true,
				discountedPrice: true,
				pricingTiers: true,
				startAddress: true,
				endAddress: true,
				duration: true,
				durationType: true,
				includesOvernight: true,
				immediateConfirmation: true,
				startDate: true,
				reviews: {
					select: {
						rating: true,
					},
				},
				createdAt: true,
				updatedAt: true,
			},
			orderBy: getOrderByClause(filters.sortBy),
		})

		// Get total count for pagination
		const totalTours = await prisma.tour.count({
			where: whereClause,
		})

		// Collect all content IDs for translations
		const contentIds = new Set<string>()
		const cityIds = new Set<string>()

		tours.forEach((tour) => {
			if (tour.nameContentId) contentIds.add(tour.nameContentId)
			if (tour.subtitleContentId) contentIds.add(tour.subtitleContentId)
			if (tour.overviewContentId) contentIds.add(tour.overviewContentId)
			if (tour.conclusionContentId) contentIds.add(tour.conclusionContentId)

			// Process days to get city IDs
			tour.days?.forEach((day: any) => {
				if (day.cityId && day.cityId !== 'undefined') {
					cityIds.add(day.cityId)
				}
			})
		})

		// Fetch translations for all content IDs
		const translations = await prisma.translatedText.findMany({
			where: {
				contentId: { in: Array.from(contentIds) },
				languageCode: language,
			},
			select: {
				contentId: true,
				text: true,
			},
		})

		// Create a translation map for easy access
		const translationMap = new Map()
		translations.forEach((t) => {
			translationMap.set(t.contentId, t.text)
		})

		// Fetch city translations if needed
		const cityTranslationsMap = new Map()
		if (cityIds.size > 0) {
			try {
				const cities = await placesClient.city.findMany({
					where: {
						id: { in: Array.from(cityIds) },
					},
					select: {
						id: true,
						content: {
							select: {
								translations: {
									where: {
										language: { in: [language, 'en'] },
									},
									select: {
										text: true,
										language: true,
									},
								},
							},
						},
						country: {
							select: {
								id: true,
								code: true,
								code3: true,
								content: {
									select: {
										translations: {
											where: {
												language: { in: [language, 'en'] },
											},
											select: {
												text: true,
												language: true,
											},
										},
									},
								},
							},
						},
					},
				})

				cities.forEach((city) => {
					const cityTranslation = city.content?.translations?.find(
						(t) => t.language === language,
					)
					const cityName =
						cityTranslation?.text ||
						city.content?.translations?.find((t) => t.language === 'en')
							?.text ||
						'Unknown City'

					let countryInfo = null
					if (city.country) {
						const countryTranslation = city.country.content?.translations?.find(
							(t) => t.language === language,
						)
						countryInfo = {
							name:
								countryTranslation?.text ||
								city.country.content?.translations?.find(
									(t) => t.language === 'en',
								)?.text ||
								'Unknown Country',
							code: city.country.code,
							id: city.country.id,
						}
					}

					cityTranslationsMap.set(city.id, {
						name: cityName,
						country: countryInfo,
					})
				})
			} catch (cityError) {
				console.error('Error fetching city translations:', cityError)
			}
		}

		// Process tours with translations
		const translatedTours = tours.map((tour) => {
			// Calculate average rating
			const ratings = tour.reviews.map((review: any) => review.rating)
			const averageRating =
				ratings.length > 0
					? ratings.reduce((sum: number, rating: number) => sum + rating, 0) /
						ratings.length
					: 0

			// Apply translations
			const translatedTour: any = {
				id: tour.id,
				images: tour.images,
				name: translationMap.get(tour.nameContentId) || 'Untitled Tour',
				subtitle: translationMap.get(tour.subtitleContentId) || '',
				overview: translationMap.get(tour.overviewContentId) || '',
				conclusion: translationMap.get(tour.conclusionContentId) || '',
				price: tour.price,
				discountedPrice: tour.discountedPrice,
				duration: tour.duration,
				durationType: tour.durationType,
				includesOvernight: tour.includesOvernight,
				immediateConfirmation: tour.immediateConfirmation,
				startDate: tour.startDate,
				averageRating,
				reviewCount: tour.reviews.length,
				createdAt: tour.createdAt,
				updatedAt: tour.updatedAt,
			}

			// Process days with translations
			if (tour.days && tour.days.length > 0) {
				translatedTour.days = tour.days.map((day: any) => {
					const translatedDay: any = { ...day }

					if (day.cityId && cityTranslationsMap.has(day.cityId)) {
						const cityData = cityTranslationsMap.get(day.cityId)
						translatedDay.cityName = cityData.name
						translatedDay.country = cityData.country
					}

					return translatedDay
				})
			}

			return translatedTour
		})

		return {
			tours: translatedTours,
			total: totalTours,
			page,
			totalPages: Math.ceil(totalTours / limit),
		}
	} catch (error) {
		console.error('Error in getOptimizedToursWithTranslations:', error)
		throw error
	}
}

// Helper function to get order by clause
function getOrderByClause(sortBy: string = 'recommended') {
	switch (sortBy) {
		case 'price_low':
			return { price: 'asc' }
		case 'price_high':
			return { price: 'desc' }
		case 'best_rated':
			return { reviews: { _count: 'desc' } }
		case 'newest':
			return { createdAt: 'desc' }
		case 'oldest':
			return { createdAt: 'asc' }
		default:
			return { createdAt: 'desc' }
	}
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)

		// Extract query parameters
		const page = parseInt(searchParams.get('page') || '1')
		const limit = parseInt(searchParams.get('limit') || '12')
		const minPrice = searchParams.get('minPrice')
		const maxPrice = searchParams.get('maxPrice')
		const date = searchParams.get('date')
		const immediateConfirmation =
			searchParams.get('immediateConfirmation') === 'true'
		const sortBy = searchParams.get('sortBy') || 'recommended'

		// Extract language from request
		const language = extractLanguageFromRequest(request)

		// Build filters object
		const filters = {
			minPrice,
			maxPrice,
			date,
			immediateConfirmation,
			sortBy,
		}

		// Get tours with translations
		const result = await getOptimizedToursWithTranslations(
			language,
			page,
			limit,
			filters,
		)

		return NextResponse.json({
			success: true,
			data: result,
		})
	} catch (error) {
		console.error('Error fetching tours:', error)
		return NextResponse.json(
			{
				success: false,
				message: 'Error fetching tour data',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
