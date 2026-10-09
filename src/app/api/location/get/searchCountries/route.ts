export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { db, T, must } from '@/lib/db'
import { GEO_CONTENT } from '@/lib/geo'

const MAX_RESULTS = 10

export async function GET(request: NextRequest) {
	try {
		const query = new URL(request.url).searchParams.get('q')?.trim().toLowerCase() || ''
		if (!query) return NextResponse.json([], { status: 200 })

		// ~250 countries: load once and match any translation in code
		const countries: any[] =
			must(await db.from(T.countries).select(`code, ${GEO_CONTENT}`)) ?? []

		const locationData = countries
			.filter((c) =>
				c.content?.translations?.some((t: any) => t.text?.toLowerCase().includes(query)),
			)
			.slice(0, MAX_RESULTS)
			.map((c) => {
				const name =
					c.content.translations.find((t: any) => t.language === 'en-US')?.text || 'N/A'
				return { name, place_name: name, type: 'country', coordinates: null }
			})

		return NextResponse.json(locationData, { status: 200 })
	} catch (error) {
		console.error('❌ Error fetching countries:', error)
		return NextResponse.json(
			{ message: 'Error fetching countries' },
			{ status: 500 },
		)
	}
}
