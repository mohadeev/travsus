// The photo of a destination city (geo_cities.image), found by English city and
// country name like the destination pages do. Cached for a day: city photos rarely change.
import 'server-only'
import { unstable_cache } from 'next/cache'
import { db, T } from '@/lib/db'

const contentIds = async (type: 'city' | 'country', name: string) => {
	const { data } = await db.from(T.geoTexts).select('contentId, text').eq('type', type).eq('language', 'en-US').ilike('text', name).limit(50)
	return ((data ?? []) as any[]).filter((t) => t.text?.toLowerCase() === name.toLowerCase()).map((t) => t.contentId)
}

async function findCityPhoto(city: string, country: string | null): Promise<string | null> {
	const cityIds = await contentIds('city', city)
	if (!cityIds.length) return null
	let query = db.from(T.cities).select('image').in('contentId', cityIds).not('image', 'is', null)
	// The same city name can exist in several countries: keep the tour's country
	if (country) {
		const countryIds = await contentIds('country', country)
		const { data: countryRow } = countryIds.length ? await db.from(T.countries).select('id').in('contentId', countryIds).limit(1).maybeSingle() : { data: null }
		if (countryRow) query = query.eq('countryId', (countryRow as any).id)
	}
	const { data } = await query.limit(1).maybeSingle()
	const url = (data as any)?.image?.url
	return typeof url === 'string' && url.startsWith('https://') ? url : null
}

/** City photo URL, or null when the city has none (callers keep their fallback). */
export const getCityPhoto = unstable_cache(
	async (city: string, country: string | null) => findCityPhoto(city, country).catch(() => null),
	['city-photo-v1'],
	{ revalidate: 86400 },
)
