'use client'
// Opens the site in the visitor's language. On the first page of a visit that
// comes from outside the site (Google, a link, typed in), the visitor is sent
// to the same page in:
//   1. the language they chose themselves before (the language menu saves it), or
//   2. their browser's language, when the site has it, or
//   3. English.
// Never for search engines and other bots (every language must stay indexed),
// never while browsing inside the site, and at most once per visit.
import { useEffect } from 'react'
import { useLocale } from 'next-intl'
import { routing } from '@/i18n/routing'

export const LANGUAGE_CHOICE_COOKIE = 'lang_choice'
const CHECKED = 'lang_checked'
const BOT = /bot|crawl|spider|slurp|google|bing|yandex|baidu|duckduck|facebookexternalhit|embedly|preview|lighthouse|headless|pagespeed/i
const LOCALES = routing.locales as readonly string[]

/** The site language closest to a browser language ("ru" → ru-RU, "pt-BR" → pt-PT). */
function siteLanguage(browser: string) {
	const exact = LOCALES.find((l) => l.toLowerCase() === browser.toLowerCase())
	if (exact) return exact
	const base = browser.split('-')[0].toLowerCase()
	return LOCALES.find((l) => l.split('-')[0] === base)
}

const cookie = (name: string) => document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))?.split('=')[1]

/** The language menu calls this: the choice is kept for later visits (1 year). */
export function rememberLanguage(code: string) {
	document.cookie = `${LANGUAGE_CHOICE_COOKIE}=${code}; path=/; max-age=31536000; samesite=lax`
}

export default function LanguageRedirect() {
	const locale = useLocale()

	useEffect(() => {
		try {
			if (BOT.test(navigator.userAgent) || navigator.webdriver) return
			if (sessionStorage.getItem(CHECKED)) return
			sessionStorage.setItem(CHECKED, '1')
			// Inside the site: the visitor is already where they chose to be
			if (document.referrer && new URL(document.referrer).host === window.location.host) return

			const chosen = cookie(LANGUAGE_CHOICE_COOKIE)
			const target =
				(chosen && LOCALES.includes(chosen) ? chosen : undefined) ??
				(navigator.languages?.length ? navigator.languages : [navigator.language]).map(siteLanguage).find(Boolean) ??
				routing.defaultLocale
			if (target === locale) return

			// The same page in that language: its alternate link (translated
			// address), else the same path with the other language prefix
			const alternate = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${target}"]`)
			let path = alternate ? new URL(alternate.href).pathname : ''
			if (!path) {
				const parts = window.location.pathname.split('/')
				if (!LOCALES.includes(parts[1])) return
				parts[1] = target
				path = parts.join('/')
			}
			window.location.replace(path + window.location.search + window.location.hash)
		} catch {
			// Storage blocked or anything unexpected: stay on this page
		}
	}, [locale])

	return null
}
