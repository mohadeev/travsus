import { routing } from '@/i18n/routing'

/**
 * Public site origin. Canonical and hreflang URLs use this fixed host so a
 * request to the apex (travsus.com) cannot publish apex URLs.
 */
export const SITE_URL = 'https://www.travsus.com'

/**
 * Canonical URL plus hreflang for every locale and x-default.
 * `path` has no locale prefix: "" (home), "/about", "/destinations/italy".
 */
export function pageAlternates(locale: string, path = '') {
	const suffix = path === '' || path.startsWith('/') ? path : `/${path}`
	const languages: Record<string, string> = {}
	for (const language of routing.locales) languages[language] = `${SITE_URL}/${language}${suffix}`
	languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}${suffix}`
	return {
		canonical: `${SITE_URL}/${locale}${suffix}`,
		languages,
	}
}
