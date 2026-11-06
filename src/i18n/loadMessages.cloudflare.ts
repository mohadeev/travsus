// Cloudflare Workers version of loadMessages.ts (swapped in by vite.config.ts).
// Reads public/messages/<locale>.json through the static-assets binding,
// a local read inside Cloudflare, not a request over the internet.
import { env } from 'cloudflare:workers'

const cache = new Map<string, Promise<Record<string, any>>>()

async function fetchMessages(locale: string): Promise<Record<string, any>> {
	const res = await (env as { ASSETS: Fetcher }).ASSETS.fetch(
		new URL(`/messages/${encodeURIComponent(locale)}.json`, 'https://assets.local'),
	)
	if (!res.ok) throw new Error(`Missing texts for ${locale} (${res.status})`)
	return res.json()
}

export function loadMessages(locale: string): Promise<Record<string, any>> {
	let hit = cache.get(locale)
	if (!hit) {
		hit = fetchMessages(locale)
		// A failed read is retried on the next request instead of being cached
		hit.catch(() => cache.delete(locale))
		cache.set(locale, hit)
	}
	return hit
}
