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
		const currentLang = tour?.translations?.find(
			({ language }) => language === languageCode,
		)
		if (!tour) {
			console.log('Tour not found for ID:', id)
			return NextResponse.json({ message: 'Tour not found' }, { status: 404 })
		}

		let processedDays = currentLang?.days || []
		let continentInfo = null

		if (Array.isArray(processedDays) && processedDays.length > 0) {
			const cityIds = processedDays
				.filter((day) => day.cityId && day.cityId !== 'undefined')
				.map((day) => day.cityId)

			if (cityIds.length > 0) {
				try {
					// Only select the bare minimum fields
					const cities = await placesClient.city.findMany({
						where: { id: { in: cityIds } },
						select: {
							id: true,
							geo: true,
							image: true,
							code3: true,
							type: true,
							translations: true, // Get all translations but we'll filter later
							country: {
								select: {
									id: true,
									code: true,
									code3: true,
									geo: true,
									translations: true, // Get all country translations
									continent: {
										select: {
											id: true,
											translations: true, // Get all continent translations
										},
									},
								},
							},
							state: {
								select: {
									id: true,
									translations: true, // Get all state translations
								},
							},
						},
					})
					// Filter translations in JavaScript to only keep en-US
					const citiesWithEnUs = cities.map((city) => ({
						...city,
						translations:
							city.translations?.filter((t) => t.language === languageCode) ||
							[],
						country: city.country
							? {
									...city.country,
									translations:
										city.country.translations?.filter(
											(t) => t.language === languageCode,
										) || [],
								}
							: null,
						state: city.state
							? {
									...city.state,
									translations:
										city.state.translations?.filter(
											(t) => t.language === languageCode,
										) || [],
								}
							: null,
						continent: city.country?.continent
							? {
									...city.country.continent,
									translations:
										city.country.continent.translations?.filter(
											(t) => t.language === languageCode,
										) || [],
								}
							: null,
					}))

					// Update each day with translated city information
					processedDays = processedDays.map((day) => {
						const cityData = citiesWithEnUs.find(({ id }) => id === day.cityId)
						const locationObject = createEnUsLocationObject(
							cityData,
							languageCode,
						)

						console.log('-------------------------------------')
						// console.log('cityData', JSON.stringify(cityData))
						console.log('-------------------------------------')

						return {
							...day,
							...locationObject,
						}
					})
				} catch (cityError) {
					console.error('Error fetching city data:', cityError)
				}
			}
		}

		const translatedReviews = reviews.map((review) => {
			return {
				...review?.translations?.find(({ language }) => languageCode),
				language: languageCode,
			}
		})
		// console.log('processedDays:', processedDays[0])
		const tourData = {
			...tour,
			translatedReviews: translatedReviews,
			formattedReviews,
			language: languageCode,
			reviewsCount,
			continentInfo,
			...currentLang,
			days: processedDays,
		}
		console.log('cities::::::::::::::::::::::::', tourData.days)

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

function createEnUsLocationObject(city, language) {
	// Extract en-US translations
	const cityEnUs = city.translations?.find((t) => t.language === language)
	const countryEnUs = city.country?.translations?.find(
		(t) => t.language === language,
	)
	const continentEnUs = city.continent?.translations?.find(
		(t) => t.language === language,
	)
	const stateEnUs = city.state?.translations?.find(
		(t) => t.language === language,
	)

	// Create the simplified object
	return {
		...city,
		state: stateEnUs?.name || '', // "Marrakech-Asafi"
		city: cityEnUs?.name || '', // "Marrakech"
		country: countryEnUs?.name || '', // "Morocco"
		continent: continentEnUs?.name || '', // "Africa"
	}
}

// Usage
