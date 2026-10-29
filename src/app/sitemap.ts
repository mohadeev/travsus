// /sitemap.xml — generated from the database: main pages, tours, destinations
// (countries and cities with a photo) and blog, each with its other languages.
import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { db, T, fetchAll, asDate } from '@/lib/db'
import { blogSitemapEntries } from '@/lib/blog'
import { slugify } from '@/lib/destinations'

export const revalidate = 3600 // rebuild at most once an hour

const SITE_URL = (
	process.env.NEXT_PUBLIC_SITE_URL || 'https://www.travsus.com'
).replace(/\/$/, '')

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
		db.from(T.tours).select('id, slugs, updatedAt').order('id'),
	)
	for (const tour of tours) {
		const slugs: { language: string; slug: string }[] = tour.slugs ?? []
		const languages = Object.fromEntries(
			slugs
				// A tour without a start address has no country/city in its link ("///") and 404s
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

	// Destinations: countries and cities that have a photo (the ones with full pages)
	const enName = (row: any) => (row.translations ?? []).find((t: any) => t.language === 'en-US')?.name ?? row.translations?.[0]?.name ?? ''
	const inAllLanguages = (path: string, priority: number) => {
		const languages = Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`]))
		for (const url of Object.values(languages)) entries.push({ url, changeFrequency: 'weekly', priority, alternates: { languages } })
	}
	const countries = (await db.from(T.countries).select('id, translations').not('image', 'is', null)).data ?? []
	const countrySlug = new Map((countries as any[]).map((c) => [c.id, slugify(enName(c))]))
	for (const slug of Array.from(countrySlug.values())) if (slug) inAllLanguages(`/destinations/${slug}`, 0.7)
	const cities = (await db.from(T.cities).select('countryId, translations').not('image', 'is', null).in('countryId', Array.from(countrySlug.keys()))).data ?? []
	for (const city of cities as any[]) {
		const slug = slugify(enName(city))
		if (slug) inAllLanguages(`/destinations/${countrySlug.get(city.countryId)}/${slug}`, 0.7)
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
