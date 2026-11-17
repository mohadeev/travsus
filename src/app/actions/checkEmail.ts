'use server'
// Checks an email address while the visitor types it (contact form and others):
// the format, a likely typo ("gmial.com"), and whether the domain can receive mail.
import { cleanEmail, hasEmailFormat, suggestEmail, type EmailProblem } from '@/lib/emailCheck'
import { domainReceivesMail } from '@/lib/emailDomain'

export type EmailCheck = { ok: boolean; email: string; problem?: EmailProblem; suggestion?: string | null; domain?: string }

export async function checkEmail(raw: string): Promise<EmailCheck> {
	const email = cleanEmail(String(raw ?? '').slice(0, 200))
	if (!hasEmailFormat(email)) return { ok: false, email, problem: 'format', suggestion: suggestEmail(email) }
	const domain = email.slice(email.lastIndexOf('@') + 1)
	const suggestion = suggestEmail(email)
	const mail = await domainReceivesMail(domain)
	if (mail === 'no_mail') return { ok: false, email, problem: 'no_mail', suggestion, domain }
	// The domain works, but it looks like a typo of a big provider: ask, don't block
	if (suggestion) return { ok: true, email, problem: 'typo', suggestion, domain }
	return { ok: true, email }
}
