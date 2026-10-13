// Search + filters for /search. Everything comes from the URL, so every
// filter is a normal link (fast, shareable, crawlable).
import { getHomeData, type HomeTour } from '@/lib/homeData'

export type SearchFilters = {
	query: string
	duration: 'any' | '1' | '2-3' | '4+'
	maxPrice: number | null
	rating: number | null
	sort: 'recommended' | 'price_low' | 'price_high' | 'rating'
}

const DURATIONS = ['any', '1', '2-3', '4+'] as const
const SORTS = ['recommended', 'price_low', 'price_high', 'rating'] as const

/** Price buckets offered as filters, in euros per person. */
export const PRICE_STEPS = [150, 300, 600]

/** Reads and validates the filters from the page's search params. */
export function readFilters(params: Record<string, string | string[] | undefined>): SearchFilters {
	const one = (key: string) => {
		const value = params[key]
		return (Array.isArray(value) ? value[0] : value) ?? ''
	}
	const duration = one('duration') as SearchFilters['duration']
	const sort = one('sort') as SearchFilters['sort']
	const maxPrice = Number(one('maxPrice'))
	const rating = Number(one('rating'))
	return {
		query: one('query').trim().slice(0, 100),
		duration: DURATIONS.includes(duration) ? duration : 'any',
		maxPrice: maxPrice > 0 ? maxPrice : null,
		rating: rating > 0 && rating <= 5 ? rating : null,
		sort: SORTS.includes(sort) ? sort : 'recommended',
	}
}

/** The URL for these filters with some of them changed (null removes one). */
export function filtersHref(filters: SearchFilters, changes: Partial<Record<keyof SearchFilters, string | number | null>>) {
	const merged: Record<string, any> = { ...filters, ...changes }
	const params = new URLSearchParams()
	params.set('query', merged.query ?? '')
	if (merged.duration && merged.duration !== 'any') params.set('duration', merged.duration)
	if (merged.maxPrice) params.set('maxPrice', String(merged.maxPrice))
	if (merged.rating) params.set('rating', String(merged.rating))
	if (merged.sort && merged.sort !== 'recommended') params.set('sort', merged.sort)
	return `/search?${params.toString()}`
}

const matchesDuration = (days: number, duration: SearchFilters['duration']) =>
	duration === 'any' ||
	(duration === '1' && days <= 1) ||
	(duration === '2-3' && days >= 2 && days <= 3) ||
	(duration === '4+' && days >= 4)

export async function searchTours(locale: string, filters: SearchFilters): Promise<HomeTour[]> {
	const { tours } = await getHomeData(locale)
	// Every word must appear somewhere ("desert marrakech" finds tours with both)
	const words = filters.query.toLowerCase().split(/\s+/).filter(Boolean)

	const results = tours.filter(
		(tour) =>
			words.every((word) => tour.searchText.includes(word)) &&
			matchesDuration(tour.days, filters.duration) &&
			(!filters.maxPrice || (tour.pricePerPerson ?? Infinity) <= filters.maxPrice) &&
			(!filters.rating || (tour.rating ?? 0) >= filters.rating),
	)

	const price = (tour: HomeTour) => tour.pricePerPerson ?? Infinity
	switch (filters.sort) {
		case 'price_low':
			return results.sort((a, b) => price(a) - price(b))
		case 'price_high':
			return results.sort((a, b) => (b.pricePerPerson ?? 0) - (a.pricePerPerson ?? 0))
		case 'rating':
			return results.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewsCount - a.reviewsCount)
		default:
			return results // already best-rated first, then newest
	}
}
