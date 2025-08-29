import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { placesClient } from '@/lib/prisma'

const prisma = new PrismaClient()
import getUserData from '@/app/api/user/getUserData'
import extractLanguageFromRequest from '@/app/api/listing/get/getTourData/extractLanguageFromRequest'

export const dynamic = 'force-dynamic'

// function extractLanguageFromRequest(request: NextRequest): string {
// 	const url = new URL(request.url)
// 	const referer: any = request.headers.get('referer')
// 	const match = referer.match(/\/([a-z]{2}-[A-Z]{2})(?:\/|$)/)
// 	if (match) return match[1]

// 	// Try to get from accept-language header as fallback
// 	const acceptLanguage = request.headers.get('accept-language')
// 	if (acceptLanguage) {
// 		const match = acceptLanguage.match(/([a-z]{2}-[A-Z]{2})/)
// 		if (match) return match[1]
// 	}

// 	// Default to English
// 	return 'en-US'
// }

async function getAllToursWithTranslations(language: string) {
	// First, get ALL tours (not just paginated) to collect all city IDs
	const allTours = await prisma.tour.findMany({
		where: {
			images: {
				isEmpty: false,
			},
		},
		include: {
			startAddress: true,
			endAddress: true,
		},
	})

	// Collect all content IDs and city IDs from ALL tours
	const contentIds = new Set<string>()
	const cityIds = new Set<string>()

	allTours.forEach((tour) => {
		if (tour.nameContentId) contentIds.add(tour.nameContentId)
		if (tour.subtitleContentId) contentIds.add(tour.subtitleContentId)
		if (tour.overviewContentId) contentIds.add(tour.overviewContentId)
		if (tour.conclusionContentId) contentIds.add(tour.conclusionContentId)

		// Add day content IDs and collect city IDs from ALL tours
		tour.days?.forEach((day: any) => {
			if (day.nameContentId) contentIds.add(day.nameContentId)
			if (day.descriptionContentId) contentIds.add(day.descriptionContentId)
			if (day.cityId && day.cityId !== 'undefined') {
				cityIds.add(day.cityId)
			}
		})
	})

	// Fetch all translations at once
	const translations = await prisma.translatedText.findMany({
		where: {
			contentId: { in: Array.from(contentIds) },
			languageCode: language,
		},
	})

	// Create a map for quick lookup
	const translationMap = new Map()
	translations.forEach((t) => {
		translationMap.set(t.contentId, t.text)
	})

	// Fetch city translations for ALL cities used in ALL tours with province, country, and continent data
	let cityTranslationsMap = new Map()
	if (cityIds.size > 0) {
		try {
			const cities = await placesClient.city.findMany({
				where: {
					id: { in: Array.from(cityIds) },
				},
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

			// Create map of city translations with province, country, and continent data
			cities.forEach((city) => {
				const cityTranslation = city.content?.translations?.find(
					(t) => t.language === language,
				)
				const cityName =
					cityTranslation?.text ||
					city.content?.translations?.find((t) => t.language === 'en-US')
						?.text ||
					'Unknown City'

				// Get country information
				let countryInfo = null
				if (city.country) {
					const countryTranslation = city.country.content?.translations?.find(
						(t) => t.language === language,
					)
					countryInfo = {
						name:
							countryTranslation?.text ||
							city.country.content?.translations?.find(
								(t) => t.language === 'en-US',
							)?.text ||
							'Unknown Country',
						code: city.country.code,
						code3: city.country.code3,
						id: city.country.id,
					}
				}

				// Get province/state information
				let provinceInfo = null
				if (city.state) {
					const stateTranslation = city.state.content?.translations?.find(
						(t) => t.language === language,
					)
					provinceInfo = {
						name:
							stateTranslation?.text ||
							city.state.content?.translations?.find(
								(t) => t.language === 'en-US',
							)?.text ||
							'Unknown Province',
						id: city.state.id,
					}
				}

				// Get continent information
				let continentInfo = null
				if (city.country?.continent) {
					const continentTranslation =
						city.country.continent.content?.translations?.find(
							(t) => t.language === language,
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

				cityTranslationsMap.set(city.id, {
					name: cityName,
					country: countryInfo,
					province: provinceInfo,
					continent: continentInfo,
					geoCoordinates: city.geo || null,
					originalName: city.content?.translations?.find(
						(t) => t.language === 'en-US',
					)?.text,
				})
			})
		} catch (cityError) {
			console.error('Error fetching city translations:', cityError)
		}
	}

	// Apply translations to ALL tours
	const translatedTours = allTours.map((tour) => {
		const translatedTour = { ...tour }

		// Apply tour-level translations
		if (tour.nameContentId && translationMap.has(tour.nameContentId)) {
			translatedTour.name = translationMap.get(tour.nameContentId)
		}
		if (tour.subtitleContentId && translationMap.has(tour.subtitleContentId)) {
			translatedTour.subtitle = translationMap.get(tour.subtitleContentId)
		}
		if (tour.overviewContentId && translationMap.has(tour.overviewContentId)) {
			translatedTour.overview = translationMap.get(tour.overviewContentId)
		}
		if (
			tour.conclusionContentId &&
			translationMap.has(tour.conclusionContentId)
		) {
			translatedTour.conclusion = translationMap.get(tour.conclusionContentId)
		}

		// Apply day translations and city translations
		if (tour.days && tour.days.length > 0) {
			translatedTour.days = tour.days.map((day: any) => {
				const translatedDay = { ...day }

				if (day.nameContentId && translationMap.has(day.nameContentId)) {
					translatedDay.name = translationMap.get(day.nameContentId)
				}
				if (
					day.descriptionContentId &&
					translationMap.has(day.descriptionContentId)
				) {
					translatedDay.description = translationMap.get(
						day.descriptionContentId,
					)
				}

				// Apply city translation if available with province, country, and continent data
				if (day.cityId && cityTranslationsMap.has(day.cityId)) {
					const cityData = cityTranslationsMap.get(day.cityId)
					translatedDay.city = {
						name: cityData.name,
						originalName: cityData.originalName,
						geoCoordinates: cityData.geoCoordinates,
					}
					translatedDay.country = cityData.country
					translatedDay.province = cityData.province
					translatedDay.continent = cityData.continent
				}

				return translatedDay
			})
		}

		return translatedTour
	})

	return translatedTours
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = request.nextUrl
		const page = Number.parseInt(searchParams.get('page') || '1')
		const limit = Number.parseInt(searchParams.get('limit') || '8')

		const language = extractLanguageFromRequest(request)
		console.log('Detected language for tours:', language)

		const userData: any = await getUserData()
		const { savedList } = userData || {}

		// Get total count for pagination
		const totalTours = await prisma.tour.count({
			where: {
				images: {
					isEmpty: false,
				},
			},
		})

		// Get ALL tours with translations and complete city data (province, country, continent)
		const allTranslatedTours = await getAllToursWithTranslations(language)

		// Apply pagination to the already translated tours
		const paginatedTours = allTranslatedTours.slice(
			(page - 1) * limit,
			page * limit,
		)

		// Fetch additional content for the paginated tours
		const paginatedToursWithContent = await Promise.all(
			paginatedTours.map(async (tour) => {
				const tourWithContent = await prisma.tour.findUnique({
					where: { id: tour.id },
					include: {
						nameContent: {
							include: {
								translations: {
									where: {
										languageCode: language,
									},
								},
							},
						},
						subtitleContent: {
							include: {
								translations: {
									where: {
										languageCode: language,
									},
								},
							},
						},
						overviewContent: {
							include: {
								translations: {
									where: {
										languageCode: language,
									},
								},
							},
						},
						conclusionContent: {
							include: {
								translations: {
									where: {
										languageCode: language,
									},
								},
							},
						},
					},
				})

				return {
					...tour,
					// Ensure we use the latest translated values
					name:
						tourWithContent?.nameContent?.translations[0]?.text || tour.name,
					subtitle:
						tourWithContent?.subtitleContent?.translations[0]?.text ||
						tour.subtitle,
					overview:
						tourWithContent?.overviewContent?.translations[0]?.text ||
						tour.overview,
					conclusion:
						tourWithContent?.conclusionContent?.translations[0]?.text ||
						tour.conclusion,
				}
			}),
		)

		const modifiedToursData = paginatedToursWithContent.map((tour) => ({
			...tour,
			liked: savedList?.includes(tour.id),
		}))

		return NextResponse.json({
			allToursData: modifiedToursData,
			totalTours,
			page,
			totalPages: Math.ceil(totalTours / limit),
			language,
		})
	} catch (error) {
		console.error('Error fetching tours:', error)
		return NextResponse.json(
			{
				message: 'Error fetching tour data',
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
