// How a visit went, as a face: errors and rage clicks (3+ clicks on the same
// spot within a second) pull the score down, a quick exit lowers it a little,
// and good moments (searching, starting a booking, opening sign-up, reading
// pages for a while) raise it. Used by the analytics panel for every visit.

export type Mood = { score: number; emoji: string; label: string }

export type MoodInput = {
	errors: number
	rage: number
	pageviews: number
	/** Seconds on the site */
	duration: number
	/** Good moments: searches, booking starts, sign-up opens */
	good?: number
}

export function visitMood({ errors, rage, pageviews, duration, good = 0 }: MoodInput): Mood {
	let score = 75
	score -= Math.min(errors, 4) * 12
	score -= Math.min(rage, 3) * 18
	if (pageviews <= 1 && duration < 10) score -= 15 // left straight away
	if (pageviews >= 3) score += 8
	if (duration >= 120) score += 7
	score += Math.min(good, 3) * 8
	score = Math.max(0, Math.min(100, score))
	if (score >= 85) return { score, emoji: '😀', label: 'Great' }
	if (score >= 68) return { score, emoji: '🙂', label: 'Good' }
	if (score >= 50) return { score, emoji: '😐', label: 'Neutral' }
	if (score >= 30) return { score, emoji: '😕', label: 'Struggling' }
	return { score, emoji: '😡', label: 'Frustrated' }
}

/** Event types that count as good moments. */
export const GOOD_EVENTS = new Set(['search', 'booking_start', 'signup_open'])

/** The face for one moment on the experience line, or null for ordinary steps. */
export function momentEmoji(type: string): string | null {
	if (type === 'rage') return '😡'
	if (type === 'error') return '😕'
	if (type === 'booking_start') return '😍'
	if (GOOD_EVENTS.has(type)) return '😀'
	return null
}
