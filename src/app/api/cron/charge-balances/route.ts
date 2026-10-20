// Book now, pay later: every morning, charges the balance of the deposits whose
// tour starts today (or earlier, if a charge was missed) to the saved card.
// Called by Vercel Cron (vercel.json) with "Authorization: Bearer <CRON_SECRET>".
// Success → the webhook (and this job) mark the booking paid. A refused card →
// 'balance_failed' and the customer gets an email with a link to pay.
export const dynamic = 'force-dynamic'
export const maxDuration = 60
import { NextResponse, type NextRequest } from 'next/server'
import stripe from '@/lib/stripe'
import { db, T, must, touch } from '@/lib/db'
import { CURRENCY, markBalanceFailed, markBookingPaid } from '@/lib/payments'

const MAX_PER_RUN = 50

export async function GET(request: NextRequest) {
	const secret = process.env.CRON_SECRET
	if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	const due: any[] = must(
		await db
			.from(T.bookings)
			.select(`id, tourId, balanceAmount, balanceAttempts, stripePaymentMethodId, customer:${T.users}!customerId(id, email, stripeCustomerId)`)
			.eq('bookingState', 'deposit_paid')
			.lte('balanceDueAt', new Date().toISOString())
			.order('balanceDueAt')
			.limit(MAX_PER_RUN),
	) ?? []

	const results: Record<string, string> = {}
	for (const booking of due) {
		const amount = Math.round((Number(booking.balanceAmount) || 0) * 100)
		const customer = booking.customer?.stripeCustomerId
		const paymentMethod = booking.stripePaymentMethodId
		if (amount < 50 || !customer || !paymentMethod) {
			// Nothing saved to charge: ask the customer to pay
			await markBalanceFailed(booking.id, 'No saved card')
			results[booking.id] = 'no_card'
			continue
		}

		const attempt = (booking.balanceAttempts ?? 0) + 1
		must(await db.from(T.bookings).update(touch({ balanceAttempts: attempt })).eq('id', booking.id))
		try {
			const intent = await stripe.paymentIntents.create(
				{
					amount,
					currency: CURRENCY,
					customer,
					payment_method: paymentMethod,
					off_session: true,
					confirm: true,
					description: `TRAVSUS booking ${booking.id} (balance)`,
					receipt_email: booking.customer?.email ?? undefined,
					metadata: { bookingId: booking.id, serviceId: booking.tourId, customerId: booking.customer?.id ?? '', plan: 'balance' },
				},
				// The same attempt can never charge twice, even if the job runs again
				{ idempotencyKey: `balance-${booking.id}-${attempt}` },
			)
			must(await db.from(T.bookings).update(touch({ balancePaymentIntentId: intent.id })).eq('id', booking.id))
			if (intent.status === 'succeeded') {
				await markBookingPaid(intent, { email: false })
				results[booking.id] = 'paid'
			} else {
				// Needs the customer (e.g. 3-D Secure): they pay from the email link
				await markBalanceFailed(booking.id, 'Your bank asked for confirmation')
				results[booking.id] = intent.status
			}
		} catch (error: any) {
			console.error('Balance charge failed:', booking.id, error?.code, error?.message)
			await markBalanceFailed(booking.id, error?.raw?.message || error?.message)
			results[booking.id] = error?.code || 'failed'
		}
	}

	return NextResponse.json({ checked: due.length, results })
}
