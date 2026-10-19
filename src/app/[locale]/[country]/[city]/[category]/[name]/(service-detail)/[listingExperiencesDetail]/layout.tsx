import React, { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { updateLineItemsLogic } from '@/app/api/updateLineItems/updateLineItemsLogic'
import { getTourData } from '@/lib/tourData'
import { getHomeData } from '@/lib/homeData'
import ListingExperiencesDetailPage from './page'
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
// pages are cached and refreshed every 10 minutes — fast for users and bots.
export const revalidate = 600

// No tours pre-built at deploy: each is rendered on its first visit, then cached
export function generateStaticParams() {
	return []
}

type TourParams = { listingExperiencesDetail: string; locale: string }

interface DetailLayoutProps {
	children: ReactNode
	params: TourParams
}

// <head>: title, description, canonical, hreflang, social cards
export async function generateMetadata({
	params,
}: {
	params: TourParams
}): Promise<Metadata> {
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

const DetailLayout = async ({ params }: DetailLayoutProps) => {
	const { listingExperiencesDetail: tourId, locale } = params

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
		)
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

export default DetailLayout
