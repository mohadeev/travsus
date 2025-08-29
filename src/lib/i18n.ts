// lib/i18n.ts
import { useLocale, useMessages } from 'next-intl'

import enUS from '../../messages/en-US.json'
import deDE from '../../messages/de-DEE.json'
import esES from '../../messages/es-ES.json'
import frFR from '../../messages/fr-FR.json'
import itIT from '../../messages/it-IT.json'
import jaJP from '../../messages/ja-JP.json'
import koKR from '../../messages/ko-KR.json'
import ptPT from '../../messages/pt-PT.json'
import ruRU from '../../messages/ru-RU.json'
import zhCN from '../../messages/zh-CN.json'

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
