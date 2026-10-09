// Copies MongoDB data into Supabase (insert or update by id). Safe to re-run.
// Run it one last time right before switching production to Supabase.
//
//   node scripts/db/sync-from-mongo.mjs            # everything
//   node scripts/db/sync-from-mongo.mjs --only=main # just the main database
//   node scripts/db/sync-from-mongo.mjs --only=geo  # just countries/cities/places
//   node scripts/db/sync-from-mongo.mjs --dry-run   # read + count only, no writes
//
// Needs in .env.local: DATABASE_URL, DATABASE_URL_PLACES (MongoDB),
// NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY.
import { config } from 'dotenv'
import { MongoClient, ObjectId } from 'mongodb'
import { createClient } from '@supabase/supabase-js'

config({ path: '.env.local' })
config()

const args = process.argv.slice(2)
const DRY_RUN = args.includes('--dry-run')
const ONLY = args.find((a) => a.startsWith('--only='))?.split('=')[1]
const BATCH = 500

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.SUPABASE_SECRET_KEY,
	{ auth: { persistSession: false } },
)

// Mongo collection -> Supabase table, in foreign-key order (parents first).
// `later` columns are filled in a second pass (self-references).
const MAIN = [
	{ from: 'Address', to: 'Address' },
	{ from: 'users', to: 'users', later: ['referredById'] },
	{ from: 'businesses', to: 'businesses' },
	{ from: 'translatable_contents', to: 'translatable_contents' },
	{ from: 'translated_texts', to: 'translated_texts' },
	{ from: 'tours', to: 'tours' },
	{ from: 'payment_methods', to: 'payment_methods' },
	{ from: 'bookings', to: 'bookings' },
	{ from: 'reviews', to: 'reviews' },
	{ from: 'subscriptions', to: 'subscriptions' },
	{ from: 'ReferralLink', to: 'referral_links' },
	{ from: 'payout_methods', to: 'payout_methods' },
	{ from: 'newsletter', to: 'newsletter' },
	{ from: 'places', to: 'places' },
	{ from: 'Counter', to: 'Counter' },
	{ from: 'Post', to: 'Post' },
	{ from: 'TravelSpot', to: 'TravelSpot' },
	{ from: 'WhistleblowerReport', to: 'WhistleblowerReport' },
	{ from: 'Spin', to: 'Spin' },
	{ from: 'Winner', to: 'Winner' },
	{ from: 'ForumPost', to: 'ForumPost' },
	{ from: 'ForumComment', to: 'ForumComment', later: ['parentId'] },
]

const GEO = [
	{ from: 'TranslatableContent', to: 'geo_translatable_contents' },
	{ from: 'TranslatedText', to: 'geo_translated_texts' },
	{ from: 'Continent', to: 'geo_continents' },
	{ from: 'Country', to: 'geo_countries' },
	{ from: 'State', to: 'geo_states' },
	{ from: 'City', to: 'geo_cities' },
	{ from: 'Place', to: 'geo_places' },
]

/** ObjectId -> hex string, Date -> ISO string, recursively. */
function plain(value) {
	if (value instanceof ObjectId) return value.toHexString()
	if (value instanceof Date) return value.toISOString()
	if (Array.isArray(value)) return value.map(plain)
	if (value && typeof value === 'object') {
		return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, plain(v)]))
	}
	return value
}

/** Column names + types of every table, from the Supabase API description. */
async function loadColumns() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
		headers: {
			apikey: process.env.SUPABASE_SECRET_KEY,
			Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
		},
	})
	const { definitions } = await res.json()
	return definitions
}

/** Mongo document -> Supabase row with only the table's columns. */
function toRow(doc, definition, skip = []) {
	const { _id, ...rest } = plain(doc)
	const source = { id: _id, ...rest }
	const row = {}
	for (const [column, info] of Object.entries(definition.properties)) {
		if (skip.includes(column)) continue
		let value = source[column]
		// Lists that Prisma/Mongo left out default to empty
		if (value === undefined && (info.type === 'array' || info.format === 'jsonb')) {
			if (definition.required?.includes(column)) value = []
		}
		if (value !== undefined) row[column] = value
	}
	return row
}

async function upsertAll(table, rows) {
	for (let i = 0; i < rows.length; i += BATCH) {
		const { error } = await supabase
			.from(table)
			.upsert(rows.slice(i, i + BATCH), { onConflict: 'id', defaultToNull: false })
		if (error) throw new Error(`${table}: ${error.message}`)
	}
}

async function syncDatabase(label, url, mappings, definitions) {
	const client = new MongoClient(url)
	await client.connect()
	const mongo = client.db()
	console.log(`\n== ${label} (${mongo.databaseName})`)
	try {
		for (const { from, to, later = [] } of mappings) {
			const definition = definitions[to]
			if (!definition) {
				console.log(`  ! ${to}: table not found in Supabase, skipped`)
				continue
			}
			const docs = await mongo.collection(from).find().toArray()
			const rows = docs.map((d) => toRow(d, definition, later))
			console.log(`  ${from} -> ${to}: ${rows.length} rows`)
			if (DRY_RUN || !rows.length) continue

			await upsertAll(to, rows)

			// Second pass for self-referencing columns
			if (later.length) {
				const updates = docs
					.map((d) => toRow(d, { properties: Object.fromEntries(['id', ...later].map((c) => [c, {}])) }))
					.filter((r) => later.some((c) => r[c] != null))
				for (const { id, ...values } of updates) {
					const { error } = await supabase.from(to).update(values).eq('id', id)
					if (error) throw new Error(`${to} (${later}): ${error.message}`)
				}
			}
		}
	} finally {
		await client.close()
	}
}

const definitions = await loadColumns()
if (ONLY !== 'geo') await syncDatabase('main', process.env.DATABASE_URL, MAIN, definitions)
if (ONLY !== 'main') await syncDatabase('geo', process.env.DATABASE_URL_PLACES, GEO, definitions)
console.log(DRY_RUN ? '\nDry run finished (nothing written).' : '\nSync finished.')
