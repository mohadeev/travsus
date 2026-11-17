// Proves a visitor's email address really receives mail before a form is sent:
// a 6-digit code is emailed, and the form only goes through with that code.
// Stateless: the browser keeps a signed token (email + hashed code + expiry);
// the code itself never leaves the email.
import 'server-only'
import { createHmac, randomInt, timingSafeEqual } from 'node:crypto'

const TTL_MS = 15 * 60_000

const key = () => {
	const secret = process.env.EMAIL_CODE_SECRET || process.env.CRON_SECRET || process.env.CLERK_SECRET_KEY
	if (!secret) throw new Error('No secret for email codes')
	return secret
}
const sign = (payload: string) => createHmac('sha256', key()).update(payload).digest('base64url')

/** A new code and the token that goes with it. */
export function newEmailCode(email: string) {
	const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
	const expires = Date.now() + TTL_MS
	const payload = `${email.toLowerCase()}|${expires}`
	const token = `${expires}.${sign(`${payload}|${code}`)}`
	return { code, token }
}

/** 'ok', or why the code can't be accepted. */
export function checkEmailCode(email: string, code: string, token: string): 'ok' | 'expired' | 'wrong' {
	const [expiresText, mac] = String(token ?? '').split('.')
	const expires = Number(expiresText)
	if (!expires || !mac) return 'wrong'
	if (Date.now() > expires) return 'expired'
	const expected = sign(`${email.toLowerCase()}|${expires}|${String(code ?? '').replace(/\D/g, '')}`)
	const a = Buffer.from(expected)
	const b = Buffer.from(mac)
	return a.length === b.length && timingSafeEqual(a, b) ? 'ok' : 'wrong'
}
