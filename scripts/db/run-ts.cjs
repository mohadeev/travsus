// Runs a TypeScript script that uses the app's code (@/ imports) with the
// local environment: node scripts/db/run-ts.cjs <file.ts> [args]
require('dotenv').config({ path: '.env.local' })
require('dotenv').config({ path: '.env' })
const path = require('node:path')
const jiti = require('jiti')(__filename, {
	alias: { '@': path.join(process.cwd(), 'src') },
	interopDefault: true,
})
jiti(path.resolve(process.argv[2]))
