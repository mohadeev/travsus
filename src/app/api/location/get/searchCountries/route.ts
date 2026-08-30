export const dynamic = "force-dynamic";
import { placesClient } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(request: NextRequest) {
	try {
		const prisma = placesClient
		const { searchParams } = new URL(request.url)
		const query = searchParams.get('q')?.trim().toLowerCase() || ''

		if (!query) return NextResponse.json([], { status: 200 }) // Return empty if no query

		// Optimized Query: Search directly inside translations
		const countries = await prisma.country.findMany({
			where: {
				content: {
					translations: {
						some: {
							text: { contains: query, mode: 'insensitive' },
						},
					},
				},
			},
			select: {
				code: true,
				content: {
					select: {
						translations: {
							where: { language: 'en-US' },
							select: { text: true },
						},
					},
				},
			},
			take: 10, // Limit results to 10 for performance
		})

		// Transform to frontend format
		const locationData = countries.map(({ code, content }) => ({
			name: content.translations[0]?.text || 'N/A',
			place_name: content.translations[0]?.text || 'N/A',
			type: 'country',
			coordinates: null, // No coordinates needed
		}))

		console.log('Optimized locationData:', locationData)
		return NextResponse.json(locationData, { status: 200 })
	} catch (error) {
		console.error('❌ Error fetching countries:', error)
		return NextResponse.json(
			{ message: 'Error fetching countries' },
			{ status: 500 },
		)
	}
}
