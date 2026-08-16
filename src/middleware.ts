import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Function to convert old blog path to new blog path
function convertOldBlogPath(pathname: string, nameParam: string | null) {
	const pathnameParts = pathname.split('/').filter(Boolean)
	const blogId = pathnameParts[pathnameParts.length - 1]

	// Case: /<locale>/blog/<issh -i ~/Downloads/travsus_key.pem ubuntu@16.16.99.29d>  → needs "post" added
	if (
		pathnameParts.length >= 3 &&
		pathnameParts[pathnameParts.length - 2] === 'blog'
	) {
		const nameSegment = nameParam || 'post'
		return `/${pathnameParts.slice(0, -1).join('/')}/${nameSegment}/${blogId}`
	}

	// Case: already has a slug (no redirect needed)
	return pathname
}

export default async function middleware(request: NextRequest) {
	const url = request.nextUrl.clone()
	const pathname = url.pathname
	const locale: string = pathname.split('/')[1] || 'en-US'
	const parts = pathname.split('/')
	const last = parts[parts.length - 1]
	const serviceId =
		parts.length === 11 ? parts[parts.length - 2] : parts[parts.length - 1]

	// === Tour redirect logic ===
	if ((last === 'q=tour' && parts.length === 11) || parts.length === 7) {
		try {
			const serviceDataResponse = await fetch(
				`${process.env.NEXTAUTH_URL}/api/update-slug?serviceId=${serviceId}&locale=${locale}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				},
			)
			const serviceData: any = await serviceDataResponse.json()
			const link = serviceData.data.link
			if (link !== pathname) {
				return NextResponse.redirect(new URL(url.origin + link), 301)
			}
		} catch (error) {
			console.error('Error in tour redirect:', error)
		}
	}

	// === Blog old-link redirect logic ===
	if (pathname.startsWith(`/${locale}/blog/`)) {
		const nameParam = url.searchParams.get('name')
		const newBlogPath = convertOldBlogPath(pathname, nameParam)
		if (newBlogPath && newBlogPath !== pathname) {
			return NextResponse.redirect(new URL(url.origin + newBlogPath), 301)
		}
	}

	// Continue with i18n middleware
	return createMiddleware(routing)(request)
}

export const config = {
	matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
