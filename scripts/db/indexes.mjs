// Creates the MongoDB indexes the site relies on (safe to re-run). The unique
// ones replace what Supabase enforced: one account per email, one affiliate
// per email and per link code, one invitation per token.
//
//   node scripts/db/indexes.mjs              # dry run: shows duplicates that block a unique index
//   node scripts/db/indexes.mjs --apply      # removes empty duplicate accounts (backed up), creates the indexes
//
// A duplicate account is "empty" when nothing points to it (no booking,
// review, payment method, referral link, post, analytics visit...). The copy
// that has data is kept. Duplicates that both have data are left alone and
// listed, so they can be merged by hand.
import fs from 'node:fs'
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'

config({ path: '.env.local', quiet: true })
config({ quiet: true })

const APPLY = process.argv.includes('--apply')

const INDEXES = [
	['users', { email: 1 }, { unique: true }],
	['affiliates', { email: 1 }, { unique: true }],
	['affiliates', { code: 1 }, { unique: true, partialFilterExpression: { code: { $type: 'string' } } }],
	['affiliate_invites', { token: 1 }, { unique: true }],
	['affiliate_invites', { email: 1 }],
	['bookings', { customerId: 1 }],
	['bookings', { tourId: 1 }],
	['affiliate_clicks', { affiliate_id: 1, created_at: -1 }],
	['analytics_events', { session_id: 1, created_at: 1 }],
]

// Columns that point to a user
const USER_REFS = ['customerId', 'providerId', 'userId', 'authorId', 'creatorId', 'user_id', 'referredById']

const client = new MongoClient(process.env.DATABASE_URL)
await client.connect()
const db = client.db(process.env.MONGODB_DB || 'travsus')

try {
	// 1. Duplicate accounts (same email)
	const users = db.collection('users')
	const groups = await users
		.aggregate([{ $group: { _id: { $toLower: '$email' }, n: { $sum: 1 }, ids: { $push: '$_id' } } }, { $match: { n: { $gt: 1 } } }])
		.toArray()
	const others = (await db.listCollections().toArray()).map((c) => c.name).filter((n) => n !== 'users')
	const refsOf = async (id) => {
		let total = 0
		for (const name of others) total += await db.collection(name).countDocuments({ $or: USER_REFS.map((k) => ({ [k]: id })) })
		return total
	}

	const remove = []
	console.log(`Duplicate accounts: ${groups.length}`)
	for (const g of groups) {
		const withRefs = []
		for (const id of g.ids) withRefs.push({ id, refs: await refsOf(id) })
		const used = withRefs.filter((u) => u.refs > 0)
		// Keep the used copy, or the oldest when none is used
		const keep = used.length ? used[0] : withRefs[0]
		const empty = withRefs.filter((u) => u !== keep && u.refs === 0)
		console.log(`  ${g._id}: keep ${keep.id}, remove ${empty.map((u) => u.id).join(', ') || 'none'}${used.length > 1 ? '  ! several copies have data: merge by hand' : ''}`)
		remove.push(...empty.map((u) => u.id))
	}

	if (!APPLY) {
		console.log('\nDry run: nothing changed. Run with --apply to remove the empty duplicates and create the indexes.')
	} else {
		if (remove.length) {
			const docs = await users.find({ _id: { $in: remove } }).toArray()
			const file = `scripts/db/backups/duplicate-users-${new Date().toISOString().slice(0, 10)}.json`
			fs.writeFileSync(file, JSON.stringify(docs, null, 1))
			const { deletedCount } = await users.deleteMany({ _id: { $in: remove } })
			console.log(`\nRemoved ${deletedCount} empty duplicate accounts (backup: ${file})`)
		}
		// 2. Indexes
		console.log('\nIndexes:')
		for (const [collection, keys, options = {}] of INDEXES) {
			try {
				const name = await db.collection(collection).createIndex(keys, options)
				console.log(`  ${collection.padEnd(20)} ${name}${options.unique ? ' (unique)' : ''}`)
			} catch (error) {
				console.log(`  ${collection.padEnd(20)} FAILED: ${error.message}`)
			}
		}
	}
} finally {
	await client.close()
}
