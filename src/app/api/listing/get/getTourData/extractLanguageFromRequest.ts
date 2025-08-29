import { type NextRequest, NextResponse } from 'next/server'

function extractLanguageFromRequest(request: NextRequest): string {
	const referer: any = request.headers.get('referer')

	const normalizeLocale = (locale: string) => {
		const [lang, region] = locale.split('-')
		if (region) {
			return `${lang.toLowerCase()}-${region.toUpperCase()}`
		}
		return lang.toLowerCase()
	}

	const { searchParams } = new URL(request.url)
	const locale = searchParams.get('locale')
	if (locale) {
		return locale
	}
	// Try to extract from referer
	if (referer) {
		const match = referer.match(/\/([a-z]{2}-[a-z]{2})(?:\/|$)/i)
		if (match) return normalizeLocale(match[1])
	}
}

export default extractLanguageFromRequest

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
