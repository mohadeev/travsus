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

// Helper function to get translation from the new structure
function getTranslationFromArray(
	translations: any[],
	languageCode: string,
	field: string,
): string | null {
	if (!translations || !Array.isArray(translations)) return null

	const translation = translations.find((t) => t.language === languageCode)
	return translation?.[field] || null
}

async function getGeoCoordinatesFromOpenAI(
	cityName: string,
	countryName?: string,
) {
	try {
		console.log(
			`Getting geo coordinates for ${cityName}${countryName ? `, ${countryName}` : ''} from OpenAI`,
		)

		const locationText = countryName ? `${cityName}, ${countryName}` : cityName

		const prompt = `
		I need the precise latitude and longitude coordinates for ${locationText}.
		Please provide ONLY a valid JSON object with these fields:
		{
			"lat": [latitude as a number],
			"log": [longitude as a number]
		}
		
		Only return the JSON object, nothing else. Ensure the values are numbers, not strings.
		`

		const completion = await openai.chat.completions.create({
			model: 'gpt-4-turbo',
			messages: [{ role: 'user', content: prompt }],
			temperature: 0.3,
		})

		const responseText = completion.choices[0].message.content?.trim() || ''

		// Extract JSON from the response
		const jsonMatch = responseText.match(/\{[\s\S]*\}/)
		if (!jsonMatch) {
			console.error(
				`Failed to extract JSON from OpenAI response: ${responseText}`,
			)
			return null
		}

		const geoInfo = JSON.parse(jsonMatch[0])
		console.log(`OpenAI provided coordinates for ${cityName}:`, geoInfo)

		return geoInfo
	} catch (error) {
		console.error(
			`Error getting geo coordinates from OpenAI for ${cityName}:`,
			error,
		)
		return null
	}
}

async function updateCityGeoCoordinates(
	cityId: string,
	geoCoordinates: { lat: number; log: number },
) {
	try {
		console.log(`Updating geo coordinates for city ${cityId}:`, geoCoordinates)

		await placesClient.city.update({
			where: { id: cityId },
			data: {
				geo: geoCoordinates,
			},
		})

		console.log(`Successfully updated geo coordinates for city ${cityId}`)
		return true
	} catch (error) {
		console.error(`Error updating geo coordinates for city ${cityId}:`, error)
		return false
	}
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id')
		const languageCode = extractLanguageFromRequest(request)
		console.log('languageCode', languageCode)
		const reviewsCount = await prisma.review.count({
			where: { tourId: id },
		})
		const currentUser: any = await getServerSession(authOptions)

		const includeUser = true

		// First get reviews
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

		console.log('[Tour Reviews] Found reviews:', reviews.length)

		// Format reviews
		const formattedReviews = reviews.map((review) => {
			return {
				id: review.id,
				userId: review.userId,
				userName: review.user?.accountData?.firstname
					? review.user?.accountData?.firstname
					: 'Anonymous',
				userImage:
					review.user && review.user.profileImage
						? (review.user.profileImage as any).url
						: null,
				rating: review.rating,
				title: review.title,
				content: review.content,
				travelDate1: review.travelDate1,
				travelType: review.travelType,
				images: review.images,
				createdAt: review.createdAt.toISOString(),
				updatedAt: review.updatedAt.toISOString(),
				author: review.user
					? {
							name: review.user?.accountData?.firstname,
							image: review.user.profileImage
								? (review.user.profileImage as any).url
								: null,
							location: '',
							contributions: 0,
						}
					: undefined,
			}
		})

		if (!id || id === 'undefined') {
			console.log('Invalid tour ID provided:', id)
			return NextResponse.json(
				{ message: 'Tour ID is required and must be valid' },
				{ status: 400 },
			)
		}

		console.log('Fetching tour data for ID:', id)

		// Get tour with new translations structure
		const tour = await prisma.tour.findUnique({
			where: { id },
			include: {
				startAddress: true,
				endAddress: true,
				// Remove old content relations since we're using the new translations array
			},
		})

		if (!tour) {
			console.log('Tour not found for ID:', id)
			return NextResponse.json({ message: 'Tour not found' }, { status: 404 })
		}

		// Get translated tour content from new translations array
		const translatedName =
			getTranslationFromArray(tour.translations, languageCode, 'name') ||
			tour.name
		const translatedSubtitle =
			getTranslationFromArray(tour.translations, languageCode, 'subtitle') ||
			tour.subtitle
		const translatedOverview =
			getTranslationFromArray(tour.translations, languageCode, 'overview') ||
			tour.overview
		const translatedConclusion =
			getTranslationFromArray(tour.translations, languageCode, 'conclusion') ||
			tour.conclusion

		// Process days with translations from the new structure
		let processedDays = tour.days || []
		let continentInfo = null

		if (Array.isArray(processedDays) && processedDays.length > 0) {
			// Get the tour translation for the requested language to access day translations
			const tourTranslation = tour.translations?.find(
				(t) => t.language === languageCode,
			)

			// Process each day with translations
			processedDays = processedDays.map((day, index) => {
				let translatedDayName = day.name
				let translatedDayDescription = day.description

				// Get day translations from the tour translation
				if (tourTranslation?.days) {
					const dayTranslation = tourTranslation.days.find(
						(d) => d.dayIndex === index,
					)
					if (dayTranslation) {
						translatedDayName = dayTranslation.name || translatedDayName
						translatedDayDescription =
							dayTranslation.description || translatedDayDescription
					}
				}

				return {
					...day,
					name: translatedDayName,
					description: translatedDayDescription,
				}
			})

			// Get all unique cityIds from the days
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
									translations: true,
								},
							},
							country: {
								include: {
									content: {
										include: {
											translations: true,
										},
									},
									continent: {
										include: {
											content: {
												include: {
													translations: true,
												},
											},
										},
									},
								},
							},
							state: {
								include: {
									content: {
										include: {
											translations: true,
										},
									},
								},
							},
						},
					})

					// Process each city to get the correct translation
					const cityMap: Record<string, any> = {}
					for (const city of cities) {
						// Get city name in requested language
						const cityTranslation = city.content?.translations?.find(
							(t) => t.language === languageCode,
						)
						const cityName =
							cityTranslation?.text ||
							city.content?.translations?.find((t) => t.language === 'en-US')
								?.text ||
							'Unknown City'

						// Get country name in requested language
						let countryName = null
						if (city.country?.content?.translations) {
							const countryTranslation = city.country.content.translations.find(
								(t) => t.language === languageCode,
							)
							countryName =
								countryTranslation?.text ||
								city.country.content.translations.find(
									(t) => t.language === 'en-US',
								)?.text
						}

						// Get state/province name in requested language
						let stateName = null
						if (city.state?.content?.translations) {
							const stateTranslation = city.state.content.translations.find(
								(t) => t.language === languageCode,
							)
							stateName =
								stateTranslation?.text ||
								city.state.content.translations.find(
									(t) => t.language === 'en-US',
								)?.text
						}

						// Get continent information (only for the first day's city)
						if (!continentInfo && city.country?.continent) {
							const continentTranslation =
								city.country.continent.content?.translations?.find(
									(t) => t.language === languageCode,
								)
							continentInfo = {
								name:
									continentTranslation?.text ||
									city.country.continent.content?.translations?.find(
										(t) => t.language === 'en-US',
									)?.text ||
									'Unknown Continent',
								code: city.country.continent.code,
								id: city.country.continent.id,
							}
						}

						// Check for missing geo coordinates
						if (!city.geo || !city.geo.lat || !city.geo.log) {
							const geoCoordinates = await getGeoCoordinatesFromOpenAI(
								cityName,
								countryName,
							)
							if (geoCoordinates?.lat && geoCoordinates?.log) {
								await updateCityGeoCoordinates(city.id, geoCoordinates)
								city.geo = geoCoordinates
							}
						}

						cityMap[city.id] = {
							id: city.id,
							name: cityName,
							countryName: countryName,
							stateName: stateName,
							geoCoordinates: city.geo || null,
							originalName: city.content?.translations?.find(
								(t) => t.language === 'en-US',
							)?.text,
						}
					}

					// Update each day with translated city information
					processedDays = processedDays.map((day) => {
						if (day.cityId && cityMap[day.cityId]) {
							return {
								...day,
								cityName: cityMap[day.cityId].name,
								countryName: cityMap[day.cityId].countryName,
								stateName: cityMap[day.cityId].stateName,
								geoCoordinates: cityMap[day.cityId].geoCoordinates,
								originalCityName: cityMap[day.cityId].originalName,
							}
						}
						return day
					})
				} catch (cityError) {
					console.error('Error fetching city data:', cityError)
				}
			}
		}

		const tourData = {
			...tour,
			formattedReviews,
			name: translatedName,
			subtitle: translatedSubtitle,
			overview: translatedOverview,
			conclusion: translatedConclusion,
			days: processedDays,
			language: languageCode,
			reviewsCount,
			continentInfo,
		}

		// console.log(tourData)
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
