export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { tourId, features } = body

		if (!tourId) {
			return NextResponse.json(
				{ success: false, message: 'Tour ID is required' },
				{ status: 400 },
			)
		}

		// Update the tour with all language features
		const tour = await prisma.tour.update({
			where: { id: tourId },
			data: {
				// Update highlights for each language
				...Object.entries(features).reduce(
					(acc, [lang, data]: [string, any]) => ({
						...acc,
						[`highlights_${lang}`]: data.highlights.filter(
							(h: string) => h.trim() !== '',
						),
					}),
					{},
				),

				// Update FAQs for each language
				...Object.entries(features).reduce(
					(acc, [lang, data]: [string, any]) => ({
						...acc,
						[`faqs_${lang}`]: data.faqs.filter(
							(f: any) => f.question.trim() !== '' && f.answer.trim() !== '',
						),
					}),
					{},
				),

				// Update inclusions for each language
				...Object.entries(features).reduce(
					(acc, [lang, data]: [string, any]) => ({
						...acc,
						[`inclusions_${lang}`]: data.inclusions,
					}),
					{},
				),
			},
		})

		return NextResponse.json({
			success: true,
			data: tour,
			message: 'Tour features updated successfully for all languages',
		})
	} catch (error) {
		console.error('Error saving tour features:', error)
		return NextResponse.json(
			{ success: false, message: 'Failed to save tour features' },
			{ status: 500 },
		)
	}
}
