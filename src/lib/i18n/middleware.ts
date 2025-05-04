import { type NextRequest, NextResponse } from 'next/server'
import { parse } from 'cookie'

// Supported languages
export const languages = ['en', 'es', 'fr', 'de', 'it']
export const defaultLanguage = 'en'

// Country to language mapping (simplified)
const countryLanguageMap: Record<string, string> = {
	US: 'en',
	GB: 'en',
	ES: 'es',
	MX: 'es',
	AR: 'es',
	FR: 'fr',
	CA: 'fr', // Could be en or fr, but simplifying
	DE: 'de',
	AT: 'de',
	CH: 'de',
	IT: 'it',
	// Add more as needed
}

// Function to check if a pathname has a supported language
export function pathnameHasLanguage(pathname: string) {
	return languages.some(
		(lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`,
	)
}

// Function to get language from request
export function getLanguage(request: NextRequest) {
	// 1. First check if there's a language cookie
	const cookies = request.headers.get('cookie')
	const parsedCookies = cookies ? parse(cookies) : {}
	const languageCookie = parsedCookies.preferredLanguage

	if (languageCookie && languages.includes(languageCookie)) {
		return languageCookie
	}

	// 2. Then check geo information
	const country = request.geo?.country
	if (country && countryLanguageMap[country]) {
		return countryLanguageMap[country]
	}

	// 3. Check custom geo cookie if available
	const geoCookie = parsedCookies.customGeo
	if (geoCookie) {
		try {
			const geoData = JSON.parse(geoCookie)
			if (geoData.country && countryLanguageMap[geoData.country]) {
				return countryLanguageMap[geoData.country]
			}
		} catch (e) {
			// Invalid JSON, ignore
		}
	}

	// 4. Finally check Accept-Language header
	const acceptLanguage = request.headers.get('accept-language') || ''
	const browserLanguages = acceptLanguage
		.split(',')
		.map((lang) => lang.split(';')[0].trim().substring(0, 2).toLowerCase())

	const matchedLanguage = browserLanguages.find((lang) =>
		languages.some((supportedLang) => supportedLang.startsWith(lang)),
	)

	if (matchedLanguage) {
		const fullLanguage = languages.find((lang) =>
			lang.startsWith(matchedLanguage),
		)
		if (fullLanguage) return fullLanguage
	}

	return defaultLanguage
}

// Main language middleware function
export function languageMiddleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	// Skip API routes and other special paths
	if (
		pathname.startsWith('/api/') ||
		pathname.startsWith('/_next/') ||
		pathname.startsWith('/favicon.ico') ||
		pathname.includes('.') ||
		pathname.startsWith('/login') ||
		pathname.startsWith('/register') ||
		pathname.startsWith('/forgot-password')
	) {
		return undefined
	}

	// Check if the pathname already includes a language
	if (pathnameHasLanguage(pathname)) {
		return undefined
	}

	// Redirect to the detected language version
	const language = getLanguage(request)
	const newUrl = new URL(`/${language}${pathname}`, request.url)

	return NextResponse.redirect(newUrl)
}
