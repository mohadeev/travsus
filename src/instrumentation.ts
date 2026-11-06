// Runs once when the Next.js server starts (before it takes requests).
// Starts loading the tours' JSON copy (src/lib/tourStore.ts) in the background,
// so the first visit to a tour page doesn't wait for it. Not awaited: the
// server is ready at once, and requests wait for the copy only if they need
// it before it has loaded.
export async function register() {
	if (process.env.NEXT_RUNTIME !== 'nodejs' || process.env.CLOUDFLARE_BUILD) return
	const { startTourJsonStore } = await import('./lib/db')
	startTourJsonStore()
}
