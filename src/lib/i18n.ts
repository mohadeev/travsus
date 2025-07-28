// lib/i18n.ts
import { useMessages } from 'next-intl'

type MessageStructure = {
	about: {
		about_Discover_Breathtaking_Destinations: string
		about_Explore_A_World_Of_Possibilities: string
		// ... all other about keys
	}
	footer: {
		footer_Copyright: string
		footer_Disclaimer: string
		// ... all other footer keys
	}
	// ... other namespaces
}

type Namespace = keyof MessageStructure
type NamespaceKeys<N extends Namespace> = keyof MessageStructure[N]

export function useTranslations<N extends Namespace>(namespace: N) {
	const messages = useMessages() as MessageStructure

	return function t<K extends NamespaceKeys<N>>(
		key: K,
		values?: Record<string, string | number>,
	): string {
		try {
			// Safely get the message
			const message = messages?.[namespace]?.[key] as string | undefined

			// Fallback to key if message not found
			if (!message) return key.toString()

			// Replace placeholders if values exist
			if (values) {
				return Object.entries(values).reduce(
					(msg, [k, v]) =>
						msg.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
					message,
				)
			}

			return message
		} catch (error) {
			// Fallback to key if any error occurs
			return 'nothings'
		}
	}
}
