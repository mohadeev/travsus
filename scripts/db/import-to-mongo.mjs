// Loads a database export ({ table: rows[] }, from /admin/migrate-db) into a
// MongoDB database: one collection per table, the row id as _id (same string,
// so links between tables keep working), timestamps as dates.
//
//   node scripts/db/import-to-mongo.mjs <file.json>                 # dry run: counts only
//   node scripts/db/import-to-mongo.mjs <file.json> --apply         # writes
//   --db=<name>   target database (default: travsus) in the DATABASE_URL cluster
//   --replace     empty collections that already have data (otherwise they are skipped)
//
// The old MongoDB database (the one in DATABASE_URL) is never touched unless
// you pass its name with --db.
import fs from 'node:fs'
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local', quiet: true })
config({ quiet: true })

const args = process.argv.slice(2)
const file = args.find((a) => !a.startsWith('--'))
const APPLY = args.includes('--apply')
const REPLACE = args.includes('--replace')
const DB = args.find((a) => a.startsWith('--db='))?.split('=')[1] || 'travsus'
const BATCH = 500

if (!file) {
	console.error('Usage: node scripts/db/import-to-mongo.mjs <file.json> [--apply] [--db=name] [--replace]')
	process.exit(1)
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/

/**
 * Top-level timestamp strings → Date; id → _id. A table without an id column
 * (affiliate_referrals: one row per booking) uses its booking_id.
 */
function toDoc(row) {
	const { id, ...rest } = row
	const key = id ?? (rest.booking_id !== undefined ? rest.booking_id : null)
	const doc = key === null ? {} : { _id: key }
	for (const [k, value] of Object.entries(rest)) doc[k] = typeof value === 'string' && ISO_DATE.test(value) ? new Date(value) : value
	return doc
}

let data = JSON.parse(fs.readFileSync(file, 'utf8'))
// A file with one table only (a list of rows): named after the file
if (Array.isArray(data)) data = { [file.split('/').pop().replace(/\.json$/i, '')]: data }

const client = new MongoClient(process.env.DATABASE_URL)
await client.connect()
const db = client.db(DB)
console.log(`${APPLY ? 'Importing' : 'Dry run'} into database "${DB}"\n`)

let total = 0
try {
	for (const [table, rows] of Object.entries(data)) {
		const docs = (rows ?? []).map(toDoc)
		const existing = await db.collection(table).estimatedDocumentCount()
		const withId = docs.filter((d) => d._id !== undefined)
		const ids = new Set(withId.map((d) => String(d._id)))
		const note = ids.size < withId.length ? ` (${withId.length - ids.size} duplicate ids!)` : ''
		if (existing && !REPLACE) {
			console.log(`  ${table.padEnd(28)} ${String(docs.length).padStart(6)}  skipped: already has ${existing} documents (use --replace)`)
			continue
		}
		console.log(`  ${table.padEnd(28)} ${String(docs.length).padStart(6)}${existing ? `  replaces ${existing}` : ''}${note}`)
		total += docs.length
		if (!APPLY) continue
		if (existing) await db.collection(table).deleteMany({})
		for (let i = 0; i < docs.length; i += BATCH) await db.collection(table).insertMany(docs.slice(i, i + BATCH), { ordered: false })
	}
	if (APPLY) {
		// Check: every collection has as many documents as the file
		for (const [table, rows] of Object.entries(data)) {
			const n = await db.collection(table).countDocuments()
			if (n !== (rows ?? []).length) console.log(`  ! ${table}: ${n} in MongoDB, ${(rows ?? []).length} in the file`)
		}
	}
} finally {
	await client.close()
}
console.log(`\n${total} documents ${APPLY ? 'imported' : 'would be imported (dry run, nothing written)'}.`)
