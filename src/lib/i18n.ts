// lib/i18n.ts
import { useLocale, useMessages } from 'next-intl'

// The current language's texts come from <NextIntlClientProvider> (set in
// app/[locale]/layout.tsx), so the JSON files aren't bundled here again.

export function useTranslations(namespace: string, localeParam?: string) {
	let locale = ''

	if (localeParam) {
		locale = localeParam
	} else {
		locale = useLocale() // e.g., "ja" or "ja-JP"
	}
	const messages: Record<string, any> = { [locale]: useMessages() }

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
