// Tours a visitor opened recently, kept in their own browser (localStorage).
// Nothing is sent to the server. Shown on the home page as "Recently viewed".
const KEY = 'travsus:recent-tours'
const MAX = 12
export const RECENT_TOURS_EVENT = 'travsus:recent-tours-changed'

export function readRecentTours(): string[] {
	try {
		const ids = JSON.parse(localStorage.getItem(KEY) || '[]')
		return Array.isArray(ids) ? ids.filter((id) => typeof id === 'string') : []
	} catch {
		return [] // private mode, blocked storage or bad data
	}
}

/** Puts the tour first in the list (no duplicates, newest 12 kept). */
export function addRecentTour(id: string) {
	try {
		const ids = [id, ...readRecentTours().filter((other) => other !== id)].slice(0, MAX)
		localStorage.setItem(KEY, JSON.stringify(ids))
		window.dispatchEvent(new Event(RECENT_TOURS_EVENT))
	} catch {
		// storage unavailable: nothing to remember
	}
}

export function clearRecentTours() {
	try {
		localStorage.removeItem(KEY)
		window.dispatchEvent(new Event(RECENT_TOURS_EVENT))
	} catch {
		// storage unavailable
	}
}
