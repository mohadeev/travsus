export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/tours - Get all tours
export async function GET() {
	try {
		const tours = await prisma.tour.findMany({
			orderBy: { createdAt: 'desc' },
			include: {
				nameContent: {
					include: {
						translations: {
							select: {
								languageCode: true,
							},
						},
					},
				},
			},
		})

		const toursWithLanguages = tours.map((tour) => ({
			...tour,
			availableLanguages: [
				...new Set(
					tour.nameContent?.translations.map((t) => t.languageCode) || [],
				),
			],
			translationCount: tour.nameContent?.translations.length || 0,
		}))

		return NextResponse.json({ tours: toursWithLanguages })
	} catch (error) {
		console.error('Error fetching tours:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch tours' },
			{ status: 500 },
		)
	}
}
