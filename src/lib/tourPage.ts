// What a tour page shows besides the tour itself: four other tours, the
// "from" price in the booking card and the price range for Google. Worked out
// once per tour and language and cached (KV on Cloudflare), so a tour page
// doesn't load the whole catalogue or price 50 group sizes on every render.
import 'server-only'
import { unstable_cache } from '@/lib/stableCache'
import { updateLineItemsLogic } from '@/app/api/updateLineItems/updateLineItemsLogic'
import { getHomeData, type HomeTour } from '@/lib/homeData'
import { getTourData } from '@/lib/tourData'
import { REVIEWS_TAG, TOURS_TAG } from '@/lib/tourCatalog'

/** Per-person price for a group of `size` guests (same logic as the sidebar). */
async function pricePerPerson(tour: any, size: number) {
	const prices = await updateLineItemsLogic({
		tour,
		body: { guests: { guestAdults: size, guestChildren: 0 } },
	})
	const total = (prices?.lineItems ?? [])
		.filter((item: any) => item.includeInTotal)
		.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0)
	return total > 0 ? total / size : undefined
}

/** Real per-person price range over every group size the tour accepts. */
async function priceRange(tour: any) {
	const maxSeats = Math.max(
		1,
		...(tour.pricingTiers ?? []).map((tier: any) => tier.maxSeats || 0),
	)
	const prices: number[] = []
	for (let size = 1; size <= Math.min(maxSeats, 50); size++) {
		const price = await pricePerPerson(tour, size).catch(() => undefined)
		if (price) prices.push(price)
	}
	if (!prices.length) return null
	return { low: Math.min(...prices), high: Math.max(...prices) }
}

export type TourPageExtras = {
	/** Four other tours, the ones starting in the same city first */
	similar: Omit<HomeTour, 'searchText'>[]
	/** Shown in the booking card until the browser has priced the booking */
	fromPricePerPerson: number | null
	/** Among the most visited tours */
	popular: boolean
	prices: { low: number; high: number } | null
}

/**
 * The price range, saved per tour (it prices up to 50 group sizes). Cached on
 * its own: data cached *inside* another cached function is not looked up
 * (the framework skips nested caches), so the extras below are a plain
 * function built on the saved tour list and the saved tour.
 */
const cachedPriceRange = unstable_cache(priceRange, ['tour-price-range-v1'], {
	revalidate: 3600,
	tags: [TOURS_TAG],
})

/**
 * Similar tours, "from" price, popular flag (all from the saved tour list)
 * and the price range. Throws only when the tour list itself can't be read;
 * a missing price range just leaves it out.
 */
export async function getTourPageExtras(tourId: string, locale: string): Promise<TourPageExtras | null> {
	const [tour, { tours }] = await Promise.all([getTourData(tourId, locale), getHomeData(locale)])
	if (!tour) return null
	const city = (tour as any).startAddress?.city
	const similar = tours
		.filter((other) => other.id !== tourId)
		.sort((a, b) => Number(b.city === city) - Number(a.city === city))
		.slice(0, 4)
		.map(({ searchText, ...card }) => card) // not needed in the browser
	const prices = await Promise.race([
		cachedPriceRange(tour),
		new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000)),
	]).catch(() => null)
	return {
		similar,
		fromPricePerPerson: tours.find((t) => t.id === tourId)?.pricePerPerson ?? null,
		popular: !!tours.find((t) => t.id === tourId)?.popular,
		prices,
	}
}
