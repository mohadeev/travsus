// Affiliate invitations. Server only.
//
// The owner invites someone from Admin → Emails; the email links to
// /{locale}/affiliates/invite/{token}. There the person signs in (or creates
// an account) and accepts: they become an accepted affiliate under their
// account's email, with a link code, and get the welcome email.
import 'server-only'
import { randomBytes } from 'node:crypto'
import { db, T, must } from '@/lib/db'
import { newCode, type Affiliate } from '@/lib/affiliates'
import { sendTemplate } from '@/lib/email/send'
import { SITE } from '@/lib/email/layout'
import { TIERS } from '@/app/[locale]/affiliates/tiers'

export type AffiliateInvite = {
	id: string
	token: string
	email: string
	name: string | null
	created_at: string
	accepted_at: string | null
	accepted_email: string | null
}

const TOKEN = /^[a-f0-9]{32}$/

/** The invitation link for a token */
export const inviteLink = (token: string, locale = 'en-US') => `${SITE}/${locale}/affiliates/invite/${token}`

/** An invitation for this person: the open one if they were already invited, otherwise a new one. */
export async function createInvite(email: string, name?: string): Promise<AffiliateInvite> {
	const address = email.toLowerCase()
	const open = must(await db.from(T.affiliateInvites).select('*').eq('email', address).is('accepted_at', null).maybeSingle()) as AffiliateInvite | null
	if (open) return open
	const token = randomBytes(16).toString('hex')
	return must(await db.from(T.affiliateInvites).insert({ token, email: address, name: name || null, accepted_at: null, accepted_email: null }).select('*').single()) as AffiliateInvite
}

export async function inviteByToken(token: unknown) {
	const value = String(token ?? '')
	if (!TOKEN.test(value)) return null
	return must(await db.from(T.affiliateInvites).select('*').eq('token', value).maybeSingle()) as AffiliateInvite | null
}

/**
 * Accept an invitation as the signed-in account (`email`). Makes that email an
 * accepted affiliate (keeping an existing code and commission) and sends the
 * welcome email. Accepting twice is harmless.
 */
export async function acceptInvite(invite: AffiliateInvite, email: string): Promise<Affiliate> {
	const address = email.toLowerCase()
	const now = new Date().toISOString()
	const existing = must(await db.from(T.affiliates).select('*').eq('email', address).maybeSingle()) as Affiliate | null
	let affiliate: Affiliate
	let welcome = false
	if (existing?.status === 'approved' && existing.code) affiliate = existing
	else if (existing) {
		affiliate = must(await db.from(T.affiliates).update({ status: 'approved', decided_at: now, code: existing.code || (await newCode()) }).eq('id', existing.id).select('*').single()) as Affiliate
		welcome = true
	} else {
		affiliate = must(
			await db
				.from(T.affiliates)
				.insert({ email: address, status: 'approved', code: await newCode(), rate: null, decided_at: now, note: `Accepted an invitation sent to ${invite.email}` })
				.select('*')
				.single(),
		) as Affiliate
		welcome = true
	}
	if (!invite.accepted_at) await db.from(T.affiliateInvites).update({ accepted_at: now, accepted_email: address }).eq('id', invite.id)

	if (welcome) {
		const tiers = `${TIERS[0].rate}% to ${TIERS[TIERS.length - 1].rate}%, growing with your bookings`
		const rate = affiliate.rate === null ? tiers : `${Number(affiliate.rate)}% on every booking`
		await sendTemplate('affiliate-approved', { to: address, data: { rate, link: `${SITE}/en-US?ref=${affiliate.code}` } })
	}
	return affiliate
}
