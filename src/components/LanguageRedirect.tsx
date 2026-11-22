// The language menu remembers the visitor's choice in a cookie (1 year).
// Pages are never switched to another language automatically: a page stays
// in the language of its address until the visitor picks another one.
export const LANGUAGE_CHOICE_COOKIE = 'lang_choice'

/** The language menu calls this: the choice is kept for later visits. */
export function rememberLanguage(code: string) {
	document.cookie = `${LANGUAGE_CHOICE_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`
}
