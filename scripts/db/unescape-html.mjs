// Repairs text that was HTML-escaped once during the move to MongoDB:
// "&lt;p&gt;Ait Ben Haddou &amp;amp; ..." becomes "<p>Ait Ben Haddou &amp; ...".
// Blog posts showed their HTML tags as text, tour names showed "&amp;".
// Every string field (also inside arrays and objects) is decoded one level.
//
//   node scripts/db/unescape-html.mjs           # dry run: counts and samples
//   node scripts/db/unescape-html.mjs --apply   # backs up the changed documents, then saves
import fs from 'node:fs'
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local', quiet: true })
config({ quiet: true })

const APPLY = process.argv.includes('--apply')
// Not 'places': raw TripAdvisor data, escaped at the source
const COLLECTIONS = ['Post', 'tours', 'translated_texts', 'geo_places']
const ESCAPED = /&(lt|gt|quot|amp|#39|#x27);/

// &amp; last, so "&amp;lt;" becomes "&lt;" and not "<"
const decode = (s) =>
	s
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&#x27;/g, "'")
		.replace(/&amp;/g, '&')

/** Decoded copy of a value, and whether anything changed */
function repair(value) {
	if (typeof value === 'string') return ESCAPED.test(value) ? decode(value) : value
	if (Array.isArray(value)) return value.map(repair)
	if (value && typeof value === 'object' && value.constructor === Object) {
		return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, repair(v)]))
	}
	return value
}

const client = new MongoClient(process.env.DATABASE_URL)
await client.connect()
const db = client.db(process.env.MONGODB_DB || 'travsus')
const date = new Date().toISOString().slice(0, 10)

try {
	for (const name of COLLECTIONS) {
		const collection = db.collection(name)
		const changed = []
		for (const doc of await collection.find({}).toArray()) {
			const { _id, ...fields } = doc
			const fixed = repair(fields)
			const keys = Object.keys(fields).filter((k) => JSON.stringify(fields[k]) !== JSON.stringify(fixed[k]))
			if (keys.length) changed.push({ doc, set: Object.fromEntries(keys.map((k) => [k, fixed[k]])) })
		}

		console.log(`\n${name}: ${changed.length} documents to repair`)
		for (const { doc, set } of changed.slice(0, 2)) {
			const [key, value] = Object.entries(set)[0]
			const before = JSON.stringify(doc[key]).slice(0, 110)
			const after = JSON.stringify(value).slice(0, 110)
			console.log(`  ${doc._id} ${key}\n    before ${before}\n    after  ${after}`)
		}

		if (APPLY && changed.length) {
			const file = `scripts/db/backups/unescape-${date}-${name}.json`
			fs.writeFileSync(file, JSON.stringify(changed.map((c) => c.doc), null, 1))
			const result = await collection.bulkWrite(changed.map(({ doc, set }) => ({ updateOne: { filter: { _id: doc._id }, update: { $set: set } } })))
			console.log(`  saved ${result.modifiedCount} (backup: ${file})`)
		}
	}
	if (!APPLY) console.log('\nDry run: nothing changed. Run with --apply to repair.')
} finally {
	await client.close()
}
