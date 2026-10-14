'use client'
// First-party analytics tracker (data: /api/a, panel: /[locale]/admin/analytics).
//
// Anonymous by default: a random id per visit (sessionStorage), page views,
// time on page, scroll depth, clicks on links/buttons, JavaScript errors.
// With "measurement" cookie consent it also keeps a visitor id across visits
// and links the visit to the signed-in account. Typed text is never recorded.
import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

const ENDPOINT = '/api/a'
const IDLE_MS = 30 * 60_000 // a new visit after 30 minutes without activity
const MAX_ERRORS = 20

type Event = { type: string; path?: string; title?: string; duration?: number; scroll?: number; data?: Record<string, string | number>; t: number; retry?: boolean }

const randomId = () => (crypto.randomUUID?.() ?? `${Date.now()}${Math.random()}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 32)

const store = {
	get: (s: Storage, k: string) => {
		try {
			return s.getItem(k)
		} catch {
			return null
		}
	},
	set: (s: Storage, k: string, v: string) => {
		try {
			s.setItem(k, v)
		} catch {}
	},
}

/** Measurement consent from the cookie banner (and no Global Privacy Control). */
function hasConsent() {
	if ((navigator as any).globalPrivacyControl) return false
	try {
		const chosen: string[] = JSON.parse(store.get(localStorage, 'userConsentPreferences') ?? '[]')
		return chosen.some((id) => ['measurement', 'audience-insights', 'content-performance'].includes(id))
	} catch {
		return false
	}
}

/** This visit's id: kept for the tab, renewed after 30 minutes idle. */
function sessionId() {
	const last = Number(store.get(sessionStorage, 'tv_last') ?? 0)
	let sid = store.get(sessionStorage, 'tv_sid')
	if (!sid || Date.now() - last > IDLE_MS) {
		sid = randomId()
		store.set(sessionStorage, 'tv_sid', sid)
		sessionStorage.removeItem('tv_first')
		sessionStorage.removeItem('tv_errors')
		sessionStorage.removeItem('tv_identified')
	}
	store.set(sessionStorage, 'tv_last', String(Date.now()))
	return sid
}

const scrollPercent = () => {
	const doc = document.documentElement
	const max = doc.scrollHeight - window.innerHeight
	return max <= 0 ? 100 : Math.round(Math.min(1, window.scrollY / max) * 100)
}

export default function AnalyticsTracker() {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const { isSignedIn } = useAuth()
	const queue = useRef<Event[]>([])
	const page = useRef({ path: '', started: 0, visible: 0, maxScroll: 0 })

	const skip = /\/admin(\/|$)/.test(pathname) // the panel itself

	// Send what's queued (plus where the visitor is right now)
	const flush = useRef((useBeacon = false) => {})
	flush.current = (useBeacon = false) => {
		if (skip) return
		const consent = hasConsent()
		let vid: string | undefined
		if (consent) {
			vid = store.get(localStorage, 'tv_vid') ?? undefined
			if (!vid) store.set(localStorage, 'tv_vid', (vid = randomId()))
		}
		const sid = sessionId()
		const firstSent = store.get(sessionStorage, 'tv_first') === sid
		const body = JSON.stringify({
			sid,
			vid,
			consent,
			events: queue.current.splice(0, 50),
			// Where the visitor is right now (only while a page is open and visible)
			live: document.visibilityState === 'visible' && page.current.path ? { path: page.current.path, title: document.title, scroll: scrollPercent() } : undefined,
			first: firstSent
				? undefined
				: { referrer: document.referrer, url: location.href, path: location.pathname, locale: document.documentElement.lang || navigator.language, screen: `${screen.width}x${screen.height}` },
		})
		store.set(sessionStorage, 'tv_first', sid)
		if (useBeacon && navigator.sendBeacon) {
			const events: Event[] = JSON.parse(body).events
			if (events.length) {
				let pending: Event[] = []
				try {
					pending = JSON.parse(store.get(sessionStorage, 'tv_pending') ?? '[]')
				} catch {}
				store.set(sessionStorage, 'tv_pending', JSON.stringify([...pending, ...events].slice(-50)))
			}
			navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }))
		} else fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true }).catch(() => {})
	}

	const push = (event: Omit<Event, 't'>) => queue.current.push({ ...event, t: Date.now() })

	/** Close the current page: time actually spent looking at it, deepest scroll. */
	const leavePage = () => {
		const p = page.current
		if (!p.path) return
		const visible = p.visible + (document.visibilityState === 'visible' && p.started ? Date.now() - p.started : 0)
		push({ type: 'leave', path: p.path, duration: visible, scroll: p.maxScroll })
		p.path = ''
	}

	// On page load: events the previous page tried to send by beacon while
	// closing go out again (beacons sent while leaving can be lost; the server
	// drops the ones it already has)
	useEffect(() => {
		try {
			const pending: Event[] = JSON.parse(store.get(sessionStorage, 'tv_pending') ?? '[]')
			sessionStorage.removeItem('tv_pending')
			queue.current.unshift(...pending.map((e) => ({ ...e, retry: true })))
		} catch {}
	}, [])

	// A page view on every route change
	useEffect(() => {
		if (skip) return
		leavePage()
		const path = pathname + (searchParams.toString() ? `?${searchParams}` : '')
		page.current = { path, started: Date.now(), visible: 0, maxScroll: scrollPercent() }
		// Title is set a moment after navigation
		const timer = setTimeout(() => {
			push({ type: 'pageview', path, title: document.title })
			const query = searchParams.get('query') || searchParams.get('q')
			if (query) push({ type: 'search', path, data: { q: query } })
			flush.current()
		}, 400)
		return () => clearTimeout(timer)
	}, [pathname, searchParams]) // eslint-disable-line react-hooks/exhaustive-deps

	// Link to the account once per visit (only sent with consent; checked again on the server)
	useEffect(() => {
		if (skip || !isSignedIn || !hasConsent() || store.get(sessionStorage, 'tv_identified')) return
		store.set(sessionStorage, 'tv_identified', '1')
		push({ type: 'identify' })
	}, [isSignedIn]) // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (skip) return
		const onScroll = () => {
			page.current.maxScroll = Math.max(page.current.maxScroll, scrollPercent())
		}
		const onClick = (e: MouseEvent) => {
			const el = (e.target as Element | null)?.closest?.('a, button, [role="button"], summary')
			if (!el || el.closest('[data-analytics-ignore]')) return
			// A readable name: its label, the heading inside (cards), or its first line of text
			const heading = el.querySelector('h1, h2, h3, h4') as HTMLElement | null
			const firstLine = ((el as HTMLElement).innerText || '').split('\n').map((l) => l.trim()).find(Boolean)
			const text = (el.getAttribute('aria-label') || heading?.innerText || firstLine || '').replace(/\s+/g, ' ').trim().slice(0, 80)
			const href = el.getAttribute('href') ?? undefined
			push({ type: 'click', path: page.current.path, data: { text, ...(href ? { href: href.slice(0, 200) } : {}), tag: el.tagName.toLowerCase() } })
		}
		const onError = (message: string, source?: string, line?: number) => {
			const count = Number(store.get(sessionStorage, 'tv_errors') ?? 0)
			if (count >= MAX_ERRORS) return
			store.set(sessionStorage, 'tv_errors', String(count + 1))
			push({ type: 'error', path: page.current.path, data: { message: message.slice(0, 300), source: (source ?? '').split('/').pop()?.split('?')[0] ?? '', line: line ?? 0 } })
			flush.current()
		}
		const onWindowError = (e: ErrorEvent) => onError(e.message || 'Error', e.filename, e.lineno)
		const onRejection = (e: PromiseRejectionEvent) => onError(`Unhandled: ${e.reason?.message ?? String(e.reason)}`)
		const onVisibility = () => {
			const p = page.current
			if (document.visibilityState === 'hidden') {
				if (p.started) p.visible += Date.now() - p.started
				p.started = 0
				flush.current(true)
			} else p.started = Date.now()
		}
		const onPageHide = () => {
			leavePage()
			flush.current(true)
		}

		window.addEventListener('scroll', onScroll, { passive: true })
		document.addEventListener('click', onClick, true)
		window.addEventListener('error', onWindowError)
		window.addEventListener('unhandledrejection', onRejection)
		document.addEventListener('visibilitychange', onVisibility)
		window.addEventListener('pagehide', onPageHide)
		// Heartbeat: keeps the live view up to date (only while the tab is visible)
		const heartbeat = setInterval(() => {
			if (document.visibilityState === 'visible') flush.current()
		}, 15_000)

		return () => {
			window.removeEventListener('scroll', onScroll)
			document.removeEventListener('click', onClick, true)
			window.removeEventListener('error', onWindowError)
			window.removeEventListener('unhandledrejection', onRejection)
			document.removeEventListener('visibilitychange', onVisibility)
			window.removeEventListener('pagehide', onPageHide)
			clearInterval(heartbeat)
		}
	}, [skip]) // eslint-disable-line react-hooks/exhaustive-deps

	return null
}
