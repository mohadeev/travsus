// Cookie consent: what the visitor accepted, saved in their browser, and
// passed to Google (Consent Mode v2). Analytics and marketing tags only run
// after the visitor says yes; strictly necessary cookies (sign-in, booking) always work.
export type ConsentChoice = { analytics: boolean; marketing: boolean }

const KEY = 'userConsentPreferences' // also read by AnalyticsTracker
const VERSION_KEY = 'userConsentDate'
export const OPEN_SETTINGS_EVENT = 'travsus:open-cookie-settings'
export const CONSENT_CHANGED_EVENT = 'travsus:consent-changed'

/** The saved choice, or null when the visitor hasn't chosen yet. */
export function readConsent(): ConsentChoice | null {
	try {
		const raw = localStorage.getItem(KEY)
		if (!raw) return null
		const ids: string[] = JSON.parse(raw)
		if (!Array.isArray(ids)) return null
		return { analytics: ids.includes('measurement'), marketing: ids.includes('advertising') }
	} catch {
		return null
	}
}

/** Saves the choice and tells Google and the rest of the site. */
export function saveConsent(choice: ConsentChoice) {
	const ids = ['necessary', ...(choice.analytics ? ['measurement'] : []), ...(choice.marketing ? ['advertising'] : [])]
	try {
		localStorage.setItem(KEY, JSON.stringify(ids))
		localStorage.setItem(VERSION_KEY, new Date().toISOString())
	} catch {
		// storage blocked: the choice still applies to this page view
	}
	applyConsent(choice)
	window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: choice }))
}

/** Google Consent Mode v2 update (the "denied" defaults are set in the layout). */
export function applyConsent(choice: ConsentChoice) {
	const w = window as any
	w.dataLayer = w.dataLayer || []
	const gtag = w.gtag || function () { w.dataLayer.push(arguments) } // eslint-disable-line prefer-rest-params
	const v = (on: boolean) => (on ? 'granted' : 'denied')
	gtag('consent', 'update', {
		analytics_storage: v(choice.analytics),
		ad_storage: v(choice.marketing),
		ad_user_data: v(choice.marketing),
		ad_personalization: v(choice.marketing),
	})
}

/** Opens the cookie settings (e.g. from the footer link). */
export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))

/**
 * Inline script for the layout, before any Google tag: everything denied by
 * default, then the visitor's saved choice re-applied straight away.
 */
export const CONSENT_DEFAULT_SCRIPT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', functionality_storage: 'granted', security_storage: 'granted', wait_for_update: 500 });
gtag('set', 'ads_data_redaction', true);
try {
	var ids = JSON.parse(localStorage.getItem('${KEY}') || 'null');
	if (Array.isArray(ids)) {
		var a = ids.indexOf('measurement') > -1 ? 'granted' : 'denied';
		var m = ids.indexOf('advertising') > -1 ? 'granted' : 'denied';
		gtag('consent', 'update', { analytics_storage: a, ad_storage: m, ad_user_data: m, ad_personalization: m });
	}
} catch (e) {}
`
