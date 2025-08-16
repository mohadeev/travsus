import { NextResponse } from 'next/server'
import { placesClient } from '@/lib/prisma'

function extractLanguageFromRequest(request: Request): string {
	const referer = request.headers.get('referer') || ''
	const origin = request.headers.get('origin') || ''

	const urlToCheck = referer || origin
	const languageMatch = urlToCheck.match(/\/([a-z]{2}-[A-Z]{2})(?:\/|$)/)

	return languageMatch ? languageMatch[1] : 'en-US'
}

export async function GET(request: Request) {
	try {
		const language = extractLanguageFromRequest(request)
		const { searchParams } = new URL(request.url)
		const countryId = searchParams.get('countryId')

		if (countryId) {
			const cities = await placesClient.city.findMany({
				where: { countryId: countryId },
				include: {
					content: {
						include: {
							translations: {
								where: { language: language },
							},
						},
					},
				},
				orderBy: { id: 'asc' },
			})

			const citiesWithNames = cities.map((city) => ({
				...city,
				name: city.content?.translations[0]?.text || city.id,
			}))

			return NextResponse.json({
				success: true,
				data: citiesWithNames,
			})
		}

		const countries = await placesClient.country.findMany({
			include: {
				content: {
					include: {
						translations: {
							where: { language: language },
						},
					},
				},
			},
			orderBy: { code: 'asc' },
		})

		const countriesWithNames = countries.map((country) => ({
			...country,
			name: country.content?.translations[0]?.text || country.code,
		}))

		return NextResponse.json({
			success: true,
			data: countriesWithNames,
		})
	} catch (error) {
		console.error('Error fetching data:', error)
		return NextResponse.json(
			{ success: false, message: 'Failed to fetch data' },
			{ status: 500 },
		)
	} finally {
		await placesClient.$disconnect()
	}
}
