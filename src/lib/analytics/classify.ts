// Turns request details into readable analytics fields: traffic source,
// device / browser / OS, and the visitor's place (from the host's geo headers).

const SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|yandex|baidu|ecosia|qwant|naver|seznam)\./
const SOCIAL: [RegExp, string][] = [
	[/(^|\.)(facebook|fb)\.(com|me)$|^l\.facebook\.com$|^m\.facebook\.com$/, 'facebook'],
	[/(^|\.)instagram\.com$/, 'instagram'],
	[/^t\.co$|(^|\.)(twitter|x)\.com$/, 'x'],
	[/(^|\.)tiktok\.com$/, 'tiktok'],
	[/(^|\.)linkedin\.com$|^lnkd\.in$/, 'linkedin'],
	[/(^|\.)pinterest\./, 'pinterest'],
	[/(^|\.)youtube\.com$|^youtu\.be$/, 'youtube'],
	[/(^|\.)whatsapp\.com$|^wa\.me$/, 'whatsapp'],
	[/(^|\.)reddit\.com$/, 'reddit'],
	[/(^|\.)tripadvisor\./, 'tripadvisor'],
]

/** { source, medium, campaign } from the first page's referrer and URL. */
export function trafficSource(referrer: string | null, landingUrl: string | null, ownHost: string | null) {
	let params = new URLSearchParams()
	try {
		if (landingUrl) params = new URL(landingUrl, 'https://x.invalid').searchParams
	} catch {}
	const utmSource = params.get('utm_source')
	if (utmSource) {
		return { source: utmSource.toLowerCase().slice(0, 60), medium: (params.get('utm_medium') || 'campaign').toLowerCase().slice(0, 60), campaign: params.get('utm_campaign')?.slice(0, 100) ?? null }
	}
	if (params.get('gclid') || params.get('gad_source')) return { source: 'google', medium: 'cpc', campaign: null }

	let host = ''
	try {
		host = referrer ? new URL(referrer).hostname.replace(/^www\./, '').toLowerCase() : ''
	} catch {}
	if (!host || (ownHost && host === ownHost.replace(/^www\./, ''))) {
		return { source: params.get('fbclid') ? 'facebook' : 'direct', medium: params.get('fbclid') ? 'social' : 'none', campaign: null }
	}
	const search = host.match(SEARCH)
	if (search) return { source: search[2], medium: 'organic', campaign: null }
	for (const [pattern, name] of SOCIAL) if (pattern.test(host)) return { source: name, medium: 'social', campaign: null }
	return { source: host.slice(0, 100), medium: 'referral', campaign: null }
}

/** Device type, browser and OS from the user agent. */
export function deviceInfo(ua: string) {
	const device = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)
		? 'tablet'
		: /Mobi|iPhone|iPod|Android|IEMobile|Opera Mini/i.test(ua)
			? 'mobile'
			: 'desktop'
	const browser = /Edg\//.test(ua)
		? 'Edge'
		: /OPR\/|Opera/.test(ua)
			? 'Opera'
			: /SamsungBrowser/.test(ua)
				? 'Samsung Internet'
				: /Firefox|FxiOS/.test(ua)
					? 'Firefox'
					: /Chrome|CriOS/.test(ua)
						? 'Chrome'
						: /Safari/.test(ua)
							? 'Safari'
							: 'Other'
	const os = /Windows/.test(ua)
		? 'Windows'
		: /iPhone|iPad|iPod/.test(ua)
			? 'iOS'
			: /Android/.test(ua)
				? 'Android'
				: /Mac OS X|Macintosh/.test(ua)
					? 'macOS'
					: /CrOS/.test(ua)
						? 'ChromeOS'
						: /Linux/.test(ua)
							? 'Linux'
							: 'Other'
	return { device, browser, os }
}

export const isBot = (ua: string) =>
	!ua || /bot|crawl|spider|slurp|headless|lighthouse|pingdom|monitor|preview|facebookexternalhit|curl|wget|python|axios|node-fetch/i.test(ua)

/** Country (ISO code), region and city from Vercel / Cloudflare headers. */
export function place(headers: Headers) {
	const decode = (v: string | null) => {
		try {
			return v ? decodeURIComponent(v).slice(0, 80) : null
		} catch {
			return v
		}
	}
	return {
		country: (headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || '').toUpperCase().slice(0, 2) || null,
		region: decode(headers.get('x-vercel-ip-country-region')),
		city: decode(headers.get('x-vercel-ip-city')),
	}
}
