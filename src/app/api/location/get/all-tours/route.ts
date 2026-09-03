export const dynamic = "force-dynamic";
//-----------------------------------------------------
import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { placesClient } from '@/lib/prisma'

const prisma = new PrismaClient()
import getUserData from '@/app/api/user/getUserData'
import extractLanguageFromRequest from '@/app/api/listing/get/getTourData/extractLanguageFromRequest'


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
			slugs: true,
			translations: true,
			id: true,
			images: true,
			days: true,
			accommodations: true,
			price: true,
			pricingTiers: true,
			startAddress: true,
			endAddress: true,
		},
	})
	return tours
}

export async function GET(request: NextRequest) {
	try {
		console.log("=== ALL TOURS: START ===")

		const { searchParams } = request.nextUrl
		const page = Number.parseInt(searchParams.get('page') || '1')
		const limit = Number.parseInt(searchParams.get('limit') || '8')

		console.log("=== ALL TOURS: PAGE/LIMIT ===", page, limit)

		const language = extractLanguageFromRequest(request)

		console.log("=== ALL TOURS: LANGUAGE ===", language)

		const savedList: string[] = []

		console.log("=== ALL TOURS: BEFORE COUNT ===")

		const totalTours = await prisma.tour.count({
			where: {
				images: {
					isEmpty: false,
				},
			},
		})

		console.log("=== ALL TOURS: COUNT ===", totalTours)

		const paginatedToursWithContent =
			await getOptimizedToursWithTranslations(
				language,
				page,
				limit,
			)

		console.log(
			"=== ALL TOURS: FIND MANY ===",
			paginatedToursWithContent.length,
		)

		const modifiedToursData = paginatedToursWithContent.map((tour) => ({
			...tour,
			...tour.translations.find(
				(trns) => trns.language === language,
			),
			liked: savedList.includes(tour.id),
		}))

		console.log("=== ALL TOURS: MAPPING OK ===")

		return NextResponse.json({
			allToursData: modifiedToursData,
			totalTours,
			page,
			totalPages: Math.ceil(totalTours / limit),
			language,
		})
	} catch (error) {
		console.error("=== ALL TOURS REAL ERROR ===", error)

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