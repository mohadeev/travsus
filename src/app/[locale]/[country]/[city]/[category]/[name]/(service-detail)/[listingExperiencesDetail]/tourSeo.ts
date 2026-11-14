// SEO helpers for the tour detail page: URLs, text cleanup and JSON-LD.
import { routing } from '@/i18n/routing'
import { stripLinks } from '@/components/text/LinkedText'
import { SITE_URL } from '@/lib/seo'
import { repairTourSlugs } from '@/lib/tourPath'

export { SITE_URL }
const BRAND = 'TRAVSUS'
const DEFAULT_LOCALE = routing.defaultLocale

type Slug = { language: string; slug: string }

function slugsOf(tour: any): Slug[] {
	return repairTourSlugs(tour.slugs, tour.days, tour.startAddress)
}

/** Absolute URL of the tour in `locale` (falls back to the default-language slug). */
export function tourUrl(tour: any, locale: string): string {
	const slugs = slugsOf(tour)
	const slug =
		slugs.find((s) => s.language === locale)?.slug ??
		slugs.find((s) => s.language === DEFAULT_LOCALE)?.slug ??
		slugs[0]?.slug
	return slug ? `${SITE_URL}${slug}` : `${SITE_URL}/${locale}`
}

/** hreflang map: every language the tour has a slug for, plus x-default. */
export function tourAlternates(tour: any): Record<string, string> {
	const languages: Record<string, string> = {}
	for (const { language, slug } of slugsOf(tour)) {
		if (language && slug && !slug.includes('//')) languages[language] = `${SITE_URL}${slug}`
	}
	languages['x-default'] = tourUrl(tour, DEFAULT_LOCALE)
	return languages
}

/** Plain text: no HTML, single spaces, cut at a word boundary. */
export function plainText(value: unknown, maxLength?: number): string {
	const text = stripLinks(String(value ?? ''))
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
	if (!maxLength || text.length <= maxLength) return text
	const cut = text.slice(0, maxLength - 1)
	return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), maxLength * 0.6))}…`
}

/** Google shows about 60 characters of a title; longer ones get cut. */
const TITLE_MAX = 60

/**
 * Page title: the tour's SEO title if it has one, otherwise its name.
 * "| TRAVSUS" is added only when it still fits in 60 characters.
 */
/**
 * The SEO title / description written for the page's language: the
 * translation's own, else (English pages only) the tour's. On other languages
 * the English SEO text would replace the translated name and summary.
 */
function seoText(tour: any, key: 'seoTitle' | 'metaDescription'): string {
	const language = tour.language || DEFAULT_LOCALE
	const own = (tour.translations ?? []).find((t: any) => t?.language === language)?.[key]
	return own || (language === DEFAULT_LOCALE ? tour[key] || '' : '')
}

export function tourTitle(tour: any, suffix?: string): string {
	const base = plainText(seoText(tour, 'seoTitle') || tour.name)
	// "… | Private Tour" (in the page's language) tells searchers what they get;
	// else the brand; else the name alone, so the title is never cut by Google
	for (const end of [suffix, BRAND]) {
		if (end && `${base} | ${end}`.length <= TITLE_MAX) return `${base} | ${end}`
	}
	return base
}

const DESCRIPTION_MAX = 155

const wordsOf = (value: string) =>
	value
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, ' ')
		.trim()
		.split(/\s+/)
		.filter(Boolean)

/** The tour text already starts the way the generated intro does. */
function repeatsOpening(intro: string, summary: string) {
	const a = wordsOf(intro)
	const b = wordsOf(summary)
	if (a.length < 2 || b.length < 2 || a[0] !== b[0] || a[1] !== b[1]) return false
	let shared = 0
	while (shared < a.length && shared < b.length && a[shared] === b[shared]) shared++
	return shared >= 2
}

/** Whole sentences that fit, otherwise the last full word. No ellipsis. */
function fitDescription(value: string, max = DESCRIPTION_MAX) {
	const text = value.replace(/\s+/g, ' ').trim()
	if (text.length <= max) return text
	const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g) || []
	let out = ''
	for (const sentence of sentences) {
		const next = `${out}${sentence}`.trim()
		if (next.length > max) break
		out = next
	}
	if (out.length >= 40) return out
	const cut = text.lastIndexOf(' ', max)
	return (cut > 40 ? text.slice(0, cut) : text.slice(0, max)).replace(/[.,;:–—-]+$/u, '').trim()
}

/**
 * Meta description under ~155 characters. The generated intro is skipped when
 * the tour text already starts the same way, so the opening is not repeated,
 * and the text ends on a sentence or a whole word.
 */
export function tourDescription(tour: any, intro = '', outro = ''): string {
	const summary = plainText(seoText(tour, 'metaDescription') || tour.subtitle || tour.overview)
	let text = summary
	if (intro && !repeatsOpening(intro, summary)) text = `${intro} ${summary}`.trim()
	else if (intro && !summary) text = intro
	const price = intro.includes(',') ? intro.slice(intro.lastIndexOf(',') + 1).trim() : ''
	if (price && /\d/.test(price) && text && !text.includes(price.replace(/\.$/, ''))) {
		const withPrice = `${text.replace(/[.]\s*$/, '')}. ${price.charAt(0).toUpperCase()}${price.slice(1)}`
		if (withPrice.length <= DESCRIPTION_MAX) text = withPrice
	}
	if (outro && text && !text.includes(outro) && `${text} ${outro}`.length <= DESCRIPTION_MAX) text = `${text} ${outro}`
	return fitDescription(text || intro)
}

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
		fromPrice,
	}: { fromPrice?: number | null },
) {
	const url = tourUrl(tour, locale)
	const images = richImages(tour)
	const description = plainText(tour.overview)
	const days: any[] = tour.days ?? []
	const reviews: any[] = (tour.formattedReviews ?? []).filter(
		(review: any) => Number(review?.rating) > 0 && (review.tourId == null || review.tourId === tour.id),
	)
	const organization = { '@id': `${SITE_URL}/#organization` }

	// The same per-person "from" price the page shows, in euros (not the
	// cheapest group size, which is a different amount).
	const shown = fromPrice && fromPrice > 0 ? Math.ceil(fromPrice) : 0
	const offer = shown
		? {
				'@type': 'AggregateOffer',
				url,
				lowPrice: String(shown),
				highPrice: String(shown),
				priceCurrency: 'EUR',
				availability: 'https://schema.org/InStock',
				seller: organization,
			}
		: undefined

	const rating =
		reviews.length > 0 && tour.reviewsCount > 0 && tour.averageRating
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
				review: reviews.slice(0, 5).map((r: any) => ({
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
