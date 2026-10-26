// Affiliate invitations. Server only.
//
// The owner invites someone from Admin → Emails; the email links to
// /{locale}/affiliates/invite/{token}. One click on "Accept" makes the invited
// email an accepted affiliate (the link was sent to that inbox, so no account
// is needed): they get their link right away and the welcome email, and the
// owner is told by email. Creating
// an account with that email then shows their earnings in the affiliate area.
import 'server-only'
import { randomBytes } from 'node:crypto'
import { db, T, must } from '@/lib/db'
import { newCode, type Affiliate } from '@/lib/affiliates'
import { sendTemplate } from '@/lib/email/send'
import { SITE } from '@/lib/email/layout'
import { TIERS } from '@/app/[locale]/affiliates/tiers'
import { OWNER_EMAIL } from '@/lib/admin/owner'

export type AffiliateInvite = {
	id: string
	token: string
	email: string
	name: string | null
	created_at: string
	accepted_at: string | null
	accepted_email: string | null
	/** How many times the email went out, and when last (older invitations: unknown) */
	sends?: number
	last_sent_at?: string | null
	message?: string | null
}

/** Records one more successful send of an invitation (for the history in Admin → Affiliates). */
export async function inviteSent(invite: AffiliateInvite, message: string) {
	await db
		.from(T.affiliateInvites)
		.update({ sends: (invite.sends ?? 0) + 1, last_sent_at: new Date().toISOString(), message: message || null })
		.eq('id', invite.id)
}

/** Every invitation, newest first (Admin → Affiliates → Invitations). */
export async function listInvites() {
	return (must(await db.from(T.affiliateInvites).select('*').order('created_at', { ascending: false }).limit(1000)) ?? []) as AffiliateInvite[]
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

/** Their personal link to share */
export const affiliateLink = (code: string, locale = 'en-US') => `${SITE}/${locale}?ref=${code}`

/** The affiliate an accepted invitation made, or null */
export async function inviteAffiliate(invite: AffiliateInvite) {
	if (!invite.accepted_at) return null
	return must(await db.from(T.affiliates).select('*').eq('email', invite.accepted_email || invite.email).eq('status', 'approved').maybeSingle()) as Affiliate | null
}

/**
 * Accept an invitation: makes the invited email an accepted affiliate
 * (keeping an existing code and commission) and sends the welcome email.
 * Accepting twice is harmless.
 */
export async function acceptInvite(invite: AffiliateInvite): Promise<Affiliate> {
	const address = invite.email
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
				.insert({ email: address, status: 'approved', code: await newCode(), rate: null, decided_at: now, note: 'Accepted an invitation' })
				.select('*')
				.single(),
		) as Affiliate
		welcome = true
	}
	if (!invite.accepted_at) await db.from(T.affiliateInvites).update({ accepted_at: now, accepted_email: address }).eq('id', invite.id)

	if (welcome) {
		const tiers = `${TIERS[0].rate}% to ${TIERS[TIERS.length - 1].rate}%, growing with your bookings`
		const rate = affiliate.rate === null ? tiers : `${Number(affiliate.rate)}% on every booking`
		await sendTemplate('affiliate-approved', { to: address, data: { rate, link: affiliateLink(affiliate.code!) } })
	}
	// Tell the owner, the first time this invitation is accepted
	if (!invite.accepted_at) {
		await sendTemplate('affiliate-invite-accepted-team', {
			to: OWNER_EMAIL,
			data: { email: address, name: invite.name ?? undefined, code: affiliate.code!, link: affiliateLink(affiliate.code!), invitedAt: invite.created_at },
		})
	}
	return affiliate
}
