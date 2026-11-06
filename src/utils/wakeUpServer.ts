// Wakes the external server (Heroku sleeps when idle) so the uploads and
// country search that use it answer quickly later.
// - Skipped in development and when no external server is set.
// - Once per browser session.
// - Sent as a "no-cors" request: the page never reads the answer, so the
//   browser doesn't need CORS headers and logs no CORS error. Any failure
//   (offline, server down) is ignored.
const externalServerOrigin = process.env.NEXT_PUBLIC_EXTERNAL_SERVER
const SESSION_KEY = 'external-server-woken'

export function wakeUpServer() {
	if (process.env.NODE_ENV !== 'production' || !externalServerOrigin) return
	try {
		if (sessionStorage.getItem(SESSION_KEY)) return
		sessionStorage.setItem(SESSION_KEY, '1')
	} catch {
		// Storage blocked: wake it anyway
	}
	fetch(`${externalServerOrigin}/api/wake-up`, { mode: 'no-cors', cache: 'no-store', keepalive: true }).catch(() => {})
}
