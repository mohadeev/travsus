// Outreach tracker: the people we talk to about becoming affiliates (mostly
// in Instagram DMs), where each conversation stands, and what happened when.
export const OUTREACH_STATUSES = ['to_contact', 'messaged', 'replied', 'talking', 'joined', 'no_reply', 'declined'] as const
export type OutreachStatus = (typeof OUTREACH_STATUSES)[number]

export const OUTREACH_PLATFORMS = ['instagram', 'tiktok', 'youtube', 'other'] as const
export type OutreachPlatform = (typeof OUTREACH_PLATFORMS)[number]

/** One line of a person's timeline: a note, or a status change (or both) */
export type OutreachEvent = { at: string; text?: string; status?: OutreachStatus }

export type OutreachContact = {
	id: string
	handle: string
	platform: OutreachPlatform
	name: string | null
	followers: number | null
	email: string | null
	status: OutreachStatus
	/** Day to follow up (YYYY-MM-DD) */
	follow_up: string | null
	/** Last time we or they wrote */
	last_contact_at: string | null
	log: OutreachEvent[]
	created_at: string
}

/** "@Some.Name " or "instagram.com/some.name/?hl=en" → "some.name" */
export function cleanHandle(value: string) {
	return value
		.trim()
		.replace(/^https?:\/\/(www\.)?(instagram|tiktok|youtube)\.com\//i, '')
		.replace(/^@/, '')
		.split(/[/?#\s]/)[0]
		.toLowerCase()
		.slice(0, 60)
}
