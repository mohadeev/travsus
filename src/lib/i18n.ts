'use client'

// Client translations. The active language is provided by NextIntlClientProvider
// (one locale per request). Importing every messages/*.json here used to ship
// all 10 languages in the server Worker and the browser bundle.
import { useMessages } from 'next-intl'

type Text = string | string[]
type Catalog = Record<string, Record<string, Text>>

export function useTranslations(namespace: string) {
	const messages = useMessages() as Catalog

	return function t(key: string, values?: Record<string, string | number>): any {
		try {
			const message = messages?.[namespace]?.[key]
			if (message == null || message === '') return key
			if (typeof message !== 'string') return values ? key : message
			if (!values) return message
			return Object.entries(values).reduce(
				(msg, [k, v]) => msg.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
				message,
			)
		} catch {
			return key
		}
	}
}
