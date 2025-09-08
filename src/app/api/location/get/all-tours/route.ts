//-----------------------------------------------------
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

		const paginatedToursWithContent = await getOptimizedToursWithTranslations(
			language,
			page,
			limit,
		)
		const modifiedToursData = paginatedToursWithContent.map((tour) => ({
			...tour,
			...tour.translations.find((trns) => trns.language === language),
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
