import 'server-only'

// Type for our translations
export type Translation = {
	[key: string]: string | Record<string, string | Record<string, string>>
}

// Cache for translations
const translationCache = new Map<string, Translation>()

// Function to get translations
export async function getTranslations(lang: string): Promise<Translation> {
	// Check cache first
	if (translationCache.has(lang)) {
		return translationCache.get(lang)!
	}

	try {
		// Dynamic import of the translation file
		const translations = await import(
			`../../app/[lang]/translations/${lang}.json`
		)

		// Cache the translations
		translationCache.set(lang, translations.default)

		return translations.default
	} catch (error) {
		console.warn(
			`Translation file for ${lang} not found, falling back to English`,
		)

		try {
			// Fallback to English if translation not found
			const translations = await import(`../../app/[lang]/translations/en.json`)
			translationCache.set(lang, translations.default)
			return translations.default
		} catch (fallbackError) {
			console.error(
				'Even fallback translation not found, returning empty object',
			)
			// If even the fallback fails, return an empty object to prevent crashes
			return {}
		}
	}
}

// Helper function to get a nested translation value using dot notation
// Example: getTranslationValue(translations, "common.buttons.submit")
export function getTranslationValue(
	translations: Translation,
	key: string,
): string {
	const keys = key.split('.')
	let value: any = translations

	for (const k of keys) {
		if (value === undefined || value === null) return key
		value = value[k]
	}

	return typeof value === 'string' ? value : key
}
