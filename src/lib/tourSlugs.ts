// The addresses of one tour, for the redirect to its canonical address in the
// middleware. Read straight from the database and cached (KV on Cloudflare)
// for a day; saving a tour clears it. The middleware used to fetch the site's
// own /api/tours/{id}/slug for this: on Cloudflare a Worker calling its own
// address is slow or fails, and that cost every tour visit, even cached ones.
import { unstable_cache } from 'next/cache'
import { db, T } from '@/lib/db'

const TOURS_TAG = 'tours' // same tag as src/lib/tourCatalog.ts

export const getTourSlugs = unstable_cache(
	async (tourId: string): Promise<{ language: string; slug: string }[]> => {
		const { data, error } = await db.from(T.tours).select('slugs').eq('id', tourId).maybeSingle()
		if (error) throw new Error(error.message) // not cached: tried again next visit
		return Array.isArray(data?.slugs) ? data.slugs : []
	},
	['tour-slugs-v1'],
	{ revalidate: 86400, tags: [TOURS_TAG] },
)
