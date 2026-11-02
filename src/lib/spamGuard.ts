// Spam guard for the public "request access" forms (affiliates, agencies).
// Bots are spotted by a hidden field only they fill, by how fast they send
// the form and by made-up text (random letters, gmail addresses full of
// dots); they get a fake "thanks" so they don't adapt, and nothing is saved
// or emailed. Fake emails (throwaway domains, domains that can't receive
// mail) and websites that don't exist or don't answer are refused with a
// message. Every one of these blocks the sender: their IP (30 days) and email
// (for good) get the fake "thanks" from then on, so nothing reaches us again.
import { promises as dns } from 'node:dns'
import type { NextRequest } from 'next/server'
import { db, T } from '@/lib/db'
import { HONEYPOT } from '@/lib/spamGuardFields'

/** A person needs at least this long to fill the form (ms since it was shown). */
const MIN_FILL_MS = 3000
/** Requests one visitor (IP) may send per day, per form. */
const PER_IP_PER_DAY = 3
/** How long a spammer's IP stays blocked (IPs get reused, emails don't). */
const IP_BLOCK_MS = 30 * 24 * 3600_000

/** Throwaway inboxes bots and fake sign-ups use. */
const DISPOSABLE = new Set([
	'10minutemail.com', '10minutemail.net', '20minutemail.com', '33mail.com', 'anonaddy.me', 'burnermail.io',
	'byom.de', 'dispostable.com', 'dropmail.me', 'emailondeck.com', 'fakeinbox.com', 'fakemail.net',
	'getairmail.com', 'getnada.com', 'grr.la', 'guerrillamail.biz', 'guerrillamail.com', 'guerrillamail.de',
	'guerrillamail.info', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamailblock.com', 'harakirimail.com',
	'inboxbear.com', 'incognitomail.org', 'jetable.org', 'mail.tm', 'mailcatch.com', 'maildrop.cc',
	'mailinator.com', 'mailinator.net', 'mailnesia.com', 'mailpoof.com', 'mailsac.com', 'mintemail.com',
	'moakt.com', 'mohmal.com', 'mytemp.email', 'nada.email', 'sharklasers.com', 'spam4.me', 'spambox.us',
	'spamgourmet.com', 'temp-mail.io', 'temp-mail.org', 'tempail.com', 'tempinbox.com', 'tempmail.com',
	'tempmail.dev', 'tempmail.net', 'tempmailo.com', 'tempr.email', 'throwawaymail.com', 'tmail.ws',
	'tmpmail.net', 'tmpmail.org', 'trashmail.com', 'trashmail.de', 'trashmail.net', 'yopmail.com',
	'yopmail.fr', 'yopmail.net', 'emailfake.com', 'fakemailgenerator.com', 'cuvox.de', 'armyspy.com',
	'dayrep.com', 'einrot.com', 'fleckens.hu', 'gustr.com', 'jourrapide.com', 'rhyta.com', 'superrito.com',
	'teleworm.us', 'mailto.plus', 'fexpost.com', 'fexbox.org', 'linshiyouxiang.net',
])

/** Big platforms: no need to look these up. */
const KNOWN_HOSTS = /(^|\.)(instagram\.com|youtube\.com|youtu\.be|tiktok\.com|facebook\.com|fb\.com|x\.com|twitter\.com|threads\.net|pinterest\.com|linkedin\.com|tripadvisor\.[a-z.]+|google\.[a-z.]+|linktr\.ee|medium\.com|substack\.com|wordpress\.com|blogspot\.com|wixsite\.com|gmail\.com|outlook\.com|hotmail\.com|yahoo\.com|icloud\.com)$/i

export type Verdict = 'ok' | 'bot' | 'blocked' | 'fake_email' | 'fake_website' | 'too_many'

/** The visitor's IP, from the proxy header when there is one. */
export const clientIp = (req: NextRequest) =>
	req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.ip || 'unknown'

/** Runs a DNS lookup with a time limit; a slow or broken lookup counts as "can't tell". */
async function lookup<R>(run: () => Promise<R>): Promise<R | 'none' | 'unknown'> {
	try {
		return await Promise.race([run(), new Promise<'unknown'>((ok) => setTimeout(() => ok('unknown'), 3000))])
	} catch (error: any) {
		// The domain doesn't exist or has no such record
		return error?.code === 'ENOTFOUND' || error?.code === 'ENODATA' ? 'none' : 'unknown'
	}
}

/**
 * True for text people don't write: random letters with no vowels
 * ("kjsvkjsvjk") or with the case flipping at random ("mfwMDDFETRgqzfdjdr").
 */
function madeUp(text: string) {
	return (text.match(/[a-z]+/gi) ?? []).some(
		(word) => (word.length >= 7 && !/[aeiouy]/i.test(word)) || (word.length >= 12 && (word.match(/[a-z][A-Z]/g) ?? []).length >= 3),
	)
}

/** Gmail ignores dots, so bots sprinkle them to reuse one inbox: "g.u.pig.i.to.hi73". */
function dottedGmail(email: string) {
	const [local, domain] = email.split('@')
	return (domain === 'gmail.com' || domain === 'googlemail.com') && (local.match(/\./g) ?? []).length >= 3
}

/** False when the email can't be real: a throwaway inbox, or a domain that can't receive mail. */
async function realEmail(email: string) {
	const domain = email.split('@')[1] ?? ''
	if (DISPOSABLE.has(domain)) return false
	if (KNOWN_HOSTS.test(domain)) return true
	const mx = await lookup(() => dns.resolveMx(domain))
	if (mx === 'unknown') return true
	return mx !== 'none' && mx.some((r) => r.exchange && r.exchange !== '.')
}

/**
 * False when the text links to a website that doesn't exist. Plain handles
 * ("@sara.travels") pass; more than 3 links is spam.
 */
async function realWebsite(text: string) {
	const hosts = (text.toLowerCase().replace(/(^|[\s/(])@[\w.]+/g, '$1').match(/(?:[a-z0-9-]+\.)+[a-z]{2,}/g) ?? []).map((host) => host.replace(/^www\./, ''))
	if (hosts.length > 3) return false
	for (const host of hosts) {
		if (KNOWN_HOSTS.test(host)) continue
		const found = await lookup(() => dns.lookup(host))
		if (found === 'none') return false
		if (!(await answers(host))) return false
	}
	return true
}

/** True when the website answers at all (any status: some sites refuse robots with a 403). */
async function answers(host: string) {
	for (const url of [`https://${host}/`, `http://${host}/`]) {
		try {
			await fetch(url, { method: 'GET', redirect: 'manual', signal: AbortSignal.timeout(5000), headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TravsusBot/1.0; +https://travsus.com)' } })
			return true
		} catch {
			// No answer, a broken certificate or too slow: try plain http, then give up
		}
	}
	return false
}

/** True when this IP (in the last 30 days) or email was caught spamming. */
async function isBlocked(ip: string, email: string) {
	const byEmail = await db.from(T.blocked).select('id').eq('email', email).limit(1)
	if (byEmail.data?.length) return true
	if (ip === 'unknown') return false
	const since = new Date(Date.now() - IP_BLOCK_MS).toISOString()
	const byIp = await db.from(T.blocked).select('id').eq('ip', ip).gte('created_at', since).limit(1)
	return !!byIp.data?.length
}

/** Remembers a spammer's IP and email; never fails the request. */
async function block(ip: string, email: string, reason: Verdict, form: string) {
	try {
		await db.from(T.blocked).insert({ ip: ip === 'unknown' ? null : ip, email: email || null, reason, form })
	} catch (error) {
		console.error('Spam block error:', error)
	}
}

/**
 * Checks one form request. `table` is where the form saves its requests
 * (rows carry the sender's `ip`), used to cap requests per visitor; `texts`
 * are the other things the sender typed (company, location...).
 * 'bot' and 'blocked' must get a fake "thanks"; the sender is blocked on
 * anything but 'ok' and 'too_many'.
 */
export async function checkRequest(
	req: NextRequest,
	body: Record<string, unknown>,
	{ table, email, website, texts = [] }: { table: string; email: string; website: string; texts?: string[] },
): Promise<Verdict> {
	const ip = clientIp(req)
	if (await isBlocked(ip, email)) return 'blocked'
	const verdict = await judge(body, ip, { table, email, website, texts })
	if (verdict !== 'ok' && verdict !== 'too_many') await block(ip, email, verdict, table)
	return verdict
}

async function judge(
	body: Record<string, unknown>,
	ip: string,
	{ table, email, website, texts }: { table: string; email: string; website: string; texts: string[] },
): Promise<Verdict> {
	if (String(body[HONEYPOT] ?? '').trim()) return 'bot'
	const elapsed = Number(body.elapsed)
	if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return 'bot'
	if (dottedGmail(email) || [website, ...texts].some(madeUp)) return 'bot'

	if (ip !== 'unknown') {
		const since = new Date(Date.now() - 24 * 3600_000).toISOString()
		const { count } = await db.from(table).select('id', { count: 'exact', head: true }).eq('ip', ip).gte('created_at', since)
		if ((count ?? 0) >= PER_IP_PER_DAY) return 'too_many'
	}

	const [emailOk, websiteOk] = await Promise.all([realEmail(email), website ? realWebsite(website) : true])
	if (!emailOk) return 'fake_email'
	if (!websiteOk) return 'fake_website'
	return 'ok'
}
