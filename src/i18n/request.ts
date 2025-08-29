import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

import enUS from '../../messages/en-US.json'
import deDE from '../../messages/de-DE.json'
import esES from '../../messages/es-ES.json'
import frFR from '../../messages/fr-FR.json'
import itIT from '../../messages/it-IT.json'
import jaJP from '../../messages/ja-JP.json'
import koKR from '../../messages/ko-KR.json'
import ptPT from '../../messages/pt-PT.json'
import ruRU from '../../messages/ru-RU.json'
import zhCN from '../../messages/zh-CN.json'

export const messages = {
	'en-US': enUS,
	'de-DE': deDE,
	'es-ES': esES,
	'fr-FR': frFR,
	'it-IT': itIT,
	'ja-JP': jaJP,
	'ko-KR': koKR,
	'pt-PT': ptPT,
	'ru-RU': ruRU,
	'zh-CN': zhCN,
}

export default getRequestConfig(async ({ requestLocale }) => {
	// Typically corresponds to the `[locale]` segment
	const requested = await requestLocale
	const locale = hasLocale(routing.locales, requested)
		? requested
		: routing.defaultLocale

	return {
		locale,
		messages: messages[locale],
	}
})
