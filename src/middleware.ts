import { clerkMiddleware } from '@clerk/nextjs/server'

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const TOUR_ID = /^[0-9a-f]{24}$/

/**
 * The tour's addresses, from the site's own API (the middleware runs at the
 * edge, where the database can't be reached). Empty when it can't be known.
 */
async function tourSlugs(request: NextRequest, tourId: string): Promise<{ language: string; slug: string }[]> {
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
 * for the locale, falling back to its first slug.
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
	const target = (slugs.find((s) => s.language === locale) ?? slugs[0])?.slug
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

async function middleware(request: NextRequest) {
	const parts = request.nextUrl.pathname.split('/').filter(Boolean)
	const locale = parts[0] || routing.defaultLocale

	try {
		const redirect =
			(await tourRedirect(request, ['', ...parts], locale)) ??
			blogRedirect(request, parts, locale)
		if (redirect) return redirect
	} catch (error) {
		// Never block the page because of a redirect lookup
		console.error('Middleware redirect error:', error)
	}

	return intlMiddleware(request)
}
// Clerk reads the session on every request; pages also get language
// routing and redirects; files, API calls and Clerk's paths pass straight through.
export default clerkMiddleware(async (_auth, request) => {
	const { pathname } = request.nextUrl
	const isFile = /\.[a-z0-9]+$/i.test(pathname) // sitemap.xml, robots.txt, llms.txt
	if (isFile || /^\/(api|trpc|__clerk)(\/|$)/.test(pathname)) {
		return NextResponse.next()
	}
	return middleware(request)
})

export const config = {
	matcher: [
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		'/(api|trpc)(.*)',
		'/__clerk/:path*',
	],
}
