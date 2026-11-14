import { clerkMiddleware } from '@clerk/nextjs/server'

import { NextResponse } from 'next/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const SITE_HOST = 'www.travsus.com'

/** 301 the apex to www, keeping the path and query string. */
function apexRedirect(request: NextRequest) {
	const raw = request.headers.get('x-forwarded-host') || request.headers.get('host') || ''
	const host = raw.split(',')[0].trim().split(':')[0].toLowerCase()
	if (host !== 'travsus.com') return null
	const url = request.nextUrl.clone()
	url.protocol = 'https:'
	url.hostname = SITE_HOST
	url.port = ''
	return NextResponse.redirect(url, 301)
}

const intlMiddleware = createMiddleware(routing)

const TOUR_ID = /^[0-9a-f]{24}$/

/**
 * The tour's addresses. Empty when they can't be known.
 * - Cloudflare build: a cached database lookup (src/lib/tourSlugs.ts). Fetching
 *   the site's own address from the Worker is slow or fails, and cost every
 *   tour visit.
 * - `next dev` / `next build`: the middleware runs in the Edge runtime, where the
 *   database code can't load, so it asks the site's own API as before.
 */
async function tourSlugs(request: NextRequest, tourId: string): Promise<{ language: string; slug: string }[]> {
	if (process.env.CLOUDFLARE_BUILD) {
		const { getTourSlugs } = await import('./lib/tourSlugs')
		return getTourSlugs(tourId).catch(() => [])
	}
	const url = new URL(`/api/tours/${tourId}/slug`, request.nextUrl.origin)
	const res = await fetch(url, { signal: AbortSignal.timeout(3000), next: { revalidate: 86400 } })
	if (!res.ok) return []
	const data = await res.json().catch(() => ({}))
	return Array.isArray(data?.slugs) ? data.slugs : []
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
	// A stored address with an empty country/city ("//") 404s. Keep a
	// well-formed address instead of redirecting back to that broken one.
	if (!isSafePath(target) || target.includes('//')) return null

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
 * Real one-segment pages. An unprefixed address of anything else
 * (/help, /merzouga-desert-camp-guide) is not sent to the homepage:
 * it is rendered as that locale path, which 404s.
 */
const UNPREFIXED_PAGES = new Set([
	'404',
	'TawkWidgetEditor',
	'about',
	'account-affiliate',
	'account-delete',
	'account-savelists',
	'account-settings',
	'add-listing',
	'admin',
	'affiliates',
	'agencies',
	'analyze',
	'author',
	'blog',
	'bookings',
	'checkout',
	'cms-admin',
	'coming-soon',
	'contact',
	'cookie-policy',
	'dashboard',
	'destinations',
	'edite-reviews',
	'edite-tours',
	'editor',
	'email',
	'forms',
	'forum',
	'general-conditions',
	'group-tours',
	'itsonthemove',
	'legal-notice',
	'list-my-business',
	'listing-car',
	'listing-car-detail',
	'listing-car-map',
	'listing-experiences',
	'listing-experiences-detail',
	'listing-experiences-map',
	'listing-real-estate',
	'listing-real-estate-map',
	'listing-stay',
	'listing-stay-detail',
	'not-tracking',
	'pay-done',
	'places',
	'plan-trip',
	'privacy-policy',
	'report',
	'rights',
	'screen-shot',
	'search',
	'service-editor',
	'sign-in',
	'sign-up',
	'testing',
	'tours',
	'trans-test',
])

function unknownUnprefixed(request: NextRequest) {
	const parts = request.nextUrl.pathname.split('/').filter(Boolean)
	if (parts.length !== 1) return null
	const segment = decodeURIComponent(parts[0])
	if ((routing.locales as readonly string[]).includes(segment)) return null
	if (UNPREFIXED_PAGES.has(segment)) return null
	const url = request.nextUrl.clone()
	url.pathname = `/${routing.defaultLocale}/${segment}`
	return NextResponse.rewrite(url)
}

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
	const apex = apexRedirect(request)
	if (apex) return apex
	const { pathname } = request.nextUrl
	const isFile = /\.[a-z0-9]+$/i.test(pathname) // sitemap.xml, robots.txt, llms.txt
	if (isFile || /^\/(api|trpc|__clerk)(\/|$)/.test(pathname)) {
		return NextResponse.next()
	}
	const missing = unknownUnprefixed(request)
	if (missing) return missing
	return isPublicPage(request) ? middleware(request) : withClerk(request, event)
}

export const config = {
	matcher: [
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		'/(api|trpc)(.*)',
		'/__clerk/:path*',
	],
}
