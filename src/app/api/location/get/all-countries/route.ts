export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { placesClient } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic' // Ensure it's dynamic

export async function GET(request: NextRequest) {
	try {
		const prisma = placesClient
		const counties = await prisma.country.findMany({
			select: {
				code: true,
				content: {
					select: {
						translations: {
							where: {
								language: 'en-US', // Fetch only English translation
							},
							select: {
								text: true, // Get only the translated name
							},
						},
					},
				},
			},
		})

		const formattedCounties = counties
			.map((country) => ({
				code: country.code,
				name: country.content.translations[0]?.text || 'N/A', // Fallback if no translation found
			}))
			.sort((a, b) => a.code.localeCompare(b.code)) // Sort by code (A-Z)

		return NextResponse.json({ counties: formattedCounties }, { status: 200 })
	} catch (error) {
		console.error('Error fetching countries:', error)
		return NextResponse.json(
			{ message: 'Error fetching countries' },
			{ status: 500 },
		)
	}
}
