// Helpers for geography tables (continents, countries, states, cities, places).
// Each row has a `content` with per-language `translations` ({ language, text, type }).
import { T } from '@/lib/db'

/** Embed for a geo row's content and all its translations. */
export const GEO_CONTENT = `content:${T.geoContents}!contentId(*, translations:${T.geoTexts}(*))`

/** Language from the page URL in the referer (e.g. /fr-FR/...), default en-US. */
export function languageFromReferer(request: Request): string {
	const url = request.headers.get('referer') || request.headers.get('origin') || ''
	return url.match(/\/([a-z]{2}-[A-Z]{2})(?:\/|$)/)?.[1] ?? 'en-US'
}

/** Keeps only the translations matching `filter` on a row's content. */
export function keepTranslations<R extends Record<string, any>>(
	row: R,
	filter: (t: any) => boolean,
): R {
	if (!row?.content) return row
	return {
		...row,
		content: { ...row.content, translations: (row.content.translations ?? []).filter(filter) },
	}
}

/**
 * Keeps translations in `language`; rows with none in that language fall back
 * to en-US.
 */
export function inLanguage<R extends Record<string, any>>(row: R, language: string): R {
	const localized = keepTranslations(row, (t) => t.language === language)
	if (localized.content?.translations?.length || language === 'en-US') return localized
	return keepTranslations(row, (t) => t.language === 'en-US')
}

/** True when an image object has a usable url. */
export const hasImage = (image: any) => !!(image && (image.url || image.uploadFrom))
