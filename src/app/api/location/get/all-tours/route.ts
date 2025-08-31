import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { placesClient } from '@/lib/prisma'

const prisma = new PrismaClient()
import getUserData from '@/app/api/user/getUserData'
import extractLanguageFromRequest from '@/app/api/listing/get/getTourData/extractLanguageFromRequest'

export const dynamic = 'force-dynamic'

async function getOptimizedToursWithTranslations(
	language: string,
	page: number,
	limit: number,
) {
	const tours = await prisma.tour.findMany({
		where: {
			images: {
				isEmpty: false,
			},
		},
		skip: (page - 1) * limit,
		take: limit,
		select: {
			id: true,
			images: true,
			nameContentId: true,
			subtitleContentId: true,
			days: true,
			accommodations: true,
			price: true,
			pricingTiers: true,
			startAddress: true,
			endAddress: true,
		},
	})

	const contentIds = new Set<string>()
	const cityIds = new Set<string>()

	tours.forEach((tour) => {
		if (tour.nameContentId) contentIds.add(tour.nameContentId)
		if (tour.subtitleContentId) contentIds.add(tour.subtitleContentId)

		tour.days?.forEach((day: any) => {
			if (day.cityId && day.cityId !== 'undefined') {
				cityIds.add(day.cityId)
			}
		})
	})

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

	const translationMap = new Map()
	translations.forEach((t) => {
		translationMap.set(t.contentId, t.text)
	})

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
									language: { in: [language, 'en-US'] },
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
											language: { in: [language, 'en-US'] },
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
					city.content?.translations?.find((t) => t.language === 'en-US')
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
								(t) => t.language === 'en-US',
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

	const translatedTours = tours.map((tour) => {
		const translatedTour = { ...tour }

		if (tour.nameContentId && translationMap.has(tour.nameContentId)) {
			translatedTour.name = translationMap.get(tour.nameContentId)
		}
		if (tour.subtitleContentId && translationMap.has(tour.subtitleContentId)) {
			translatedTour.subtitle = translationMap.get(tour.subtitleContentId)
		}

		if (tour.days && tour.days.length > 0) {
			translatedTour.days = tour.days.map((day: any) => {
				const translatedDay = { ...day }

				if (day.cityId && cityTranslationsMap.has(day.cityId)) {
					const cityData = cityTranslationsMap.get(day.cityId)
					translatedDay.city = {
						name: cityData.name,
					}
					translatedDay.country = cityData.country
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
		console.log(request)

		const language = extractLanguageFromRequest(request)

		const userData: any = await getUserData()
		const { savedList } = userData || {}

		const totalTours = await prisma.tour.count({
			where: {
				images: {
					isEmpty: false,
				},
			},
		})

		const paginatedToursWithContent = await getOptimizedToursWithTranslations(
			language,
			page,
			limit,
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
