import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
import getUserData from '@/app/api/user/getUserData'

export const dynamic = 'force-dynamic'

function extractLanguageFromRequest(request: NextRequest): string {
	const url = new URL(request.url)
	const referer: any = request.headers.get('referer')
	const match = referer.match(/\/([a-z]{2}-[A-Z]{2})(?:\/|$)/)
	console.log('referer: ', request)
	if (match) return match[1]

	// Try to get from accept-language header as fallback
	const acceptLanguage = request.headers.get('accept-language')
	if (acceptLanguage) {
		const match = acceptLanguage.match(/([a-z]{2}-[A-Z]{2})/)
		if (match) return match[1]
	}

	// Default to English
	return 'en-US'
}

async function applyTranslationsToTours(tours: any[], language: string) {
	if (!tours.length) return tours

	// Collect all content IDs from all tours
	const contentIds = new Set<string>()

	tours.forEach((tour) => {
		if (tour.nameContentId) contentIds.add(tour.nameContentId)
		if (tour.subtitleContentId) contentIds.add(tour.subtitleContentId)
		if (tour.overviewContentId) contentIds.add(tour.overviewContentId)
		if (tour.conclusionContentId) contentIds.add(tour.conclusionContentId)

		// Add day content IDs
		tour.days?.forEach((day: any) => {
			if (day.nameContentId) contentIds.add(day.nameContentId)
			if (day.descriptionContentId) contentIds.add(day.descriptionContentId)
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

	// Apply translations to each tour
	return tours.map((tour) => {
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

		// Apply day translations
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

				return translatedDay
			})
		}

		return translatedTour
	})
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = request.nextUrl
		const page = Number.parseInt(searchParams.get('page') || '1')
		const limit = Number.parseInt(searchParams.get('limit') || '8')

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

		const allToursData = await prisma.tour.findMany({
			where: {
				images: {
					isEmpty: false,
				},
			},
			include: {
				startAddress: true,
				endAddress: true,
			},
			skip: (page - 1) * limit,
			take: limit,
		})

		console.log('allToursData', allToursData[0])

		const translatedTours = await applyTranslationsToTours(
			allToursData,
			language,
		)

		const modifiedToursData = translatedTours.map((tour) => ({
			...tour,
			liked: savedList?.includes(tour.id),
		}))

		return NextResponse.json({
			allToursData: modifiedToursData,
			totalTours,
			page,
			totalPages: Math.ceil(totalTours / limit),
		})
	} catch (error) {
		console.error('Error fetching tours:', error)
		return NextResponse.json(
			{ message: 'Error fetching tour data' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
