// Booking prices and Stripe payments. Server only: amounts are always
// calculated here from the database, never taken from the browser.
import type Stripe from 'stripe'
import stripe from '@/lib/stripe'
import { db, T, must, touch } from '@/lib/db'
import { updateLineItemsLogic } from '@/app/api/updateLineItems/updateLineItemsLogic'
import { sendBookingConfirmed } from '@/lib/email/booking'

export const CURRENCY = 'eur'
export const PROMO_PREFIX = 'Promo Code Applied'

/** Bookings in these states can still be changed and paid. */
export const OPEN_STATES = ['initiated', 'payment_failed']

// Internal test accounts pay a symbolic €0.55 (kept from the previous checkout)
const TEST_PAYMENT_EMAILS = ['skendoulmohamed@gmail.com']
export const isTestAccount = (email?: string | null) => {
	const value = (email ?? '').toLowerCase()
	return TEST_PAYMENT_EMAILS.includes(value) || value.endsWith('@travsus.com')
}

/** Sum of the line items that count towards the total, in euros. */
export const bookingTotal = (lineItems: any[] = []) =>
	lineItems
		.filter((item) => item?.includeInTotal === true)
		.reduce((sum, item) => sum + (item?.totalPrice || 0), 0)

/** Amount to charge, in cents. */
export const amountToCharge = (lineItems: any[], email?: string | null) =>
	isTestAccount(email) ? 55 : Math.round(bookingTotal(lineItems) * 100)

/**
 * Prices a booking for a tour from the guests / accommodation chosen.
 * Same logic as the tour page sidebar, but run on the server.
 */
export async function priceBooking(
	tour: any,
	choice: { guests?: any; accommodation?: any; bookOwnHotels?: boolean },
) {
	const hasAccommodation =
		choice.accommodation && Object.keys(choice.accommodation).length > 0
	const result = await updateLineItemsLogic({
		tour,
		body: hasAccommodation
			? { accommodation: choice.accommodation }
			: choice.guests
				? { guests: choice.guests }
				: {},
	})
	// "I've booked my own hotels": accommodation is listed but not charged
	const lineItems = (result.lineItems ?? []).map((item: any) =>
		choice.bookOwnHotels && item.description === 'accommodation'
			? { ...item, includeInTotal: false }
			: item,
	)
	return {
		lineItems,
		guests: result.guests,
		accommodation: result.accommodation,
	}
}

/** The user's Stripe customer id, created on first payment. */
export async function stripeCustomerFor(user: { id: string; email: string }) {
	const row = must(
		await db.from(T.users).select('stripeCustomerId').eq('id', user.id).maybeSingle(),
	)
	// Reuse the saved customer while it still exists in this Stripe account
	// (a key from another account or mode, or a deleted customer, starts fresh)
	if (row?.stripeCustomerId) {
		const existing = await stripe.customers.retrieve(row.stripeCustomerId).catch(() => null)
		if (existing && !(existing as any).deleted) return row.stripeCustomerId as string
	}

	const customer = await stripe.customers.create({
		email: user.email,
		metadata: { userId: user.id },
	})
	must(
		await db
			.from(T.users)
			.update(touch({ stripeCustomerId: customer.id }))
			.eq('id', user.id),
	)
	return customer.id
}

const addState = (booking: any, state: string) => {
	const now = new Date().toISOString()
	return {
		bookingState: state,
		bookingStates: [
			...(booking.bookingStates ?? []),
			{ state, createdAt: now, updatedAt: now, by: 'stripe' },
		],
	}
}

/**
 * Records a successful payment: marks the booking paid and sends the
 * confirmation email. Safe to call many times (webhook + return page).
 */
export async function markBookingPaid(paymentIntent: Stripe.PaymentIntent) {
	const bookingId = paymentIntent.metadata?.bookingId
	if (!bookingId || paymentIntent.status !== 'succeeded') return null

	const current = must(
		await db
			.from(T.bookings)
			.select('bookingState, bookingStates')
			.eq('id', bookingId)
			.maybeSingle(),
	)
	if (!current) return null
	if (current.bookingState === 'paid') return 'already_paid'

	// The "not yet paid" condition makes this switch happen once, even if
	// the webhook and the return page arrive at the same moment
	const updated = must(
		await db
			.from(T.bookings)
			.update(touch({ ...addState(current, 'paid'), paymentIntentId: paymentIntent.id }))
			.eq('id', bookingId)
			.neq('bookingState', 'paid')
			.select('id'),
	)
	if (!updated?.length) return 'already_paid'

	// A promo code used for this booking counts as one use of the code
	try {
		const paid: any = must(await db.from(T.bookings).select('lineItems').eq('id', bookingId).maybeSingle())
		const code = (paid?.lineItems ?? []).find((item: any) => item?.promoCode)?.promoCode
		if (code) {
			const link: any = must(await db.from(T.referralLinks).select('id, usedCount').eq('code', code).maybeSingle())
			if (link) must(await db.from(T.referralLinks).update(touch({ usedCount: (link.usedCount ?? 0) + 1 })).eq('id', link.id))
		}
	} catch (error) {
		console.error('Promo code use count failed:', error)
	}

	// Confirmation with the PDF to the customer, and a notice to the team
	await sendBookingConfirmed(bookingId)
	return 'paid'
}

/** Records a failed payment so the customer can try again. */
export async function markPaymentFailed(paymentIntent: Stripe.PaymentIntent) {
	const bookingId = paymentIntent.metadata?.bookingId
	if (!bookingId) return
	const booking = must(
		await db
			.from(T.bookings)
			.select('bookingState, bookingStates')
			.eq('id', bookingId)
			.maybeSingle(),
	)
	if (!booking || booking.bookingState === 'paid') return
	must(
		await db
			.from(T.bookings)
			.update(touch(addState(booking, 'payment_failed')))
			.eq('id', bookingId),
	)
}
