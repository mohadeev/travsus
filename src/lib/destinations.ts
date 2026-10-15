// Data for the destination pages (countries, cities, places), loaded on the
// server so the pages are fast and readable by search engines.
// Names and descriptions come in all site languages (`translations` on each
// row); anything missing falls back to English.
// Weather and local time come from Open-Meteo (free, no key), cached 30 min.
import 'server-only'
import { cache } from 'react'
import { db, T } from '@/lib/db'
import { getHomeData, type HomeTour } from '@/lib/homeData'

type Tr = { name?: string; description?: string; language: string }
const pick = (translations: Tr[] | null | undefined, locale: string) => {
	const list = translations ?? []
	const mine = list.find((t) => t.language === locale)
	const en = list.find((t) => t.language === 'en-US') ?? list[0]
	return { name: mine?.name || en?.name || '', description: mine?.description || en?.description || '', englishName: en?.name || mine?.name || '' }
}
const imageOf = (image: any) => (typeof image?.url === 'string' && image.url.startsWith('https://') ? (image.url as string) : null)
const point = (geo: any) => (geo && Number.isFinite(geo.lat) && Number.isFinite(geo.log ?? geo.lng) ? { lat: Number(geo.lat), lng: Number(geo.log ?? geo.lng) } : null)
/** "Ait Benhaddou" → "ait-benhaddou" */
export const slugify = (name: string) =>
	name
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')

// Addresses use the English names, the same in every language:
// /en-US/destinations/morocco/marrakech (old 3-letter codes like /mar redirect here)
export const countryHref = (locale: string, country: { slug: string }) => `/${locale}/destinations/${country.slug}`
export const cityHref = (locale: string, country: { slug: string }, englishName: string) => `${countryHref(locale, country)}/${slugify(englishName)}`
/** 🇲🇦 from "MA" */
export const flag = (code2?: string | null) =>
	code2 && /^[A-Z]{2}$/i.test(code2) ? String.fromCodePoint(...Array.from(code2.toUpperCase()).map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : '🌍'

export type Country = { id: string; code: string; code3: string; slug: string; name: string; englishName: string; description: string; image: string | null; point: { lat: number; lng: number } | null; continent: string | null }
export type City = { id: string; name: string; englishName: string; description: string; image: string | null; point: { lat: number; lng: number } | null; population: number | null; region: string | null; country: Country; href: string }
export type Place = { id: string; name: string; description: string; image: string | null; point: { lat: number; lng: number } | null; rating: number | null; category: string; address: string | null; website: string | null }

const COUNTRY_SELECT = `id, code, code3, geo, image, translations, continent:${T.continents}(translations)`

function toCountry(row: any, locale: string): Country {
	const t = pick(row.translations, locale)
	return {
		id: row.id,
		code: row.code,
		code3: row.code3,
		slug: slugify(t.englishName) || row.code3.toLowerCase(),
		name: t.name,
		englishName: t.englishName,
		description: t.description,
		image: imageOf(row.image),
		point: point(row.geo),
		continent: row.continent ? pick(row.continent.translations, locale).name || null : null,
	}
}

/** English name slug → 3-letter code, for all countries (kept for a day) */
let slugs: { at: number; map: Promise<Map<string, string>> } | null = null
function countrySlugs() {
	if (!slugs || Date.now() - slugs.at > 86400_000) {
		const map = (async () => {
			const { data } = await db.from(T.countries).select('code3, translations')
			return new Map(((data ?? []) as any[]).map((r) => [slugify(pick(r.translations, 'en-US').englishName), r.code3 as string]))
		})()
		slugs = { at: Date.now(), map }
		map.catch(() => (slugs = null))
	}
	return slugs.map
}

/** A country by its name in the address ("morocco") or its old 3-letter code ("mar") */
export const getCountry = cache(async (slugOrCode: string, locale: string): Promise<Country | null> => {
	const key = slugOrCode.toLowerCase()
	const code3 = /^[a-z]{3}$/.test(key) ? key.toUpperCase() : (await countrySlugs()).get(key)
	if (!code3) return null
	const { data } = await db.from(T.countries).select(COUNTRY_SELECT).eq('code3', code3).maybeSingle()
	return data ? toCountry(data, locale) : null
})

/** Countries that have a photo (the ones worth showing), A–Z */
export const getCountries = cache(async (locale: string) => {
	const { data } = await db.from(T.countries).select(COUNTRY_SELECT).not('image', 'is', null)
	return ((data ?? []) as any[]).map((r) => toCountry(r, locale)).sort((a, b) => a.name.localeCompare(b.name, locale))
})

const CITY_SELECT = `id, code3, geo, image, population, translations, "countryId", state:${T.states}(translations)`

function toCity(row: any, country: Country, locale: string): City {
	const t = pick(row.translations, locale)
	return {
		id: row.id,
		name: t.name,
		englishName: t.englishName,
		description: t.description,
		image: imageOf(row.image),
		point: point(row.geo),
		population: row.population ?? null,
		region: row.state ? pick(row.state.translations, locale).name || null : null,
		country,
		href: cityHref(locale, country, t.englishName),
	}
}

/** A city by its id (old links) or by country + name slug (/destinations/mar/tangier) */
export const getCity = cache(async (countrySlug: string, slug: string, locale: string, id?: string | null): Promise<City | null> => {
	const country = await getCountry(countrySlug, locale)
	if (!country) return null
	if (id && /^[0-9a-f]{24}$/.test(id)) {
		const { data } = await db.from(T.cities).select(CITY_SELECT).eq('id', id).eq('countryId', country.id).maybeSingle()
		if (data) return toCity(data, country, locale)
	}
	// By English name: the slug's words, matched without case
	const words = slug.split('-').filter(Boolean)
	if (!words.length) return null
	// (the same name can exist in several countries: keep this country's)
	const { data: texts } = await db.from(T.geoTexts).select('contentId, text').eq('type', 'city').eq('language', 'en-US').ilike('text', words.join('%')).limit(50)
	const ids = ((texts ?? []) as any[]).filter((t) => slugify(t.text) === slug).map((t) => t.contentId)
	if (!ids.length) return null
	// Several matches in one country: the one with a photo first
	const { data } = await db.from(T.cities).select(CITY_SELECT).in('contentId', ids).eq('countryId', country.id).order('image', { ascending: true, nullsFirst: false }).limit(1).maybeSingle()
	return data ? toCity(data, country, locale) : null
})

/** Cities of a country that have a photo */
export const getCitiesOf = cache(async (country: Country, locale: string, limit = 24) => {
	const { data } = await db.from(T.cities).select(CITY_SELECT).eq('countryId', country.id).not('image', 'is', null).limit(limit)
	return ((data ?? []) as any[]).map((r) => toCity(r, country, locale))
})

const PLACE_SELECT = 'id, "cityId", geo, image, rating, category, subcategory, tags, address, website, translations'
const LABEL = (s: string) => s.replace(/[-_]+/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

function toPlace(row: any, locale: string): Place {
	const t = pick(row.translations, locale)
	return {
		id: row.id,
		name: t.name,
		description: t.description,
		image: imageOf(row.image),
		point: point(row.geo),
		rating: typeof row.rating === 'number' ? row.rating : null,
		category: (Array.isArray(row.tags) && row.tags[row.tags.length - 1]) || LABEL(row.subcategory || row.category || ''),
		address: row.address || null,
		website: typeof row.website === 'string' && /^https?:\/\//.test(row.website) ? row.website : null,
	}
}

/** Places to see in a city, best rated first */
export const getPlacesOfCity = cache(async (cityId: string, locale: string) => {
	const { data } = await db.from(T.places).select(PLACE_SELECT).eq('cityId', cityId).order('rating', { ascending: false, nullsFirst: false })
	return ((data ?? []) as any[]).map((r) => toPlace(r, locale))
})

/** Best-rated places across a country, with the city each is in */
export const getPlacesOfCountry = cache(async (country: Country, locale: string, limit = 8) => {
	const { data } = await db
		.from(T.places)
		.select(`${PLACE_SELECT}, city:${T.cities}(translations)`)
		.eq('countryId', country.id)
		.not('image', 'is', null)
		.order('rating', { ascending: false, nullsFirst: false })
		.limit(limit)
	return ((data ?? []) as any[]).map((r) => ({ ...toPlace(r, locale), city: r.city ? pick(r.city.translations, locale).name : null }))
})

/** How many places a country has */
export async function countPlacesOfCountry(country: Country) {
	const { count } = await db.from(T.places).select('id', { count: 'exact', head: true }).eq('countryId', country.id)
	return count ?? 0
}

/** TRAVSUS tours that start, end or go through a place (by name, any language) */
export async function getToursFor(names: string[], locale: string): Promise<HomeTour[]> {
	const words = Array.from(new Set(names.filter(Boolean).map((n) => n.toLowerCase())))
	if (!words.length) return []
	const { tours } = await getHomeData(locale)
	return tours.filter((t) => words.some((w) => t.searchText.includes(w)))
}

// ---- Weather (Open-Meteo) ----------------------------------------------------

export type Weather = {
	timezone: string | null
	now: { temp: number; code: number; wind: number; isDay: boolean } | null
	days: { date: string; max: number; min: number; code: number; rain: number }[]
}

export async function getWeather(p: { lat: number; lng: number } | null): Promise<Weather | null> {
	if (!p) return null
	const url =
		`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lng}` +
		'&current=temperature_2m,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=6&timezone=auto'
	try {
		const res = await fetch(url, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(4000) })
		if (!res.ok) return null
		const d = await res.json()
		return {
			timezone: d.timezone ?? null,
			now: d.current
				? { temp: Math.round(d.current.temperature_2m), code: d.current.weather_code, wind: Math.round(d.current.wind_speed_10m), isDay: d.current.is_day === 1 }
				: null,
			days: (d.daily?.time ?? []).slice(0, 6).map((date: string, i: number) => ({
				date,
				max: Math.round(d.daily.temperature_2m_max[i]),
				min: Math.round(d.daily.temperature_2m_min[i]),
				code: d.daily.weather_code[i],
				rain: d.daily.precipitation_probability_max?.[i] ?? 0,
			})),
		}
	} catch {
		return null
	}
}

/** WMO weather code → a word key (translated in "Destination") */
export const weatherKey = (code: number) =>
	code === 0 ? 'w_clear' : code <= 2 ? 'w_partly' : code === 3 ? 'w_cloudy' : code <= 48 ? 'w_fog' : code <= 57 ? 'w_drizzle' : code <= 67 ? 'w_rain' : code <= 77 ? 'w_snow' : code <= 82 ? 'w_showers' : code <= 86 ? 'w_snow' : 'w_storm'
