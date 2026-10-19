// One slim list of every tour, shared by all visitors and cached for 10 minutes.
// Pages and APIs read this instead of loading every tour with all its texts,
// which used up the database's Disk IO budget. Editing a tour refreshes it.
import 'server-only'
import { revalidateTag, unstable_cache } from 'next/cache'
import { db, T, REL, fetchAll } from '@/lib/db'
import { updateLineItemsLogic } from '@/app/api/updateLineItems/updateLineItemsLogic'

export const TOURS_TAG = 'tours'
export const REVIEWS_TAG = 'reviews'
const TEN_MINUTES = 600

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
	/** Per-person price for 2 adults, as shown first on the tour page */
	pricePerPerson: number | null
}

const address = (a: any): Address => (a ? { city: a.city ?? null, country: a.country ?? null } : null)

async function startingPrice(tour: any) {
	try {
		const prices = await updateLineItemsLogic({ tour, body: {} })
		const total = (prices?.lineItems ?? [])
			.filter((item: any) => item.includeInTotal)
			.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0)
		return total > 0 ? Math.round((total / 2) * 100) / 100 : null
	} catch {
		return null
	}
}

async function loadCatalog(): Promise<CatalogTour[]> {
	// Only the columns the lists need; long day texts are left out
	const rows = await fetchAll(() =>
		db
			.from(T.tours)
			.select(
				`id, name, subtitle, overview, tags, slugs, translations, images, days, accommodations, pricingTiers, price, createdAt, ${REL.tourAddresses}`,
			)
			.gt('images', '[]')
			.order('createdAt', { ascending: false })
			.order('id'),
	)
	return Promise.all(
		rows.map(async (tour: any): Promise<CatalogTour> => ({
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
			pricePerPerson: await startingPrice(tour),
		})),
	)
}

/** Every tour with photos, newest first (cached; one database read per 10 minutes). */
export const getTourCatalog = unstable_cache(loadCatalog, ['tour-catalog-v1'], {
	revalidate: TEN_MINUTES,
	tags: [TOURS_TAG],
})

/** All ratings and the latest good reviews (cached). */
export const getReviewData = unstable_cache(
	async (reviewSelect: string) => {
		const [{ data: ratings }, { data: latest }] = await Promise.all([
			db.from(T.reviews).select('tourId, rating'),
			db.from(T.reviews).select(reviewSelect).gte('rating', 4).order('createdAt', { ascending: false }).limit(9),
		])
		return { ratings: (ratings ?? []) as { tourId: string; rating: number }[], latest: (latest ?? []) as any[] }
	},
	['review-data-v1'],
	{ revalidate: TEN_MINUTES, tags: [REVIEWS_TAG] },
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
		revalidateTag(TOURS_TAG)
		revalidateTag(REVIEWS_TAG)
	} catch (error) {
		console.error('Tour cache refresh failed:', error)
	}
}
