// lib/i18n.ts
import { useMessages } from 'next-intl'

export function useTranslations(namespace: string) {
	const messages = useMessages() as Record<string, Record<string, string>>

	return function t(
		key: string,
		values?: Record<string, string | number>,
	): string {
		try {
			const message = messages?.[namespace]?.[key]

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
