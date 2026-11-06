// Loads every page in the live sitemap once, so the first visitor or search
// engine crawler after a deploy doesn't wait for a page to be rendered.
// Run it after `npm run deploy:container` (npm run deploy:container:warm does both).
//
//   node scripts/warm-cache.mjs                       # https://www.travsus.com, 3 at a time
//   node scripts/warm-cache.mjs --site=https://travsus-container.example.workers.dev
//   node scripts/warm-cache.mjs --only=tours --concurrency=2
//
// Each page is rendered once by the container (its own page cache, used by
// every data centre) and kept in the edge cache of the Cloudflare data centre
// nearest to where the script runs (the edge cache is per data centre; the
// others fill on their first visit, which no longer has to render the page).
// While the container is starting it answers 503: the script waits and tries
// again.

const args = Object.fromEntries(
	process.argv.slice(2).map((arg) => {
		const [name, ...value] = arg.replace(/^--/, '').split('=')
		return [name, value.join('=') || 'true']
	}),
)

const SITE = (args.site || process.env.NEXT_PUBLIC_SITE_URL || 'https://www.travsus.com').replace(/\/$/, '')
const CONCURRENCY = Math.max(1, Number(args.concurrency) || 3)
const ONLY = args.only // "tours" | "destinations" | "blog" | undefined (everything)
const RETRIES = 12 // ~1 minute of 503s per page while the container starts
const TIMEOUT_MS = 60_000

const TOUR_PATH = /^\/[a-z]{2}-[A-Z]{2}(\/[^/]+){4}\/[0-9a-f]{24}$/

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function wanted(pathname) {
	if (!ONLY) return true
	if (ONLY === 'tours') return TOUR_PATH.test(pathname)
	return pathname.split('/')[2] === ONLY
}

async function sitemapUrls() {
	const res = await fetch(`${SITE}/sitemap.xml`, { signal: AbortSignal.timeout(TIMEOUT_MS) })
	if (!res.ok) throw new Error(`sitemap.xml answered ${res.status}`)
	const xml = await res.text()
	const urls = new Set()
	for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
		const url = new URL(loc.trim().replace(/&amp;/g, '&'))
		if (!wanted(url.pathname)) continue
		urls.add(`${SITE}${url.pathname}${url.search}`) // same pages, on the site being warmed
	}
	return [...urls]
}

async function warm(url) {
	for (let attempt = 0; ; attempt++) {
		const started = Date.now()
		try {
			const res = await fetch(url, {
				headers: { accept: 'text/html', 'user-agent': 'TravsusCacheWarmer/1.0' },
				redirect: 'manual',
				signal: AbortSignal.timeout(TIMEOUT_MS),
			})
			await res.arrayBuffer()
			if ((res.status === 503 || res.status === 429) && attempt < RETRIES) {
				await sleep((Number(res.headers.get('retry-after')) || 5) * 1000)
				continue
			}
			return { status: res.status, edge: res.headers.get('x-edge-cache') ?? '-', ms: Date.now() - started }
		} catch (error) {
			if (attempt < 2) {
				await sleep(2000)
				continue
			}
			return { status: 'error', edge: '-', ms: Date.now() - started, error: error.message }
		}
	}
}

const urls = await sitemapUrls()
console.log(`Warming ${urls.length} pages on ${SITE} (${CONCURRENCY} at a time)${ONLY ? `, only ${ONLY}` : ''}`)

const counts = {}
const failed = []
let done = 0
let next = 0

async function worker() {
	while (next < urls.length) {
		const url = urls[next++]
		const result = await warm(url)
		const label = result.status === 200 ? `200 ${result.edge}` : String(result.status)
		counts[label] = (counts[label] ?? 0) + 1
		if (result.status !== 200) failed.push(`${result.status} ${url}${result.error ? ` (${result.error})` : ''}`)
		done++
		if (done % 25 === 0 || done === urls.length) console.log(`  ${done}/${urls.length}`)
	}
}

await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, worker))

console.log('\nResults (status and x-edge-cache):')
for (const [label, count] of Object.entries(counts).sort()) console.log(`  ${label}: ${count}`)
if (failed.length) {
	console.log(`\nNot 200 (${failed.length}):`)
	for (const line of failed.slice(0, 50)) console.log(`  ${line}`)
	if (failed.length > 50) console.log(`  … and ${failed.length - 50} more`)
}
