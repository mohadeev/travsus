import { type NextRequest, NextResponse } from 'next/server'

export default function extractLanguageFromRequest(
	request: NextRequest,
): string {
	const referer: any = request.headers.get('referer')

	const normalizeLocale = (locale: string) => {
		const [lang, region] = locale.split('-')
		if (region) {
			return `${lang.toLowerCase()}-${region.toUpperCase()}`
		}
		return lang.toLowerCase()
	}

	try {
		// First: Try to get from URL searchParams
		const { searchParams } = new URL(request.url)
		const locale = searchParams.get('locale')
		if (locale) {
			return locale
		}

		const cookieHeader = request.headers.get('cookie')
		if (cookieHeader) {
			const nextLocaleMatch = cookieHeader.match(
				/NEXT_LOCALE=([a-z]{2}-[A-Z]{2})/,
			)
			if (nextLocaleMatch) {
				return nextLocaleMatch[1]
			}
		}

		// Third: Try to extract from referer
		if (referer) {
			const match = referer.match(/\/([a-z]{2}-[a-z]{2})(?:\/|$)/i)
			if (match) return normalizeLocale(match[1])
		}

		// Try to get from URL pathname
		const url = new URL(request.url)
		const pathMatch = url.pathname.match(/^\/([a-z]{2}-[A-Z]{2})(?:\/|$)/)
		if (pathMatch) return pathMatch[1]

		// Try to get from accept-language header as fallback
		const acceptLanguage = request.headers.get('accept-language')
		if (acceptLanguage) {
			const match = acceptLanguage.match(/([a-z]{2}-[A-Z]{2})/)
			if (match) return match[1]

			// Try simpler language code format
			const simpleMatch = acceptLanguage.match(/([a-z]{2})/)
			if (simpleMatch) {
				// Convert simple language codes to full locale format
				const langMap: { [key: string]: string } = {
					en: 'en-US',
					es: 'es-ES',
					fr: 'fr-FR',
					de: 'de-DE',
					it: 'it-IT',
					pt: 'pt-PT',
					ru: 'ru-RU',
					ja: 'ja-JP',
					ko: 'ko-KR',
					zh: 'zh-CN',
				}
				return langMap[simpleMatch[1]] || 'en-US'
			}
		}

		// Default to English
		return 'en-US'
	} catch (error) {
		console.error('Error extracting language from request:', error)
		return 'en-US'
	}
}

// import { type NextRequest, NextResponse } from 'next/server'

// function extractLanguageFromRequest(request: NextRequest):  {
// 	const referer: any = request.headers.get('referer')
// 	const normalizeLocale = (locale: string) => {

// 			const { searchParams } = new URL(request.url)
// 		const id = searchParams.get('id')

// 	if (referer) {
// 		const match = referer.match(/\/([a-z]{2}-[a-z]{2})(?:\/|$)/i)
// 		if (match) return normalizeLocale(match[1])
// 	}
// }

// export default extractLanguageFromRequest
