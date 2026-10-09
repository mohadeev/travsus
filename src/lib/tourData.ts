// Loads everything the tour detail page needs. Used by the page directly and
// by GET /api/listing/get/getTourData — no HTTP round-trip from the server.
import { cache } from 'react'
import { db, T, REL, must } from '@/lib/db'

/** Name of a geo row in `language` (geo rows store translations as { language, name }). */
const nameIn = (row: any, language: string) =>
	row?.translations?.find((t: any) => t.language === language)?.name || ''

/**
 * Tour + translated fields + reviews + day locations, or null if the tour
 * doesn't exist. Cached per request, so metadata and page share one load.
 */
export const getTourData = cache(async function getTourData(
	id: string,
	language: string,
) {
	const [tour, reviews, allRatings] = await Promise.all([
		db
			.from(T.tours)
			.select(`*, ${REL.tourAddresses}`)
			.eq('id', id)
			.maybeSingle()
			.then(must),
		db
			.from(T.reviews)
			.select(`*, user:${T.users}(accountData, profileImage)`)
			.eq('tourId', id)
			.order('createdAt', { ascending: false })
			.limit(10)
			.then(must),
		db.from(T.reviews).select('rating').eq('tourId', id).then(must),
	])

	if (!tour) return null

	const currentLang = (tour.translations ?? []).find(
		(t: any) => t.language === language,
	)
	let days: any[] = currentLang?.days || []

	// Attach city / state / country / continent names to each day
	const cityIds = days
		.map((d) => d.cityId)
		.filter((cid) => cid && cid !== 'undefined')
	if (cityIds.length) {
		try {
			const cities: any[] =
				must(
					await db
						.from(T.cities)
						.select(
							`id, translations,
							country:${T.countries}(translations, continent:${T.continents}(translations)),
							state:${T.states}(translations)`,
						)
						.in('id', cityIds),
				) ?? []

			days = days.map((day) => {
				const city = cities.find((c) => c.id === day.cityId)
				return {
					...day,
					state: nameIn(city?.state, language),
					city: nameIn(city, language),
					country: nameIn(city?.country, language),
					continent: nameIn(city?.country?.continent, language),
				}
			})
		} catch (error) {
			// Geography is optional: the tour still renders without it
			console.error('Error fetching city data:', error)
		}
	}

	// Fall back to the start address when geography data is missing
	const start = tour.startAddress ?? {}
	days = days.map((day) => ({
		...day,
		city: day.city || start.city || '',
		country: day.country || start.country || '',
	}))

	const ratings = (allRatings ?? [])
		.map((r: any) => r.rating)
		.filter(Number.isFinite)
	const reviewsCount = ratings.length
	const averageRating = ratings.length
		? Math.round(
				(ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length) *
					10,
			) / 10
		: null

	const translatedReviews = (reviews ?? []).map((review: any) => ({
		...review,
		...(review.translations ?? []).find((t: any) => t.language === language),
		language,
	}))

	return {
		...tour,
		translatedReviews,
		formattedReviews: reviews,
		language,
		reviewsCount,
		averageRating,
		continentInfo: null,
		...currentLang,
		days,
	}
})
