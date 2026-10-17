// Home page. Search engines get: a title and description written for what
// people search for, one canonical address per language with links to the
// other 9 (hreflang), and structured data built from real data only.
import type { Metadata } from 'next'
import HomePage from './(home)/HomePage'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getHomeData, type HomeTour } from '@/lib/homeData'
import { routing } from '@/i18n/routing'
import { PHOTOS } from '@/lib/photos'

const SITE = 'https://www.travsus.com'
const LOGO = `${SITE}/images/logo/dark/travsus_text_dark_bg_transparent.png`
// Open Graph wants "fr_FR", not "fr-FR"
const ogLocale = (l: string) => l.replace('-', '_')

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
	const t = await getTranslations({ locale, namespace: 'HomeSeo' })
	const url = `${SITE}/${locale}`
	return {
		metadataBase: new URL(SITE),
		title: { absolute: t('title') },
		description: t('description'),
		alternates: {
			canonical: url,
			languages: {
				...Object.fromEntries(routing.locales.map((l) => [l, `${SITE}/${l}`])),
				'x-default': `${SITE}/${routing.defaultLocale}`,
			},
		},
		robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
		openGraph: {
			type: 'website',
			url,
			siteName: 'TRAVSUS',
			title: t('title'),
			description: t('description'),
			locale: ogLocale(locale),
			alternateLocale: routing.locales.filter((l) => l !== locale).map(ogLocale),
			images: [{ url: PHOTOS.hero, width: 1200, height: 630, alt: t('og_alt') }],
		},
		twitter: { card: 'summary_large_image', title: t('title'), description: t('description'), images: [PHOTOS.hero] },
	}
}

/** Company details from the same settings as the legal notice */
function company() {
	try {
		return JSON.parse(process.env.NEXT_PUBLIC_COMPANY_PROFILE || '{}')
	} catch {
		return {}
	}
}

/** One JSON-LD graph: the company, the website (with its search), this page and the top tours */
function structuredData(locale: string, description: string, tours: HomeTour[]) {
	const c = company()
	const url = `${SITE}/${locale}`
	const org = `${SITE}/#organization`
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'TravelAgency',
				'@id': org,
				name: 'TRAVSUS',
				legalName: c.fullLegalName || 'TRAVSUS LIMITED',
				url: SITE,
				logo: { '@type': 'ImageObject', url: LOGO },
				image: PHOTOS.hero,
				description,
				email: c.contactEmail || 'contact@travsus.com',
				...(c.contactPhone ? { telephone: c.contactPhone } : {}),
				...(c.legalAddress ? { address: { '@type': 'PostalAddress', streetAddress: c.legalAddress, addressCountry: 'IE' } } : {}),
				areaServed: { '@type': 'Country', name: 'Morocco' },
				knowsLanguage: [...routing.locales],
				sameAs: ['https://www.instagram.com/travsusofficial'],
			},
			{
				'@type': 'WebSite',
				'@id': `${SITE}/#website`,
				url: SITE,
				name: 'TRAVSUS',
				publisher: { '@id': org },
				inLanguage: [...routing.locales],
				potentialAction: {
					'@type': 'SearchAction',
					target: { '@type': 'EntryPoint', urlTemplate: `${url}/search?query={search_term_string}` },
					'query-input': 'required name=search_term_string',
				},
			},
			{
				'@type': 'WebPage',
				'@id': `${url}#webpage`,
				url,
				name: description,
				isPartOf: { '@id': `${SITE}/#website` },
				about: { '@id': org },
				inLanguage: locale,
				primaryImageOfPage: { '@type': 'ImageObject', url: PHOTOS.hero },
				mainEntity: { '@id': `${url}#tours` },
			},
			{
				'@type': 'ItemList',
				'@id': `${url}#tours`,
				itemListElement: tours.slice(0, 12).map((tour, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					item: {
						'@type': 'TouristTrip',
						name: tour.name,
						url: `${SITE}${tour.href}`,
						image: tour.image,
						provider: { '@id': org },
						...(tour.days ? { itinerary: { '@type': 'ItemList', numberOfItems: tour.days } } : {}),
						...(tour.pricePerPerson ? { offers: { '@type': 'Offer', price: tour.pricePerPerson, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: `${SITE}${tour.href}` } } : {}),
						// Real reviews only, and only where there are some
						...(tour.reviewsCount && tour.rating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: tour.rating, reviewCount: tour.reviewsCount, bestRating: 5 } } : {}),
					},
				})),
			},
		],
	}
}

// Built once, refreshed every 10 minutes: instant for visitors and crawlers
export const revalidate = 600

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
	setRequestLocale(locale)
	const [data, t] = await Promise.all([getHomeData(locale), getTranslations({ locale, namespace: 'HomeSeo' })])
	const jsonLd = structuredData(locale, t('description'), data.tours)
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
			<HomePage {...data} />
		</>
	)
}
