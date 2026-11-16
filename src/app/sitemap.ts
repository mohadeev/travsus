// /sitemap.xml — generated from the database: main pages, tours, destinations
// (countries and cities with a photo) and blog, each with its other languages.
import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { db, T, fetchAll, asDate } from '@/lib/db'
import { blogSitemapEntries } from '@/lib/blog'
import { getCitiesOf, getCountries } from '@/lib/destinations'
import { SITE_URL } from '@/lib/seo'
import { repairTourSlugs } from '@/lib/tourPath'

// Render on request, not at build time (the full DB query can exceed Next's
// 60s build limit). Cached at the CDN for an hour via next.config.js headers().
export const dynamic = 'force-dynamic'

// Public pages that exist in every language
const STATIC_PAGES = [
	'',
	'/search',
	'/blog',
	'/about',
	'/contact',
	'/affiliates',
	'/agencies',
	'/destinations',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const entries: MetadataRoute.Sitemap = []
	const { locales, defaultLocale } = routing

	for (const page of STATIC_PAGES) {
		const languages = Object.fromEntries(
			locales.map((l) => [l, `${SITE_URL}/${l}${page}`]),
		)
		entries.push({
			url: `${SITE_URL}/${defaultLocale}${page}`,
			changeFrequency: page === '' ? 'daily' : 'weekly',
			priority: page === '' ? 1 : 0.6,
			alternates: { languages },
		})
	}

	// Tours: one entry per language slug, each listing all its translations
	const tours = await fetchAll(() =>
		db.from(T.tours).select('id, slugs, days, updatedAt').order('id'),
	)
	for (const tour of tours) {
		const slugs = repairTourSlugs(tour.slugs, tour.days, null)
		const languages = Object.fromEntries(
			slugs
				// A tour we still can't place has no country/city in its link ("///") and 404s
				.filter((s) => s.slug && !s.slug.includes('//'))
				.map((s) => [s.language, `${SITE_URL}${s.slug}`]),
		)
		for (const url of Object.values(languages)) {
			entries.push({
				url,
				lastModified: asDate(tour.updatedAt) ?? undefined,
				changeFrequency: 'weekly',
				priority: 0.9,
				alternates: { languages },
			})
		}
	}

	// Destinations: countries and cities the pages can actually open (a photo
	// alone is not enough — /destinations/spain/malaga was listed and 404'd).
	const inAllLanguages = (path: string, priority: number) => {
		const languages = Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`]))
		for (const url of Object.values(languages)) entries.push({ url, changeFrequency: 'weekly', priority, alternates: { languages } })
	}
	const countries = await getCountries('en-US')
	for (const country of countries) {
		if (!country.slug) continue
		inAllLanguages(`/destinations/${country.slug}`, 0.7)
		for (const city of await getCitiesOf(country, 'en-US', 500)) {
			const slug = city.href.split('/').pop()
			if (slug) inAllLanguages(`/destinations/${country.slug}/${slug}`, 0.7)
		}
	}

	// Blog posts (test posts and copies left out) in the languages they are translated into
	for (const post of await blogSitemapEntries()) {
		const languages = Object.fromEntries(
			Object.entries(post.languages).map(([l, path]) => [l, `${SITE_URL}${path}`]),
		)
		for (const url of Object.values(languages)) {
			entries.push({
				url,
				lastModified: asDate(post.createdAt) ?? undefined,
				changeFrequency: 'monthly',
				priority: 0.5,
				alternates: { languages },
			})
		}
	}

	return entries
}
