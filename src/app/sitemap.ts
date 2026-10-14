// /sitemap.xml — generated from the database (tours in every language + blog).
import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { db, T, fetchAll, asDate } from '@/lib/db'
import { blogLanguages, shownBlogRows } from '@/lib/blog'

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
				.filter((s) => s.slug)
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

	// Blog posts (test posts and copies left out) in the languages they are translated into
	for (const post of await shownBlogRows()) {
		const languages = Object.fromEntries(
			Object.entries(blogLanguages(post)).map(([l, path]) => [l, `${SITE_URL}${path}`]),
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
