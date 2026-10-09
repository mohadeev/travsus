export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { db, T, must } from '@/lib/db'
import { GEO_CONTENT } from '@/lib/geo'

/** English name from a geo row's content. */
const englishName = (row: any) =>
	row.content?.translations?.find((t: any) => t.language === 'en-US')?.text || 'N/A'

export async function GET(request: NextRequest) {
	try {
		const countries: any[] =
			must(await db.from(T.countries).select(`code, ${GEO_CONTENT}`)) ?? []

		const formattedCounties = countries
			.map((country) => ({ code: country.code, name: englishName(country) }))
			.sort((a, b) => a.code.localeCompare(b.code))

		return NextResponse.json({ counties: formattedCounties }, { status: 200 })
	} catch (error) {
		console.error('Error fetching countries:', error)
		return NextResponse.json(
			{ message: 'Error fetching countries' },
			{ status: 500 },
		)
	}
}
