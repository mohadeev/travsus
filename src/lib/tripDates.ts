// Trip dates, shared by the tour page, checkout and the booking API.
// Stored as { startDate, endDate } in milliseconds (local midnight), where
// endDate = startDate + (number of days - 1). Plain date maths only: no
// parsing of formatted text, which breaks in other languages.

export type TripDates = { startDate: number; endDate: number }

const DAY = 24 * 60 * 60 * 1000

/** Midnight (local time) of the given day. */
export const startOfDay = (date: Date | number) => {
	const d = new Date(date)
	d.setHours(0, 0, 0, 0)
	return d
}

const addDays = (date: Date, days: number) => {
	const d = new Date(date)
	d.setDate(d.getDate() + days) // also correct across daylight-saving changes
	return d
}

/** The earliest day a trip can start: tomorrow. */
export const firstBookableDay = () => addDays(startOfDay(Date.now()), 1)

/** A trip of `days` days starting on `start`. */
export function tripDates(start: Date, days: number): TripDates {
	const first = startOfDay(start)
	const last = addDays(first, Math.max(1, Math.round(days || 1)) - 1)
	return { startDate: first.getTime(), endDate: last.getTime() }
}

/** [start, end] as Dates from a stored value (nulls when there is none). */
export function readTripDates(value: any): [Date | null, Date | null] {
	const start = Number(value?.startDate)
	const end = Number(value?.endDate)
	return [
		Number.isFinite(start) && start > 0 ? new Date(start) : null,
		Number.isFinite(end) && end > 0 ? new Date(end) : null,
	]
}

/** "Wed, Oct 15 – Fri, Oct 17" (one date for one-day trips, '' when none). */
export function formatTripDates(start: Date | null, end: Date | null, locale: string) {
	if (!start) return ''
	const format = (d: Date) => d.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' })
	return end && end.getTime() !== start.getTime() ? `${format(start)} – ${format(end)}` : format(start)
}

/**
 * Server check: a valid start day that isn't in the past. Returns the dates
 * rebuilt from the start day and the tour length, or null when invalid.
 * Allows one day of leeway for visitors in time zones behind the server.
 */
export function validTripDates(value: any, days: number): TripDates | null {
	const [start] = readTripDates(value)
	if (!start || Number.isNaN(start.getTime())) return null
	if (start.getTime() < startOfDay(Date.now()).getTime() - DAY) return null
	if (start.getTime() > Date.now() + 2 * 365 * DAY) return null // not years ahead
	// Keep the visitor's own midnights (re-rounding here would use the
	// server's time zone and could move the trip by a day). Their end date is
	// kept when it matches the tour length, allowing for a clock change (±2h).
	const length = Math.max(1, Math.round(days || 1))
	const expectedEnd = start.getTime() + (length - 1) * DAY
	const [, end] = readTripDates(value)
	const endDate = end && Math.abs(end.getTime() - expectedEnd) <= 2 * 60 * 60 * 1000 ? end.getTime() : expectedEnd + 2 * 60 * 60 * 1000
	return { startDate: start.getTime(), endDate }
}
