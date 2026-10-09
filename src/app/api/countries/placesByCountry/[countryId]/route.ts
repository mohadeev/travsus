export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { db, T, must } from '@/lib/db'
import { GEO_CONTENT, keepTranslations } from '@/lib/geo'

/** English text of a given translation type on a geo row. */
const englishText = (row: any, type?: string) =>
	row?.content?.translations?.find(
		(t: any) => t.language === 'en-US' && (!type || t.type === type),
	)?.text

export async function GET(
	request: Request,
	{ params }: { params: { countryId: string } },
) {
	try {
		const { countryId } = params

		if (!countryId) {
			return NextResponse.json(
				{ error: 'Country ID is required' },
				{ status: 400 },
			)
		}

		const country: any = must(
			await db
				.from(T.countries)
				.select(`*, ${GEO_CONTENT}`)
				.eq('id', countryId)
				.maybeSingle(),
		)

		if (!country) {
			return NextResponse.json({ error: 'Country not found' }, { status: 404 })
		}

		// Cities in this country that have an image, and their places
		const citiesWithImages: any[] =
			must(
				await db
					.from(T.cities)
					.select(`id, image, ${GEO_CONTENT}`)
					.eq('countryId', countryId)
					.not('image', 'is', null),
			) ?? []

		const cityIds = citiesWithImages.map((city) => city.id)
		const places: any[] = cityIds.length
			? must(
					await db
						.from(T.places)
						.select(`*, ${GEO_CONTENT}, city:${T.cities}(id, ${GEO_CONTENT})`)
						.in('cityId', cityIds),
				)
			: []

		const formattedCities = citiesWithImages.map((city) => ({
			id: city.id,
			name: englishText(city, 'city') || 'Unknown City',
			image: city.image,
		}))

		const formattedPlaces = places.map((row) => {
			const place = keepTranslations(row, (t) => t.language === 'en-US')
			const find = (type: string) =>
				place.content?.translations.find((t: any) => t.type === type)?.text
			return {
				id: place.id,
				name: find('name') || 'Unnamed Place',
				description: find('description') || '',
				category: place.category,
				type: place.type,
				image: place.image,
				geo: place.geo,
				rating: place.rating,
				address: place.address,
				cityId: place.cityId,
				cityName: englishText(place.city, 'city') || 'Unknown City',
			}
		})

		return NextResponse.json({
			country: {
				id: country.id,
				name: englishText(country, 'country') || 'Unknown Country',
				code: country.code,
				code3: country.code3,
				image: country.image,
			},
			cities: formattedCities,
			places: formattedPlaces,
		})
	} catch (error) {
		console.error('Error fetching country and places:', error)
		return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
	}
}
