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

async function loadTourPageExtras(tourId: string, locale: string): Promise<TourPageExtras | null> {
	const [tour, { tours }] = await Promise.all([getTourData(tourId, locale), getHomeData(locale)])
	if (!tour) return null
	const city = (tour as any).startAddress?.city
	const similar = tours
		.filter((other) => other.id !== tourId)
		.sort((a, b) => Number(b.city === city) - Number(a.city === city))
		.slice(0, 4)
		.map(({ searchText, ...card }) => card) // not needed in the browser
	return {
		similar,
		fromPricePerPerson: tours.find((t) => t.id === tourId)?.pricePerPerson ?? null,
		popular: !!tours.find((t) => t.id === tourId)?.popular,
		prices: await priceRange(tour),
	}
}

export const getTourPageExtras = unstable_cache(loadTourPageExtras, ['tour-page-extras-v1'], {
	revalidate: 3600,
	tags: [TOURS_TAG, REVIEWS_TAG],
})
