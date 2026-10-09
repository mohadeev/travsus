// SEO helpers for the tour detail page: URLs, text cleanup and JSON-LD.
import { routing } from '@/i18n/routing'

export const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL || 'https://www.travsus.com'
).replace(/\/$/, '')
const BRAND = 'TRAVSUS'
const DEFAULT_LOCALE = routing.defaultLocale

type Slug = { language: string; slug: string }

/** Absolute URL of the tour in `locale` (falls back to the default-language slug). */
export function tourUrl(tour: any, locale: string): string {
	const slugs: Slug[] = tour.slugs ?? []
	const slug =
		slugs.find((s) => s.language === locale)?.slug ??
		slugs.find((s) => s.language === DEFAULT_LOCALE)?.slug ??
		slugs[0]?.slug
	return slug ? `${SITE_URL}${slug}` : `${SITE_URL}/${locale}`
}

/** hreflang map: every language the tour has a slug for, plus x-default. */
export function tourAlternates(tour: any): Record<string, string> {
	const languages: Record<string, string> = {}
	for (const { language, slug } of (tour.slugs ?? []) as Slug[]) {
		if (language && slug) languages[language] = `${SITE_URL}${slug}`
	}
	languages['x-default'] = tourUrl(tour, DEFAULT_LOCALE)
	return languages
}

/** Plain text: no HTML, single spaces, cut at a word boundary. */
export function plainText(value: unknown, maxLength?: number): string {
	const text = String(value ?? '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
	if (!maxLength || text.length <= maxLength) return text
	const cut = text.slice(0, maxLength - 1)
	return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), maxLength * 0.6))}…`
}

/** "{tour name} | TRAVSUS" */
export const tourTitle = (tour: any) => `${plainText(tour.name)} | ${BRAND}`

/** Meta description: overview, ~155 chars. */
export const tourDescription = (tour: any) =>
	plainText(tour.subtitle || tour.overview, 155)

export const tourImages = (tour: any): string[] =>
	(tour.images ?? []).map((img: any) => img?.url).filter(Boolean)

/**
 * Images for rich results: Google asks for large photos in 1:1, 4:3 and 16:9.
 * Cloudinary crops the main photo to each shape; the other photos follow.
 */
export function richImages(tour: any): string[] {
	const [main, ...rest] = tourImages(tour)
	if (!main) return []
	const crop = (ratio: string) =>
		main.replace(
			'/image/upload/',
			`/image/upload/c_fill,g_auto,w_1200,ar_${ratio},q_auto,f_jpg/`,
		)
	const shapes = main.includes('res.cloudinary.com/')
		? [crop('1:1'), crop('4:3'), crop('16:9')]
		: [main]
	return [...shapes, ...rest]
}

/**
 * One JSON-LD graph for the page: the trip, a product (price + real reviews),
 * the breadcrumb and the FAQ. Only real data — nothing invented.
 */
export function tourJsonLd(
	tour: any,
	locale: string,
	{
		prices,
		currency,
	}: { prices?: { low: number; high: number }; currency: string },
) {
	const url = tourUrl(tour, locale)
	const images = richImages(tour)
	const description = plainText(tour.overview)
	const days: any[] = tour.days ?? []
	const reviews: any[] = tour.formattedReviews ?? []
	const organization = { '@id': `${SITE_URL}/#organization` }

	// Real per-person prices: "from" the cheapest group size up to the dearest
	const offer = prices
		? {
				'@type': 'AggregateOffer',
				url,
				lowPrice: prices.low.toFixed(2),
				highPrice: prices.high.toFixed(2),
				priceCurrency: currency,
				availability: 'https://schema.org/InStock',
				seller: organization,
			}
		: undefined

	const rating =
		tour.reviewsCount > 0 && tour.averageRating
			? {
					'@type': 'AggregateRating',
					ratingValue: tour.averageRating,
					reviewCount: tour.reviewsCount,
					bestRating: 5,
					worstRating: 1,
				}
			: undefined

	const graph: any[] = [
		{
			'@type': 'Organization',
			'@id': `${SITE_URL}/#organization`,
			name: BRAND,
			url: SITE_URL,
			logo: `${SITE_URL}/logo.png`,
		},
		{
			'@type': 'TouristTrip',
			'@id': `${url}#trip`,
			name: plainText(tour.name),
			description,
			url,
			image: images,
			inLanguage: locale,
			provider: organization,
			touristType: tour.tourfor || undefined,
			...(days.length && { duration: `P${days.length}D` }),
			itinerary: days.length
				? {
						'@type': 'ItemList',
						numberOfItems: days.length,
						itemListElement: days.map((day, index) => ({
							'@type': 'ListItem',
							position: index + 1,
							item: {
								'@type': 'TouristAttraction',
								name: plainText(day.name),
								description: plainText(day.description, 300) || undefined,
								...(day.city && {
									address: {
										'@type': 'PostalAddress',
										addressLocality: day.city,
										addressCountry: day.country || undefined,
									},
								}),
							},
						})),
					}
				: undefined,
			...(offer && { offers: offer }),
		},
		{
			'@type': 'Product',
			'@id': `${url}#product`,
			name: plainText(tour.name),
			description,
			image: images,
			url,
			brand: { '@type': 'Brand', name: BRAND },
			category: 'Tours',
			...(offer && { offers: offer }),
			...(rating && { aggregateRating: rating }),
			...(reviews.length && {
				review: reviews.slice(0, 5).map((r) => ({
					'@type': 'Review',
					reviewRating: {
						'@type': 'Rating',
						ratingValue: r.rating,
						bestRating: 5,
					},
					author: {
						'@type': 'Person',
						name: r.user?.accountData?.firstname || 'Traveler',
					},
					...(r.createdAt && {
						datePublished: String(r.createdAt).slice(0, 10),
					}),
					reviewBody: plainText(r.content) || undefined,
					name: plainText(r.title) || undefined,
				})),
			}),
		},
		{
			'@type': 'BreadcrumbList',
			// Every crumb needs a URL; country/city get theirs once those pages exist
			itemListElement: [
				{ name: BRAND, item: `${SITE_URL}/${locale}` },
				{ name: plainText(tour.name), item: url },
			].map((crumb, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				...crumb,
			})),
		},
	]

	if (tour.faq?.length) {
		graph.push({
			'@type': 'FAQPage',
			'@id': `${url}#faq`,
			mainEntity: tour.faq.map((faq: any) => ({
				'@type': 'Question',
				name: plainText(faq.question),
				acceptedAnswer: { '@type': 'Answer', text: plainText(faq.answer) },
			})),
		})
	}

	return { '@context': 'https://schema.org', '@graph': graph }
}
