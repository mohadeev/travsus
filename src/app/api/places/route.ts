export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { db, T, fetchAll } from '@/lib/db'
import { GEO_CONTENT, keepTranslations, languageFromReferer } from '@/lib/geo'

/** Adds `name` from the row's translation in `language`, falling back to `fallback`. */
const withName = (row: any, language: string, fallback: string) => {
	const localized = keepTranslations(row, (t) => t.language === language)
	return { ...localized, name: localized.content?.translations[0]?.text || fallback }
}

// GET /api/places            -> all countries
// GET /api/places?countryId= -> all cities of that country
export async function GET(request: Request) {
	try {
		const language = languageFromReferer(request)
		const countryId = new URL(request.url).searchParams.get('countryId')

		if (countryId) {
			const cities = await fetchAll(() =>
				db
					.from(T.cities)
					.select(`*, ${GEO_CONTENT}`)
					.eq('countryId', countryId)
					.order('id', { ascending: true }),
			)
			return NextResponse.json({
				success: true,
				data: cities.map((city) => withName(city, language, city.id)),
			})
		}

		const countries = await fetchAll(() =>
			db.from(T.countries).select(`*, ${GEO_CONTENT}`).order('code', { ascending: true }),
		)
		return NextResponse.json({
			success: true,
			data: countries.map((country) => withName(country, language, country.code)),
		})
	} catch (error) {
		console.error('Error fetching data:', error)
		return NextResponse.json(
			{ success: false, message: 'Failed to fetch data' },
			{ status: 500 },
		)
	}
}
