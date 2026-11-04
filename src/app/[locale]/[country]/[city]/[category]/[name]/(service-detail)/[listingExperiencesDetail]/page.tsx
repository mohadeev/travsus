import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { updateLineItemsLogic } from '@/app/api/updateLineItems/updateLineItemsLogic'
import { getTourData } from '@/lib/tourData'
import { getHomeData } from '@/lib/homeData'
import ListingExperiencesDetailPage from './TourDetailClient'
import { getTourCatalog } from '@/lib/tourCatalog'
import RecentTourTracker from '@/components/RecentTourTracker'
import {
	tourAlternates,
	tourDescription,
	tourImages,
	tourJsonLd,
	tourTitle,
	tourUrl,
} from './tourSeo'

// Same HTML for every visitor (the "saved" heart is set in the browser), so
// each tour is rendered once and served from the cache (Cloudflare KV on the
// Worker), refreshed at most every hour. This is the page file, not a layout,
// because vinext reads `revalidate` from the page.
export const revalidate = 3600

type TourParams = { locale: string; country: string; city: string; category: string; name: string; listingExperiencesDetail: string }

/**
 * Every tour in this language. The Cloudflare build lists them so a deploy
 * with --warm-cache renders each one into the cache; the Next.js build keeps
 * rendering each tour on its first visit (no database load at build time).
 */
export async function generateStaticParams({ params }: { params: { locale: string } }) {
	if (!process.env.CLOUDFLARE_BUILD) return []
	const tours = await getTourCatalog()
	return tours.flatMap((tour) => {
		const slug = tour.slugs.find((s: any) => s.language === params.locale)?.slug
		// /{locale}/{country}/{city}/{category}/{name}/{id}
		const [, locale, country, city, category, name, id] = (slug ?? '').split('/')
		return locale === params.locale && id ? [{ country, city, category, name, listingExperiencesDetail: id }] : []
	})
}

interface DetailPageProps {
	params: Promise<TourParams>
}

// <head>: title, description, canonical, hreflang, social cards
export async function generateMetadata(
	props: {
		params: Promise<TourParams>
	}
): Promise<Metadata> {
	const params = await props.params;
	const { listingExperiencesDetail: tourId, locale } = params
	const tour: any = await getTourData(tourId, locale).catch(() => null)

	if (!tour) {
		return {
			title: 'Tour Not Found | TRAVSUS',
			description: 'The requested tour could not be found.',
			robots: { index: false, follow: true },
		}
	}

	const url = tourUrl(tour, locale)
	const title = tourTitle(tour)
	const description = tourDescription(tour)
	const images = tourImages(tour).slice(0, 4)

	return {
		title,
		description,
		keywords: tour.tags?.length ? tour.tags.join(', ') : undefined,
		alternates: { canonical: url, languages: tourAlternates(tour) },
		openGraph: {
			type: 'website',
			url,
			title,
			description,
			siteName: 'TRAVSUS',
			locale: locale.replace('-', '_'),
			images: images.map((image) => ({ url: image, alt: tour.name })),
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: images.slice(0, 1),
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				'max-image-preview': 'large',
				'max-snippet': -1,
				'max-video-preview': -1,
			},
		},
	}
}

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
	if (!prices.length) return undefined
	return { low: Math.min(...prices), high: Math.max(...prices) }
}

const DetailPage = async (props: DetailPageProps) => {
	const params = await props.params;
	const { listingExperiencesDetail: tourId, locale } = params
	// The page's language from the address, not the request headers, so the page can be cached
	setRequestLocale(locale)

	try {
		const tour: any = await getTourData(tourId, locale)
		if (!tour) notFound()


		// Four other tours, the ones starting in the same city first
		const { tours } = await getHomeData(locale)
		const city = tour.startAddress?.city
		const similar = tours
			.filter((other) => other.id !== tour.id)
			.sort((a, b) => Number(b.city === city) - Number(a.city === city))
			.slice(0, 4)
			.map(({ searchText, ...card }) => card) // not needed in the browser
		// Shown in the booking card until the browser has priced the booking
		const fromPricePerPerson = tours.find((t) => t.id === tour.id)?.pricePerPerson ?? null

		const jsonLd = tourJsonLd(tour, locale, {
			prices: await priceRange(tour),
			currency: tour.pricingTiers?.[0]?.pricing?.currency || 'EUR',
		})

		return (
			<div className="ListingDetailPage">
				<RecentTourTracker tourId={tour.id} />
				<div className="ListingDetailPage__content">
					<ListingExperiencesDetailPage serviceData={{ ...tour, fromPricePerPerson }} similar={similar as any} />
				</div>
				<script
					type="application/ld+json"
					// "<" is escaped so tour text can never close the script tag
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
					}}
				/>
			</div>
		);
	} catch (error: any) {
		// Let Next.js handle notFound() / redirect() instead of showing an error
		if (typeof error?.digest === 'string' && error.digest.startsWith('NEXT_')) {
			throw error
		}
		console.error('Error in DetailLayout:', error)

		return (
			<div className="ListingDetailPage">
				<div className="ListingDetailPage__content">
					<div className="error-message">
						<h2>Something went wrong</h2>
						<p>Please try again later.</p>
					</div>
				</div>
			</div>
		)
	}
}

export default DetailPage
