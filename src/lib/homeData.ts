// Data for the home page, loaded on the server (fast, and in the HTML for SEO).
import { cache } from 'react'
import { db, T, REL } from '@/lib/db'
import { routing } from '@/i18n/routing'
import { updateLineItemsLogic } from '@/app/api/updateLineItems/updateLineItemsLogic'
import { REVIEW_SELECT, localizeReview } from '@/lib/reviews'

export type HomeTour = {
	id: string
	name: string
	href: string
	image: string
	days: number
	city: string | null
	pricePerPerson: number | null
	rating: number | null
	reviewsCount: number
	/** Lower-case words the search matches against (names, overview, cities) */
	searchText: string
}

export type HomeReview = {
	id: string
	author: string
	rating: number
	title: string
	content: string
	travelType: string | null
	date: string | null
	verified: boolean
	tour: { name: string; href: string } | null
}

export type HomeDestination = {
	city: string
	country: string | null
	image: string
	toursCount: number
	fromStart?: boolean // photo comes from a tour starting here
}

const slugFor = (tour: any, locale: string) => {
	const slugs: { language: string; slug: string }[] = tour.slugs ?? []
	return (
		slugs.find((s) => s.language === locale)?.slug ??
		slugs.find((s) => s.language === routing.defaultLocale)?.slug ??
		slugs[0]?.slug ??
		null
	)
}

/** Per-person price for 2 adults: the price shown first on the tour page. */
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

export const getHomeData = cache(async (locale: string) => {
	const [{ data: tours }, { data: reviews }, { data: latestReviews }] = await Promise.all([
		db
			.from(T.tours)
			.select(
				`id, name, subtitle, overview, tags, slugs, translations, images, days, accommodations, pricingTiers, price, ${REL.tourAddresses}`,
			)
			.gt('images', '[]')
			.order('createdAt', { ascending: false }),
		db.from(T.reviews).select('tourId, rating'),
		db
			.from(T.reviews)
			.select(REVIEW_SELECT)
			.gte('rating', 4)
			.order('createdAt', { ascending: false })
			.limit(9),
	])

	// Real ratings per tour
	const ratings = new Map<string, { sum: number; count: number }>()
	for (const review of reviews ?? []) {
		if (!review.tourId || !review.rating) continue
		const entry = ratings.get(review.tourId) ?? { sum: 0, count: 0 }
		entry.sum += review.rating
		entry.count += 1
		ratings.set(review.tourId, entry)
	}

	const homeTours: HomeTour[] = []
	const destinations = new Map<string, HomeDestination>()

	for (const tour of (tours ?? []) as any[]) {
		const href = slugFor(tour, locale)
		const image = tour.images?.[0]?.url
		if (!href || !image) continue

		const translated =
			tour.translations?.find((t: any) => t.language === locale) ?? {}
		const rating = ratings.get(tour.id)
		const city = tour.startAddress?.city ?? null

		homeTours.push({
			id: tour.id,
			name: translated.name || tour.name,
			href,
			image,
			days: tour.days?.length ?? 0,
			city,
			pricePerPerson: await startingPrice(tour),
			rating: rating ? Math.round((rating.sum / rating.count) * 10) / 10 : null,
			reviewsCount: rating?.count ?? 0,
			searchText: [
				tour.name,
				translated.name,
				tour.subtitle,
				translated.subtitle,
				tour.overview,
				...(Array.isArray(tour.tags) ? tour.tags : []),
				tour.startAddress?.city,
				tour.endAddress?.city,
				tour.startAddress?.country,
			]
				.filter(Boolean)
				.join(' ')
				.toLowerCase(),
		})

		// Every city a tour starts or ends in is a destination (counted once per tour)
		const cities = new Map<string, any>()
		for (const address of [tour.startAddress, tour.endAddress]) {
			if (address?.city) cities.set(address.city.toLowerCase(), address)
		}
		const startKey = tour.startAddress?.city?.toLowerCase()
		for (const [key, address] of Array.from(cities)) {
			const destination: HomeDestination = destinations.get(key) ?? {
				city: address.city,
				country: address.country ?? null,
				image,
				toursCount: 0,
			}
			// Prefer a photo from a tour that starts in this city
			if (key === startKey && !destination.fromStart) {
				destination.image = image
				destination.fromStart = true
			}
			destination.toursCount += 1
			destinations.set(key, destination)
		}
	}

	// Best rated (most reviewed) first
	homeTours.sort(
		(a, b) =>
			(b.rating ?? 0) * Math.log(1 + b.reviewsCount) -
			(a.rating ?? 0) * Math.log(1 + a.reviewsCount),
	)

	const tourById = new Map(homeTours.map((tour) => [tour.id, tour]))
	const homeReviews: HomeReview[] = (latestReviews ?? []).map((raw: any) => {
		const review = localizeReview(raw, locale)
		const tour = tourById.get(review.tourId)
		const first = review.user?.accountData?.firstname || 'Traveler'
		return {
			id: review.id,
			// Usernames like "laura.gomez92" become "Laura"
			author: first.split(/[._\d]/)[0].replace(/^./, (c: string) => c.toUpperCase()) || 'Traveler',
			rating: review.rating,
			title: review.title ?? '',
			content: review.content ?? '',
			travelType: review.travelType ?? null,
			date: review.travelDate1 ?? review.createdAt ?? null,
			verified: review.isVerified === true,
			tour: tour ? { name: tour.name, href: tour.href } : null,
		}
	})

	const allRatings = (reviews ?? []).filter((r: any) => r.rating)
	const averageRating = allRatings.length
		? Math.round(
				(allRatings.reduce((sum: number, r: any) => sum + r.rating, 0) /
					allRatings.length) *
					10,
			) / 10
		: null

	return {
		reviews: homeReviews,
		rating: { average: averageRating, count: allRatings.length },
		tours: homeTours,
		destinations: Array.from(destinations.values()).sort(
			(a, b) => b.toursCount - a.toursCount,
		),
	}
})
