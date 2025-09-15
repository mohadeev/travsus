import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import { placesClient } from '@/lib/prisma'
import { OpenAI } from 'openai'
import getUserData from '@/app/api/user/getUserData'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import extractLanguageFromRequest from './extractLanguageFromRequest'

// Initialize OpenAI client
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
})

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id')
		const languageCode = extractLanguageFromRequest(request)
		const reviewsCount = await prisma.review.count({
			where: { tourId: id },
		})
		const currentUser: any = await getServerSession(authOptions)

		const reviews = await prisma.review.findMany({
			where: { tourId: id },
			take: 10,
			include: {
				user: {
					select: {
						accountData: true,
						profileImage: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		// Format reviews to match your frontend expectations with translations
		const formattedReviews = reviews

		if (!id || id === 'undefined') {
			console.log('Invalid tour ID provided:', id)
			return NextResponse.json(
				{ message: 'Tour ID is required and must be valid' },
				{ status: 400 },
			)
		}

		const tour = await prisma.tour.findUnique({
			where: {
				id,
				translations: {
					some: {
						language: languageCode,
					},
				},
			},
		})
		const currentLang = tour.translations.find(
			({ language }) => language === languageCode,
		)
		if (!tour) {
			console.log('Tour not found for ID:', id)
			return NextResponse.json({ message: 'Tour not found' }, { status: 404 })
		}

		let processedDays = tour.days || []
		let continentInfo = null

		if (Array.isArray(processedDays) && processedDays.length > 0) {
			const cityIds = processedDays
				.filter((day) => day.cityId && day.cityId !== 'undefined')
				.map((day) => day.cityId)
			if (cityIds.length > 0) {
				try {
					const cities = await placesClient.city.findMany({
						where: { id: { in: cityIds } },
						include: {
							content: {
								include: {
									translations: true, // Get ALL translations
								},
							},
							country: {
								include: {
									continent: true,
								},
							},
							state: true,
						},
					})

					// Process each city to get the correct translation

					// Update each day with translated city information
					processedDays = processedDays.map((day) => {
						return {
							...day,
						}
					})
				} catch (cityError) {
					console.error('Error fetching city data:', cityError)
				}
			}
		}

		const translatedReviews = reviews.map((review) => {
			return {
				...review.translations.find(({ language }) => languageCode),
				language: languageCode,
			}
		})
		const tourData = {
			...tour,
			translatedReviews: translatedReviews,
			formattedReviews,
			language: languageCode,
			reviewsCount,
			continentInfo, // Add the new continent information object
			...currentLang,
			days: processedDays,
		}

		return NextResponse.json(tourData)
	} catch (error) {
		console.error('Error fetching tour data:', error)
		return NextResponse.json(
			{
				message: 'Error fetching tour data',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
		await placesClient.$disconnect()
	}
}
