// Affiliate program. Server only.
//
// An accepted affiliate has a code. Any link with ?ref=CODE counts a click and
// leaves a cookie for 60 days; a booking made with that cookie is credited to
// the affiliate (never their own bookings).
//
// A booking is credited when it's made, or when it's paid (booked first,
// clicked the link later), whichever comes first with the cookie present.
//
// Earnings: commission on referred bookings as soon as they're paid (the trip
// can still be ahead). The rate is the affiliate's custom rate, or the
// standard tiers of the affiliates page by the booking's rank (10% for the
// 1st–10th paid booking, 12% from the 11th…). Cancelled or refunded bookings
// earn nothing. Balance = earned − paid out.
import 'server-only'
import { randomBytes } from 'node:crypto'
import { db, T, must } from '@/lib/db'
import { bookingTotal, CLOSED_STATES, PAID_STATES } from '@/lib/dashboard'
import { readTripDates } from '@/lib/tripDates'
import { TIERS } from '@/app/[locale]/affiliates/tiers'

export const REF_COOKIE = 'travsus_ref'
export const REF_DAYS = 60
export const MIN_PAYOUT = 50 // euros, as promised on the affiliates page
export const CODE = /^[a-z0-9-]{3,24}$/

export type Affiliate = {
	id: string
	email: string
	code: string | null
	status: 'pending' | 'approved' | 'declined'
	rate: number | string | null
	created_at: string
	decided_at: string | null
}

/** The accepted affiliate with this code, or null. */
export async function affiliateByCode(code: unknown) {
	const value = String(code ?? '').toLowerCase()
	if (!CODE.test(value)) return null
	return must(await db.from(T.affiliates).select('*').eq('code', value).eq('status', 'approved').maybeSingle()) as Affiliate | null
}

/** The accepted affiliate for this email (the signed-in user's), or null. */
export async function affiliateByEmail(email?: string | null) {
	if (!email) return null
	return must(await db.from(T.affiliates).select('*').eq('email', email.toLowerCase()).eq('status', 'approved').maybeSingle()) as Affiliate | null
}

/** A new random code like "k4x9qm" (letters and digits, no look-alikes). */
export async function newCode() {
	const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789'
	for (let attempt = 0; attempt < 10; attempt++) {
		const code = Array.from(randomBytes(6), (b) => alphabet[b % alphabet.length]).join('')
		const taken = must(await db.from(T.affiliates).select('id').eq('code', code).maybeSingle())
		if (!taken) return code
	}
	throw new Error('Could not create an affiliate code')
}

/** Credit a booking to the affiliate of the visitor's cookie (if any, and not already credited). Never throws. */
export async function creditBooking(bookingId: string, customerEmail: string | undefined, refCookie: string | undefined) {
	try {
		const affiliate = await affiliateByCode(refCookie)
		if (!affiliate || affiliate.email === customerEmail?.toLowerCase()) return
		await db.from(T.affiliateReferrals).upsert({ booking_id: bookingId, affiliate_id: affiliate.id }, { onConflict: 'booking_id', ignoreDuplicates: true })
	} catch (error) {
		console.error('Affiliate credit failed:', error)
	}
}

const tierRate = (rank: number) => [...TIERS].reverse().find((t) => rank >= t.from)?.rate ?? TIERS[0].rate
const cents = (n: number) => Math.round(n * 100) / 100

export type ReferralStatus = 'earned' | 'unpaid' | 'cancelled'

/** Everything the affiliate page (and the admin) shows for one affiliate. */
export async function affiliateReport(affiliate: Affiliate) {
	const since30 = new Date(Date.now() - 30 * 86400_000).toISOString()
	const [clicksTotal, clicks30, referrals, payouts] = await Promise.all([
		db.from(T.affiliateClicks).select('id', { count: 'exact', head: true }).eq('affiliate_id', affiliate.id),
		db.from(T.affiliateClicks).select('id', { count: 'exact', head: true }).eq('affiliate_id', affiliate.id).gte('created_at', since30),
		db.from(T.affiliateReferrals).select('booking_id, created_at').eq('affiliate_id', affiliate.id),
		db.from(T.affiliatePayouts).select('id, amount, paid_at, note').eq('affiliate_id', affiliate.id).order('paid_at', { ascending: false }),
	])
	const ids = ((must(referrals) ?? []) as any[]).map((r) => r.booking_id)
	const bookings = ids.length
		? ((must(
				await db
					.from(T.bookings)
					.select(`id, bookingState, bookingStates, selectedDate, lineItems, createdAt, updatedAt, tour:${T.tours}(id, name)`)
					.in('id', ids),
			) ?? []) as any[])
		: []
	const payoutRows = ((must(payouts) ?? []) as any[]).map((p) => ({ ...p, amount: Number(p.amount) }))
	return buildReport(affiliate, bookings, { total: clicksTotal.count ?? 0, last30: clicks30.count ?? 0 }, payoutRows)
}
export type AffiliateReport = ReturnType<typeof buildReport>
type Payout = { id: string; amount: number; paid_at: string; note: string | null }

/** The numbers from the affiliate's referred bookings (no database access). */
export function buildReport(affiliate: Pick<Affiliate, 'code' | 'rate'>, bookings: any[], clicks: { total: number; last30: number }, payoutRows: Payout[], now = new Date()) {
	const today = new Date(now)
	today.setHours(0, 0, 0, 0)
	const rows = bookings.map((b) => {
		const paid = PAID_STATES.includes(b.bookingState)
		const closed = CLOSED_STATES.includes(b.bookingState)
		const [start, end] = readTripDates(b.selectedDate)
		const paidAt: string | null = paid ? ((b.bookingStates ?? []).find((s: any) => PAID_STATES.includes(s?.state))?.createdAt ?? b.updatedAt) : null
		const status: ReferralStatus = closed ? 'cancelled' : paid ? 'earned' : 'unpaid'
		const upcoming = !!start && (end ?? start)! >= today
		return { id: b.id as string, tour: (b.tour?.name?.trim() || 'Tour') as string, bookedAt: b.createdAt as string, paidAt, start: start?.toISOString() ?? null, upcoming, value: bookingTotal(b.lineItems), status, rate: 0, commission: 0 }
	})

	// Rank of each paid booking (by payment date) decides its tier
	const custom = affiliate.rate === null ? null : Number(affiliate.rate)
	rows
		.filter((r) => r.paidAt && r.status !== 'cancelled')
		.sort((a, b) => a.paidAt!.localeCompare(b.paidAt!))
		.forEach((r, i) => {
			r.rate = custom ?? tierRate(i + 1)
			r.commission = cents((r.value * r.rate) / 100)
		})

	const sum = (status: ReferralStatus) => cents(rows.filter((r) => r.status === status).reduce((s, r) => s + r.commission, 0))
	const paidBookings = rows.filter((r) => r.status === 'earned').length
	const paidOut = cents(payoutRows.reduce((s, p) => s + p.amount, 0))
	const earned = sum('earned')
	// The next better tier, and how many more paid bookings until the rate reaches it
	const next = custom === null ? TIERS.find((t) => t.from > paidBookings + 1) ?? null : null

	return {
		code: affiliate.code,
		customRate: custom,
		currentRate: custom ?? tierRate(paidBookings + 1),
		nextTier: next ? { rate: next.rate, bookingsToGo: next.from - 1 - paidBookings } : null,
		clicks,
		bookingsCount: paidBookings,
		earned,
		// Of the earned amount, the part for trips still to come (shown for information)
		upcoming: cents(rows.filter((r) => r.status === 'earned' && r.upcoming).reduce((s, r) => s + r.commission, 0)),
		paidOut,
		balance: cents(earned - paidOut),
		referrals: rows.sort((a, b) => b.bookedAt.localeCompare(a.bookedAt)),
		payouts: payoutRows,
	}
}

/** The numbers the admin list shows per affiliate */
export const affiliateSummary = (r: AffiliateReport) => ({
	clicks: r.clicks.total,
	bookings: r.bookingsCount,
	upcoming: r.upcoming,
	earned: r.earned,
	paidOut: r.paidOut,
	balance: r.balance,
})
export type AffiliateSummary = ReturnType<typeof affiliateSummary>
