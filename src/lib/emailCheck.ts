// Email address checks that run in the browser as well as on the server:
// the format, and common typos in the domain ("gmial.com" → "gmail.com").
// Whether the domain can receive mail at all is checked on the server
// (src/app/actions/checkEmail.ts), since it needs a DNS lookup.

/** The big mailbox providers our travellers use; a domain close to one of these is probably a typo. */
const COMMON_DOMAINS = [
	'gmail.com', 'googlemail.com', 'yahoo.com', 'ymail.com', 'hotmail.com', 'outlook.com', 'live.com', 'msn.com',
	'icloud.com', 'me.com', 'mac.com', 'aol.com', 'protonmail.com', 'proton.me', 'gmx.com', 'gmx.net', 'gmx.de',
	'web.de', 't-online.de', 'freenet.de', 'yahoo.de', 'hotmail.de', 'outlook.de',
	'yahoo.fr', 'hotmail.fr', 'outlook.fr', 'live.fr', 'orange.fr', 'free.fr', 'sfr.fr', 'laposte.net', 'wanadoo.fr',
	'yahoo.es', 'hotmail.es', 'outlook.es', 'telefonica.net', 'yahoo.it', 'hotmail.it', 'libero.it', 'virgilio.it', 'tiscali.it',
	'sapo.pt', 'yahoo.co.uk', 'hotmail.co.uk', 'btinternet.com', 'sky.com', 'comcast.net', 'verizon.net', 'att.net',
	'mail.ru', 'yandex.ru', 'yandex.com', 'naver.com', 'daum.net', 'qq.com', '163.com', '126.com', 'yahoo.co.jp',
]

/** Domains that look like typos but are real (never "corrected"). */
const KNOWN_REAL = new Set(['outlook.be', 'hotmail.be', 'live.be', 'outlook.at', 'hotmail.ca', 'outlook.com.au', 'gmx.at', 'gmx.ch', 'live.co.uk', 'live.nl', 'hotmail.nl', 'outlook.it', 'yahoo.ca', 'yahoo.com.au'])

const FORMAT = /^[^\s@"(),:;<>[\]\\]+@[^\s@"(),:;<>[\]\\]+\.[a-z]{2,}$/i

export type EmailProblem = 'format' | 'typo' | 'no_mail'

/** Normalizes what people paste: spaces, trailing dots, capitals in the domain. */
export function cleanEmail(raw: string) {
	const email = raw.trim().replace(/\s+/g, '').replace(/\.+$/, '')
	const at = email.lastIndexOf('@')
	return at < 0 ? email : email.slice(0, at) + '@' + email.slice(at + 1).toLowerCase()
}

export const hasEmailFormat = (email: string) => FORMAT.test(email) && !email.includes('..') && email.length <= 160

/** Damerau-Levenshtein distance (letters swapped count as one typo). */
function distance(a: string, b: string) {
	const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
	for (let j = 1; j <= b.length; j++) d[0][j] = j
	for (let i = 1; i <= a.length; i++) {
		for (let j = 1; j <= b.length; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1
			d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
			if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
		}
	}
	return d[a.length][b.length]
}

/** "maria@gmial.com" → "maria@gmail.com"; null when the domain looks fine. */
export function suggestEmail(raw: string): string | null {
	const email = cleanEmail(raw)
	const at = email.lastIndexOf('@')
	if (at < 1) return null
	const local = email.slice(0, at)
	let domain = email.slice(at + 1)
	if (!domain || COMMON_DOMAINS.includes(domain) || KNOWN_REAL.has(domain)) return null
	// "gmailcom" → "gmail.com"
	if (!domain.includes('.')) {
		const dotted = COMMON_DOMAINS.find((d) => d.replace(/\./g, '') === domain)
		if (dotted) return `${local}@${dotted}`
	}
	domain = domain.replace(/\.(con|cpm|cim|vom|xom|comm|om|co m)$/, '.com')
	if (COMMON_DOMAINS.includes(domain)) return `${local}@${domain}`
	let best: { domain: string; d: number } | null = null
	for (const candidate of COMMON_DOMAINS) {
		const d = distance(domain, candidate)
		if (d > 0 && d <= (candidate.length > 8 ? 2 : 1) && (!best || d < best.d)) best = { domain: candidate, d }
	}
	return best ? `${local}@${best.domain}` : null
}
