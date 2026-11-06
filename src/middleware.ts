import { clerkMiddleware } from '@clerk/nextjs/server'

import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const TOUR_ID = /^[0-9a-f]{24}$/

type TourSlug = { language: string; slug: string }

/** Lookups kept in memory: a day when found, 5 minutes when not. */
const SLUGS_FOUND_MS = 24 * 60 * 60 * 1000
const SLUGS_MISSING_MS = 5 * 60 * 1000
const SLUGS_MAX_ENTRIES = 5000
const slugCache = new Map<string, { slugs: TourSlug[]; until: number }>()

/**
 * The tour's addresses. Empty when they can't be known. Runs on every tour visit.
 * - Cloudflare build: a cached database lookup (src/lib/tourSlugs.ts). Fetching
 *   the site's own address from the Worker is slow or fails, and cost every
 *   tour visit.
 * - `next dev` / `next build` (the container): the middleware runs in the Edge
 *   runtime, where the database code can't load, so it asks the site's own
 *   API. The answer is kept in memory (the Next.js fetch cache does not work in
 *   middleware, so `next: { revalidate }` cached nothing), and in the container
 *   INTERNAL_ORIGIN (http://127.0.0.1:8080, set by src/container-worker.ts)
 *   calls the server directly: the public address went out through Cloudflare
 *   and back into the same container.
 */
async function tourSlugs(request: NextRequest, tourId: string): Promise<TourSlug[]> {
	if (process.env.CLOUDFLARE_BUILD) {
		const { getTourSlugs } = await import('./lib/tourSlugs')
		return getTourSlugs(tourId).catch(() => [])
	}
	const now = Date.now()
	const cached = slugCache.get(tourId)
	if (cached && cached.until > now) return cached.slugs

	const origin = process.env.INTERNAL_ORIGIN || request.nextUrl.origin
	const res = await fetch(new URL(`/api/tours/${tourId}/slug`, origin), { signal: AbortSignal.timeout(3000) })
	// A server error is not remembered: tried again on the next visit
	if (!res.ok && res.status !== 404) return []
	const data = await res.json().catch(() => ({}))
	const slugs: TourSlug[] = Array.isArray(data?.slugs) ? data.slugs : []

	if (slugCache.size >= SLUGS_MAX_ENTRIES) slugCache.delete(slugCache.keys().next().value as string)
	slugCache.set(tourId, { slugs, until: now + (slugs.length ? SLUGS_FOUND_MS : SLUGS_MISSING_MS) })
	return slugs
}

/** Only same-site relative paths are allowed as redirect targets. */
const isSafePath = (path: unknown): path is string =>
	typeof path === 'string' && path.startsWith('/') && !path.startsWith('//')

/**
 * Tour pages: /{locale}/{country}/{city}/{category}/{name}/{tourId}
 * (or legacy .../{tourId}/q=tour). Redirects to the tour's canonical slug
 * for the locale, falling back to its English one (then its first).
 */
async function tourRedirect(
	request: NextRequest,
	parts: string[],
	locale: string,
) {
	const last = parts[parts.length - 1]
	const isLegacy = last === 'q=tour' && parts.length === 11
	if (parts.length !== 7 && !isLegacy) return null

	const tourId = isLegacy ? parts[parts.length - 2] : last
	if (!TOUR_ID.test(tourId)) return null

	const slugs = await tourSlugs(request, tourId)
	const target = (slugs.find((s) => s.language === locale) ?? slugs.find((s) => s.language === routing.defaultLocale) ?? slugs[0])?.slug
	if (!isSafePath(target)) return null

	const current = decodeURIComponent(request.nextUrl.pathname)
	if (decodeURIComponent(target) === current) return null

	const url = request.nextUrl.clone()
	url.pathname = target
	return NextResponse.redirect(url, 301) // keeps the query string
}

/** Old blog links /{locale}/blog/{id}?name=x -> /{locale}/blog/x/{id} */
function blogRedirect(request: NextRequest, parts: string[], locale: string) {
	if (parts.length !== 3 || parts[1] !== 'blog') return null

	const url = request.nextUrl.clone()
	const name = url.searchParams.get('name') || 'post'
	url.searchParams.delete('name')
	url.pathname = `/${locale}/blog/${encodeURIComponent(name)}/${parts[2]}`
	return NextResponse.redirect(url, 301)
}

/**
 * Old city links /{locale}/destinations/{country}/{city}?lcId=<city id> are
 * looked up by ./destinations/[code]/[city]/legacy/[lcId], which redirects
 * them; the city page itself never reads the query string, so it can be cached.
 */
function legacyCityRewrite(request: NextRequest, parts: string[]) {
	const lcId = request.nextUrl.searchParams.get('lcId')
	if (!lcId || parts.length !== 4 || parts[1] !== 'destinations') return null
	const url = request.nextUrl.clone()
	url.pathname = `/${parts.join('/')}/legacy/${encodeURIComponent(lcId)}`
	url.search = ''
	return NextResponse.rewrite(url)
}

async function middleware(request: NextRequest) {
	const parts = request.nextUrl.pathname.split('/').filter(Boolean)
	const locale = parts[0] || routing.defaultLocale

	try {
		const redirect =
			(await tourRedirect(request, ['', ...parts], locale)) ??
			blogRedirect(request, parts, locale)
		if (redirect) return redirect
		const rewrite = legacyCityRewrite(request, parts)
		if (rewrite) return rewrite
	} catch (error) {
		// Never block the page because of a redirect lookup
		console.error('Middleware redirect error:', error)
	}

	const response = intlMiddleware(request)
	// next-intl sets the NEXT_LOCALE cookie on pages, and a page response that
	// sets a cookie is never cached (every first visit, and every bot, would be
	// rendered again). The browser sets the same cookie instead
	// (LocaleLayoutClient); redirects keep it.
	if (!response.headers.has('location')) response.headers.delete('set-cookie')
	return response
}
// Clerk reads the session on every request; pages also get language
// routing and redirects; files, API calls and Clerk's paths pass straight through.
const withClerk = clerkMiddleware(async (_auth, request) => {
	const { pathname } = request.nextUrl
	const isFile = /\.[a-z0-9]+$/i.test(pathname) // sitemap.xml, robots.txt, llms.txt
	if (isFile || /^\/(api|trpc|__clerk)(\/|$)/.test(pathname)) {
		return NextResponse.next()
	}
	return middleware(request)
})

/** One-segment public pages that are the same for every visitor. */
const PUBLIC_PAGES = new Set(['about', 'affiliates', 'agencies', 'blog', 'contact', 'cookie-policy', 'destinations', 'general-conditions', 'group-tours', 'legal-notice', 'privacy-policy', 'search'])

/**
 * Pages read (GET) by visitors that never use the session on the server: the
 * home page, tours, destinations and the plain content pages. They skip
 * Clerk's middleware, which reads the request headers: under vinext that marks
 * the page as dynamic, so it could never be cached and every visit was
 * rendered again (Cloudflare error 1102 on the free plan). Signing in still
 * works in the browser (ClerkProvider). Account pages, checkout, blog articles,
 * the dashboard, API routes and form posts keep Clerk.
 */
function isPublicPage(request: NextRequest) {
	if (request.method !== 'GET' && request.method !== 'HEAD') return false
	const parts = request.nextUrl.pathname.split('/').filter(Boolean)
	if (!(routing.locales as readonly string[]).includes(parts[0])) return false
	if (parts.length === 1) return true // home
	if (parts[1] === 'destinations') return true // destinations, countries, cities
	if (parts.length === 2) return PUBLIC_PAGES.has(parts[1])
	return parts.length === 6 && TOUR_ID.test(parts[5]) // /{locale}/{country}/{city}/{category}/{name}/{tourId}
}

export default function proxy(request: NextRequest, event: NextFetchEvent) {
	return isPublicPage(request) ? middleware(request) : withClerk(request, event)
}

export const config = {
	matcher: [
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		'/(api|trpc)(.*)',
		'/__clerk/:path*',
	],
}
