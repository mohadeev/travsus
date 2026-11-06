// Forum moderation: posts taken down, and text that is never accepted.
// Taken-down posts are hidden everywhere (list, page, counts) and their page
// answers 404. New posts and comments matching a blocked pattern are refused.

/** Posts removed by the team (scam, illegal or spam), by id. */
export const REMOVED_POST_IDS = new Set<string>([
	// Selling EU passports online (illegal documents), disguised as visa tips
	'0e64afead7b8950ed65495a1',
	// Coordinated advertising for the "Eterna" eSIM (same campaign, several accounts)
	'0e6ce5d1c3ee45687d508fae',
	'bd1573dcd068b37fee0961e6',
	'5022ac6ec4f76c8f97a0709a',
	'02c47db3a6c9ea2697c1e9a1',
	// Keyboard mash, no content
	'fb175a37c8a41c068649eda7',
])

/** Text that is never accepted in posts or comments. */
const BLOCKED: RegExp[] = [
	// Sites of the removed posts
	/myglobaldocument\.com/i,
	/jetpacglobal\.com/i,
	/\beterna\b/i,
	// Buying or selling identity documents
	/\b(fake|counterfeit|forged|novelty|camouflage|registered)\s+(eu\s+|uk\s+|us\s+)?(passports?|id\s*cards?|identity\s+cards?|driv(?:er'?s|ing)\s+licen[cs]es?|visas?|residence\s+permits?|documents?)/i,
	/\b(buy|purchase|order)\s+(an?\s+|your\s+)?(real\s+)?(eu\s+|uk\s+|us\s+|usa\s+|schengen\s+)?(passports?|id\s*cards?|driv(?:er'?s|ing)\s+licen[cs]es?|residence\s+permits?)\b/i,
	/\bpassports?[-\s]+(for\s+sale|online)\b/i,
	/how-to-buy-[a-z-]*passport/i,
]

/**
 * Links to other sites: self-advertising is not allowed, so posts and comments
 * with a web address (other than travsus.com) are refused and hidden.
 */
const LINK = /(https?:\/\/|www\.)[^\s)]+|\b[a-z0-9-]{2,}\.(com|net|org|io|co|app|shop|store|xyz|info|biz|me|ly|link|site|online)\b(\/\S*)?/gi
export const hasOutsideLink = (...texts: (string | null | undefined)[]) =>
	texts.some((text) => (text?.match(LINK) ?? []).some((link) => !/travsus\.com/i.test(link)))

export const isBlockedText = (...texts: (string | null | undefined)[]) =>
	texts.some((text) => !!text && BLOCKED.some((pattern) => pattern.test(text)))

/** Hidden from readers: taken down, or containing blocked text. */
export const isHiddenPost = (post: { id: string; title?: string; content?: string; excerpt?: string }) =>
	REMOVED_POST_IDS.has(post.id) || isBlockedText(post.title, post.content, post.excerpt) || hasOutsideLink(post.title, post.content, post.excerpt)

/** Why a post or comment is hidden, for the admin forum page ([] = shown). */
export function flagReasons(item: { id?: string; title?: string; content?: string }) {
	const reasons: string[] = []
	if (item.id && REMOVED_POST_IDS.has(item.id)) reasons.push('Taken down')
	if (isBlockedText(item.title, item.content)) reasons.push('Scam / illegal')
	if (hasOutsideLink(item.title, item.content)) reasons.push('Advertising link')
	return reasons
}
