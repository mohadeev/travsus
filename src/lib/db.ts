// Server-side Supabase client + small helpers used by every API route / server action.
// Uses the secret key (bypasses RLS) — never import this from a client component.
import { randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

if (typeof window !== 'undefined') {
	throw new Error('src/lib/db.ts must only be imported on the server')
}

const url = process.env.SUPABASE_PROJECT_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const secretKey = process.env.SUPABASE_SECRET_KEY

if (!url || !secretKey) {
	throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY env var')
}

export const db = createClient(url, secretKey, {
	auth: { persistSession: false, autoRefreshToken: false },
})

/** Table names in Supabase — change them here if a table is renamed. */
export const T = {
	users: 'users',
	addresses: 'Address',
	businesses: 'businesses',
	bookings: 'bookings',
	tours: 'tours',
	reviews: 'reviews',
	paymentMethods: 'payment_methods',
	payoutMethods: 'payout_methods',
	subscriptions: 'subscriptions',
	referralLinks: 'referral_links',
	newsletter: 'newsletter',
	tripadvisorPlaces: 'places',
	translatableContents: 'translatable_contents',
	translatedTexts: 'translated_texts',
	counters: 'Counter',
	posts: 'Post',
	forumPosts: 'ForumPost',
	forumComments: 'ForumComment',
	reports: 'WhistleblowerReport',
	// First-party analytics (scripts/db/sql/004_analytics.sql)
	analyticsSessions: 'analytics_sessions',
	analyticsEvents: 'analytics_events',
	// Affiliate program requests (scripts/db/sql/005_affiliates.sql)
	affiliates: 'affiliates',
	// Geography (was the separate "places" MongoDB database)
	continents: 'geo_continents',
	countries: 'geo_countries',
	states: 'geo_states',
	cities: 'geo_cities',
	places: 'geo_places',
	geoContents: 'geo_translatable_contents',
	geoTexts: 'geo_translated_texts',
} as const

/**
 * Common relation selects (PostgREST embeds). `users!customerId` picks the
 * foreign key when a table points at users more than once.
 */
export const REL = {
	bookingFull: `*, customer:${T.users}!customerId(*), provider:${T.users}!providerId(*), tour:${T.tours}(*), paymentMethod:${T.paymentMethods}(*)`,
	bookingWithPeople: `*, customer:${T.users}!customerId(*), provider:${T.users}!providerId(*), tour:${T.tours}(*)`,
	tourAddresses: `startAddress:${T.addresses}!startAddressId(*), endAddress:${T.addresses}!endAddressId(*)`,
} as const

/** Required list columns on a new tour (MongoDB used to default these to []). */
export const EMPTY_TOUR_LISTS = {
	slugs: [],
	images: [],
	people: [],
	services: [],
	places: [],
	highlights: [],
	days: [],
	paths: [],
	tags: [],
	keyphrase: [],
	faq: [],
	pricingTiers: [],
	accommodations: [],
	translations: [],
}

/** 24-char hex id, same format as the old MongoDB ObjectIds. */
export const newId = () => randomBytes(12).toString('hex')

/** Adds id / createdAt / updatedAt to a row (or rows) before inserting. */
export function withMeta<R extends Record<string, any>>(row: R, timestamps = true) {
	const now = new Date().toISOString()
	return {
		id: newId(),
		...(timestamps ? { createdAt: now, updatedAt: now } : {}),
		...row,
	}
}

/** Sets updatedAt on an update payload. */
export const touch = <R extends Record<string, any>>(row: R) => ({
	...row,
	updatedAt: new Date().toISOString(),
})

/**
 * Supabase returns timestamps as strings. Converts to Date, treating values
 * without a time zone as UTC (that's how they were stored).
 */
export function asDate(value: string | Date | null | undefined): Date | null {
	if (!value) return null
	if (value instanceof Date) return value
	const hasZone = /([zZ]|[+-]\d\d:?\d\d)$/.test(value)
	return new Date(hasZone ? value : `${value}Z`)
}

/**
 * Fetches every row of a query, page by page (the API caps a single request
 * at 1000 rows). Pass a function that builds the query, e.g.
 * `fetchAll(() => db.from(T.cities).select('*').eq('countryId', id).order('id'))`.
 */
export async function fetchAll<Row = any>(
	build: () => { range: (from: number, to: number) => PromiseLike<{ data: any; error: any }> },
	pageSize = 1000,
): Promise<Row[]> {
	const rows: Row[] = []
	for (let from = 0; ; from += pageSize) {
		const page = must(await build().range(from, from + pageSize - 1)) as Row[]
		rows.push(...(page ?? []))
		if (!page || page.length < pageSize) return rows
	}
}

/** Throws on a Supabase error, otherwise returns the data. */
export function must<D>(res: { data: D; error: { message: string } | null }): D {
	if (res.error) throw new Error(res.error.message)
	return res.data
}
