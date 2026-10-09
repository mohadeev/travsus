// Run a .sql file (or inline SQL) against the Supabase Postgres database.
// Usage:
//   node scripts/db/run-sql.mjs scripts/db/sql/001_security.sql
//   node scripts/db/run-sql.mjs -e "select now()"
import { readFileSync } from 'node:fs'
import { config } from 'dotenv'
import pg from 'pg'

config({ path: '.env.local' })
config()

const connectionString = process.env.DIRECT_URL || process.env.SUPABASE_URL
if (!connectionString?.startsWith('postgres')) {
	console.error('DIRECT_URL (postgres connection string) is missing in .env.local')
	process.exit(1)
}

const [flag, value] = process.argv.slice(2)
const sql = flag === '-e' ? value : readFileSync(flag, 'utf8')

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } })
await client.connect()
try {
	const res = await client.query(sql)
	for (const r of [res].flat()) {
		if (r.rows?.length) console.table(r.rows)
		else if (r.command) console.log(r.command, r.rowCount ?? '')
	}
} finally {
	await client.end()
}
