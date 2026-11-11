import { notFound } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getHomeData } from '@/lib/homeData'
import type { Metadata } from 'next'
import { getTourData } from '@/lib/tourData'
import { getTourPageExtras } from '@/lib/tourPage'
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
	// A database error is thrown (500), not shown as "not found": a cached
	// "Tour Not Found" with noindex would drop the tour from search engines
	const tour: any = await getTourData(tourId, locale).catch((error) => {
		noStore() // never cache a failed render
		throw error
	})

	if (!tour) {
		return {
			title: 'Tour Not Found | TRAVSUS',
			description: 'The requested tour could not be found.',
			robots: { index: false, follow: true },
		}
	}

	const url = tourUrl(tour, locale)
	// Searchers see what it is and the price before clicking
	const [t, home] = await Promise.all([getTranslations({ locale, namespace: 'TourPage' }), getHomeData(locale).catch(() => null)])
	const card = home?.tours.find((x) => x.id === tour.id)
	const days = Array.isArray(tour.days) ? tour.days.length : card?.days ?? 0
	const city = tour.startAddress?.city || card?.city || ''
	const price = card?.pricePerPerson
		? new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Math.ceil(card.pricePerPerson))
		: ''
	const intro = days && city ? (price ? t('seo_intro_price', { days, city, price }) : t('seo_intro', { days, city })) : ''
	const title = tourTitle(tour, t('seo_title_suffix'))
	const description = tourDescription(tour, intro, t('seo_outro'))
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

const DetailPage = async (props: DetailPageProps) => {
	const params = await props.params;
	const { listingExperiencesDetail: tourId, locale } = params
	// The page's language from the address, not the request headers, so the page can be cached
	setRequestLocale(locale)

	try {
		const tour: any = await getTourData(tourId, locale)
		if (!tour) notFound()


		// Similar tours, "from" price and price range: one small cached result per tour
		// Optional extras: without them the tour still shows (not cached then)
		// …and never wait more than 6 seconds for them
		const extras = await Promise.race([
			getTourPageExtras(tourId, locale),
			new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Tour page extras timed out')), 6000)),
		]).catch((error) => {
			console.error('Tour page extras failed:', error)
			noStore()
			return null
		})
		const similar = extras?.similar ?? []
		const fromPricePerPerson = extras?.fromPricePerPerson ?? null

		const jsonLd = tourJsonLd(tour, locale, {
			prices: extras?.prices ?? undefined,
			currency: tour.pricingTiers?.[0]?.pricing?.currency || 'EUR',
		})

		return (
			<div className="ListingDetailPage">
				<RecentTourTracker tourId={tour.id} />
				<div className="ListingDetailPage__content">
					<ListingExperiencesDetailPage serviceData={{ ...tour, fromPricePerPerson, popular: !!extras?.popular }} similar={similar as any} />
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
		// notFound() / redirect() are handled by Next.js. Any other error is
		// thrown too, so the answer is a 500 (shown by ../error.tsx): a 200
		// "Something went wrong" page used to be cached and served to visitors
		// and search engines in place of the tour. With a 500, the last good
		// copy stays in the page cache and the edge cache.
		if (!(typeof error?.digest === 'string' && error.digest.startsWith('NEXT_'))) {
			// Mark the render dynamic so neither cache keeps this failure (vinext
			// otherwise stores the errored page and serves it for an hour)
			noStore()
			console.error('Error in DetailPage:', error)
		}
		throw error
	}
}

export default DetailPage
