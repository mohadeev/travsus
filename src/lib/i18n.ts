// lib/i18n.ts
import { useLocale, useMessages } from 'next-intl'

import enUS from '../../messages/en-USS.json'
import deDE from '../../messages/de-DEE.json'
import esES from '../../messages/es-ESS.json'
import frFR from '../../messages/fr-FRR.json'
import itIT from '../../messages/it-ITT.json'
import jaJP from '../../messages/ja-JPP.json'
import koKR from '../../messages/ko-KRR.json'
import ptPT from '../../messages/pt-PTT.json'
import ruRU from '../../messages/ru-RUU.json'
import zhCN from '../../messages/zh-CNV.json'

console.log('enUS:', enUS)

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

export function useTranslations(namespace: string, localeParam: any) {
	let locale = ''

	if (localeParam) {
		let locale = localeParam
	} else {
		locale = useLocale() // e.g., "ja" or "ja-JP"
	}

	return function t(
		key: string,
		values?: Record<string, string | number>,
	): string {
		try {
			const message = messages?.[locale]?.[namespace]?.[key]

			if (!message) return key

			if (values) {
				return Object.entries(values).reduce(
					(msg, [k, v]) =>
						msg.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
					message,
				)
			}

			return message
		} catch {
			return key
		}
	}
}
