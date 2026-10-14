// Promo codes at checkout. A code is a TRAVSUS referral code: the booking gets
// the code's client discount (a % of the price) as a negative line item; the
// Stripe payment then follows the new total (see CheckoutPayment).
//   POST   { bookingId, code } → apply
//   DELETE { bookingId }       → remove
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must, touch } from '@/lib/db'
import { OPEN_STATES, PROMO_PREFIX, bookingTotal } from '@/lib/payments'
import getUserData from '../../user/getUserData'

export const dynamic = 'force-dynamic'

const isPromo = (item: any) => !!item?.promoCode || String(item?.description ?? '').startsWith(PROMO_PREFIX)
const fail = (code: string, status = 400) => NextResponse.json({ error: code }, { status })

/** The signed-in user's open booking, or an error response. */
async function openBooking(bookingId: unknown) {
	const user: any = await getUserData()
	if (!user?.id) return { error: fail('NOT_SIGNED_IN', 401) }
	if (typeof bookingId !== 'string' || !bookingId) return { error: fail('NO_BOOKING') }
	const booking = must(
		await db.from(T.bookings).select('id, lineItems, bookingState').match({ id: bookingId, customerId: user.id }).maybeSingle(),
	) as any
	if (!booking) return { error: fail('NO_BOOKING', 404) }
	if (!OPEN_STATES.includes(booking.bookingState)) return { error: fail('ALREADY_PAID', 409) }
	return { user, booking }
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json().catch(() => ({}))
		// Older pages sent only the code: the booking is then in the page address
		const bookingId = body.bookingId ?? new URL(req.headers.get('referer') || 'http://x').searchParams.get('bookingId')
		const { user, booking, error } = await openBooking(bookingId)
		if (error) return error

		const code = String(body.code ?? '').trim()
		if (!code || code.length > 60) return fail('INVALID_CODE')

		const lineItems: any[] = booking.lineItems ?? []
		if (lineItems.some(isPromo)) return fail('ALREADY_APPLIED')

		// Codes are matched without regard to capitals (they're shown in lowercase)
		const promo = must(
			await db
				.from(T.referralLinks)
				.select('userId, code, clientDiscount, maxUses, usedCount, startDate, endDate')
				.ilike('code', code.replace(/[\\%_]/g, '\\$&'))
				.maybeSingle(),
		) as any
		if (!promo || !(promo.clientDiscount > 0)) return fail('INVALID_CODE')
		if (promo.userId === user.id) return fail('OWN_CODE')
		const now = Date.now()
		if (promo.startDate && new Date(promo.startDate).getTime() > now) return fail('INVALID_CODE')
		if (promo.endDate && new Date(promo.endDate).getTime() < now) return fail('EXPIRED')
		if (promo.maxUses != null && (promo.usedCount ?? 0) >= promo.maxUses) return fail('USED_UP')

		const total = bookingTotal(lineItems)
		if (total <= 0) return fail('NOTHING_TO_DISCOUNT')
		// clientDiscount is a percentage; never below zero, rounded to cents
		const discount = Math.min(total, Math.round(total * promo.clientDiscount) / 100)

		const updated = must(
			await db
				.from(T.bookings)
				.update(
					touch({
						lineItems: [
							...lineItems,
							{
								description: `${PROMO_PREFIX} (${promo.code})`,
								promoCode: promo.code,
								promoPercent: promo.clientDiscount,
								unitPrice: -discount,
								totalPrice: -discount,
								totalGuests: 0,
								serviceQuantity: 1,
								includeInTotal: true,
								currency: 'EUR',
							},
						],
					}),
				)
				.eq('id', booking.id)
				.select('lineItems')
				.single(),
		) as any

		return NextResponse.json({ lineItems: updated.lineItems, code: promo.code, percent: promo.clientDiscount, discount })
	} catch (error) {
		console.error('Applying promo code failed:', error)
		return fail('SERVER_ERROR', 500)
	}
}

export async function DELETE(req: NextRequest) {
	try {
		const body = await req.json().catch(() => ({}))
		const { booking, error } = await openBooking(body.bookingId)
		if (error) return error
		const updated = must(
			await db
				.from(T.bookings)
				.update(touch({ lineItems: (booking.lineItems ?? []).filter((item: any) => !isPromo(item)) }))
				.eq('id', booking.id)
				.select('lineItems')
				.single(),
		) as any
		return NextResponse.json({ lineItems: updated.lineItems })
	} catch (error) {
		console.error('Removing promo code failed:', error)
		return fail('SERVER_ERROR', 500)
	}
}
