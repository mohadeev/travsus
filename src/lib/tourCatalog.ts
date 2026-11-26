// One slim list of every tour, shared by all visitors and cached for 10 minutes.
// Pages and APIs read this instead of loading every tour with all its texts,
// which used up the database's Disk IO budget. Editing a tour refreshes it.
import 'server-only'
import { revalidateTag } from 'next/cache'
import { unstable_cache } from '@/lib/stableCache'
import { db, T, REL, fetchAll, mongoCollection } from '@/lib/db'
import { updateLineItemsLogic } from '@/app/api/updateLineItems/updateLineItemsLogic'
import { isTourLive } from '@/lib/destinationPhotos'

export const TOURS_TAG = 'tours'
export const REVIEWS_TAG = 'reviews'
const TEN_MINUTES = 600
const CATALOG_PAGE = 50

type Address = { city: string | null; country: string | null } | null

export type CatalogTour = {
	id: string
	name: string
	subtitle: string
	/** Start of the English overview, for search */
	overview: string
	tags: string[]
	slugs: { language: string; slug: string }[]
	/** Tour name per language */
	names: Record<string, string>
	images: { url: string }[]
	dayCount: number
	startAddress: Address
	endAddress: Address
	createdAt: string | null
	/** 2-letter country code (null for older tours) */
	countryCode: string | null
	/** Per-person price for the default group (DEFAULT_ADULTS), as shown first on the tour page */
	pricePerPerson: number | null
}

const address = (a: any): Address => (a ? { city: a.city ?? null, country: a.country ?? null } : null)

async function startingPrice(tour: any) {
	try {
		const prices = await updateLineItemsLogic({ tour, body: {} })
		const total = (prices?.lineItems ?? [])
			.filter((item: any) => item.includeInTotal)
			.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0)
		const people = prices?.totalGuests || 1
		return total > 0 ? Math.round((total / people) * 100) / 100 : null
	} catch {
		return null
	}
}

export async function loadCatalog(): Promise<CatalogTour[]> {
	// Only the columns the lists need. From the translations only each name
	// (not the day texts, FAQ and overviews in 10 languages, tens of MB in all),
	// and from the days only their names, to count them: a heavy read here, made
	// by many pages at once when the cache is empty, overloaded the database.
	const rows = await fetchAll(() =>
		db
			.from(T.tours)
			.select(
				`id, name, subtitle, overview, tags, slugs, translations.language, translations.name, images, days.name, accommodations, pricingTiers, price, createdAt, countryCode, ${REL.tourAddresses}`,
			)
			.gt('images', '[]')
			// By id only: the id index serves each page at once, while sorting the
			// large tour documents by date took ~4 s per page (newest first is
			// done below)
			.order('id'),
		// Small pages: read in one go, the whole list took about 20 s and timed
		// out on Workers, so the cached copy was never refreshed
		CATALOG_PAGE,
	)
	// Newest first, as before
	rows.sort((a: any, b: any) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
	// Tours in countries that aren't open yet stay out of every list
	return Promise.all(
		rows.filter(isTourLive).map(async (tour: any): Promise<CatalogTour> => ({
			id: tour.id,
			name: tour.name ?? '',
			subtitle: tour.subtitle ?? '',
			overview: String(tour.overview ?? '').slice(0, 400),
			tags: Array.isArray(tour.tags) ? tour.tags : [],
			slugs: tour.slugs ?? [],
			names: Object.fromEntries(
				(tour.translations ?? []).filter((t: any) => t?.language && t.name).map((t: any) => [t.language, t.name]),
			),
			images: (tour.images ?? []).slice(0, 5).map((img: any) => ({ url: img?.url })).filter((img: any) => img.url),
			dayCount: Array.isArray(tour.days) ? tour.days.length : 0,
			startAddress: address(tour.startAddress),
			endAddress: address(tour.endAddress),
			createdAt: tour.createdAt ?? null,
			countryCode: tour.countryCode ? String(tour.countryCode).toUpperCase() : null,
			pricePerPerson: await startingPrice(tour),
		})),
	)
}

/** Every tour with photos, newest first (cached; one database read per 10 minutes). */
export const getTourCatalog = unstable_cache(loadCatalog, ['tour-catalog-v4'], {
	revalidate: TEN_MINUTES,
	tags: [TOURS_TAG],
})

/** All ratings and the latest good reviews (cached). */
export const getReviewData = unstable_cache(
	async (reviewSelect: string) => {
		const [{ data: ratings }, { data: latest }] = await Promise.all([
			db.from(T.reviews).select('tourId, rating'),
			db.from(T.reviews).select(reviewSelect).gte('rating', 4).order('createdAt', { ascending: false }).limit(20),
		])
		return { ratings: (ratings ?? []) as { tourId: string; rating: number }[], latest: (latest ?? []) as any[] }
	},
	['review-data-v1'],
	{ revalidate: TEN_MINUTES, tags: [REVIEWS_TAG] },
)

/**
 * How many visits saw each tour page in the last 90 days (a visit that opens
 * the page twice counts once), by tour id. Cached for an hour.
 */
export const getTourViews = unstable_cache(
	async (): Promise<Record<string, number>> => {
		try {
			const events = await mongoCollection(T.analyticsEvents)
			const since = new Date(Date.now() - 90 * 24 * 3600_000)
			const rows = await events
				.aggregate([
					// Timestamps are stored as dates or as ISO text
					{ $match: { type: 'pageview', $or: [{ created_at: { $gte: since } }, { created_at: { $gte: since.toISOString() } }] } },
					// Tour pages end in the tour id: /en-US/morocco/fes/tours/<slug>/<id>
					{ $project: { session_id: 1, match: { $regexFind: { input: '$path', regex: /\/([0-9a-f]{24})\/?$/ } } } },
					{ $match: { match: { $ne: null } } },
					{ $group: { _id: { tour: { $arrayElemAt: ['$match.captures', 0] }, visit: '$session_id' } } },
					{ $group: { _id: '$_id.tour', views: { $sum: 1 } } },
				])
				.toArray()
			return Object.fromEntries(rows.map((row) => [row._id as string, row.views as number]))
		} catch (error) {
			console.error('Tour views error:', error)
			return {}
		}
	},
	['tour-views-v1'],
	{ revalidate: 3600 },
)

/** Prices and photos for a few tours (light columns only, for tour cards). */
export async function cardPricing(ids: string[]) {
	if (!ids.length) return new Map<string, any>()
	const { data } = await db.from(T.tours).select('id, accommodations, pricingTiers, price').in('id', ids)
	return new Map((data ?? []).map((row: any) => [row.id, row]))
}

/** The shape tour cards (ExperiencesCard) expect, in one language. */
export function toCard(tour: CatalogTour, language: string, pricing?: any) {
	return {
		id: tour.id,
		name: tour.names[language] || tour.names['en-US'] || tour.name,
		slugs: tour.slugs,
		images: tour.images,
		// Cards only read the number of days and the first day's place
		days: Array.from({ length: tour.dayCount }, () => ({})),
		startAddress: tour.startAddress,
		endAddress: tour.endAddress,
		accommodations: pricing?.accommodations ?? [],
		pricingTiers: pricing?.pricingTiers ?? [],
		price: pricing?.price ?? '',
		startPrice: tour.pricePerPerson,
		liked: false,
	}
}

/** Call after a tour or review changes so lists show it right away. */
export function refreshTourCache() {
	try {
		revalidateTag(TOURS_TAG, { expire: 0 })
		revalidateTag(REVIEWS_TAG, { expire: 0 })
	} catch (error) {
		console.error('Tour cache refresh failed:', error)
	}
}
