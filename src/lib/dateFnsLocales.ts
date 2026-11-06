// date-fns languages for the date pickers, keyed by the site's locales
// (src/i18n/routing.ts). Only the site's 10 languages are imported, since the
// pickers look them up with useLocale(); the full list of ~90 date-fns
// languages made the Cloudflare Worker too large.
import de from 'date-fns/locale/de'
import en_US from 'date-fns/locale/en-US'
import es from 'date-fns/locale/es'
import fr from 'date-fns/locale/fr'
import it from 'date-fns/locale/it'
import ja from 'date-fns/locale/ja'
import ko from 'date-fns/locale/ko'
import pt from 'date-fns/locale/pt'
import ru from 'date-fns/locale/ru'
import zh_CN from 'date-fns/locale/zh-CN'

const locales = {
	de,
	'en-US': en_US,
	es,
	fr,
	it,
	ja,
	ko,
	pt,
	ru,
	'zh-CN': zh_CN,
} as const

export const nextIntlToDateFnsMap = {
	'en-US': locales['en-US'],
	'de-DE': locales.de,
	'es-ES': locales.es,
	'fr-FR': locales.fr,
	'it-IT': locales.it,
	'ja-JP': locales.ja,
	'ko-KR': locales.ko,
	'pt-PT': locales.pt,
	'ru-RU': locales.ru,
	'zh-CN': locales['zh-CN'],
} as const

export type DateFnsLocaleKey = keyof typeof locales
export type NextIntlLocaleKey = keyof typeof nextIntlToDateFnsMap

export default nextIntlToDateFnsMap
