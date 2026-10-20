// Starts payment on Stripe's own checkout page for one booking.
// POST { locale, plan } → { url } (the browser goes there). plan: 'full' (default),
// 'deposit' (book now, pay later: €20 now, card saved for the tour-day balance)
// or 'balance' (pay what is left after a deposit, e.g. when the tour-day charge failed). The amount is always
// worked out here from the booking in the database, never from the browser.
// Stripe sends the customer back to /pay-done/payment; the booking is marked
// paid by the webhook (payment_intent.succeeded) or by that page, whichever
// comes first.
export const dynamic = 'force-dynamic'
import { NextResponse, type NextRequest } from 'next/server'
import stripe from '@/lib/stripe'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must, touch } from '@/lib/db'
import { BALANCE_STATES, CURRENCY, OPEN_STATES, amountToCharge, bookingTotal, isTestAccount, stripeCustomerFor } from '@/lib/payments'
import { DEPOSIT_EUR, balanceAfterDeposit, balanceDueAt, depositAvailable } from '@/lib/payLater'
import { routing } from '@/i18n/routing'
import { readTripDates } from '@/lib/tripDates'
import { creditBooking, REF_COOKIE } from '@/lib/affiliates'

// Stripe's checkout languages for our site languages
const STRIPE_LOCALES: Record<string, string> = { 'en-US': 'en', 'de-DE': 'de', 'es-ES': 'es', 'fr-FR': 'fr', 'it-IT': 'it', 'ja-JP': 'ja', 'ko-KR': 'ko', 'pt-PT': 'pt', 'ru-RU': 'ru', 'zh-CN': 'zh' }

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
	const user: any = await getUserData()
	if (!user?.id) return NextResponse.json({ error: 'NOT_SIGNED_IN' }, { status: 401 })

	const body = await request.json().catch(() => ({}))
	const locale = (routing.locales as readonly string[]).includes(body.locale) ? body.locale : routing.defaultLocale
	const plan: 'full' | 'deposit' | 'balance' = ['deposit', 'balance'].includes(body.plan) ? body.plan : 'full'

	const booking: any = must(
		await db
			.from(T.bookings)
			.select(`id, tourId, lineItems, bookingState, paymentIntentId, selectedDate, paymentPlan, balanceAmount, tour:${T.tours}(name, images, translations)`)
			.match({ id: params.id, customerId: user.id })
			.maybeSingle(),
	)
	if (!booking) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
	// Full price or deposit: only unpaid bookings. Balance: only after a deposit.
	const allowed = plan === 'balance' ? BALANCE_STATES : OPEN_STATES
	if (!allowed.includes(booking.bookingState)) return NextResponse.json({ error: 'ALREADY_PAID' }, { status: 409 })
	const total = bookingTotal(booking.lineItems)
	if (plan === 'deposit' && !depositAvailable(total, booking.selectedDate)) return NextResponse.json({ error: 'DEPOSIT_UNAVAILABLE' }, { status: 400 })

	// Booked before following an affiliate's link: credit it now (no-op if already credited)
	await creditBooking(booking.id, user.email, request.cookies.get(REF_COOKIE)?.value)

	const balance = Number(booking.balanceAmount) || balanceAfterDeposit(total)
	const amount =
		plan === 'full'
			? amountToCharge(booking.lineItems, user.email)
			: isTestAccount(user.email)
				? 55 // internal test accounts pay a symbolic amount
				: Math.round((plan === 'deposit' ? DEPOSIT_EUR : balance) * 100)
	if (amount < 50) return NextResponse.json({ error: 'NOTHING_TO_PAY' }, { status: 400 })

	try {
		// Only one open Stripe page per booking: an older one is closed first,
		// so the same trip can never be paid twice from two tabs
		const previous = booking.paymentIntentId
		if (typeof previous === 'string' && previous.startsWith('cs_')) {
			const old = await stripe.checkout.sessions.retrieve(previous).catch(() => null)
			if (old?.payment_status === 'paid') return NextResponse.json({ error: 'ALREADY_PAID' }, { status: 409 })
			if (old?.status === 'open') await stripe.checkout.sessions.expire(previous).catch(() => null)
		}

		const tourName =
			(booking.tour?.translations ?? []).find((t: any) => t.language === locale)?.name || booking.tour?.name || 'TRAVSUS tour'
		const [start, end] = readTripDates(booking.selectedDate)
		const dates = start
			? [start, end]
					.filter(Boolean)
					// Stored as the visitor's local midnight: noon UTC of that moment is the right day anywhere
					.map((d) => new Date((d as Date).getTime() + 12 * 3600_000).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }))
					.filter((v, i, a) => a.indexOf(v) === i)
					.join(' – ')
			: undefined
		const image = booking.tour?.images?.[0]?.url
		const origin = request.nextUrl.origin
		const metadata = { bookingId: booking.id, serviceId: booking.tourId, customerId: user.id, plan }
		const dueAt = balanceDueAt(booking.selectedDate)
		const money = (n: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(n)
		const dueDay = dueAt ? dueAt.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : ''
		const depositBalance = balanceAfterDeposit(total)

		const session = await stripe.checkout.sessions.create({
			mode: 'payment',
			customer: await stripeCustomerFor(user),
			locale: (STRIPE_LOCALES[locale] ?? 'auto') as any,
			line_items: [
				{
					quantity: 1,
					price_data: {
						currency: CURRENCY,
						unit_amount: amount,
						product_data: {
							name: `${plan === 'deposit' ? 'Deposit: ' : plan === 'balance' ? 'Balance: ' : ''}${tourName}`.slice(0, 250),
							...(dates ? { description: dates } : {}),
							...(image?.startsWith('https://') ? { images: [image] } : {}),
						},
					},
				},
			],
			// The webhook marks the booking paid from the payment's metadata. A deposit
			// also saves the card, so the balance can be charged on the tour day.
			payment_intent_data: {
				metadata,
				description: `TRAVSUS booking ${booking.id}${plan === 'full' ? '' : ` (${plan})`}`,
				receipt_email: user.email,
				...(plan === 'deposit' ? { setup_future_usage: 'off_session' as const } : {}),
			},
			...(plan === 'deposit'
				? {
						custom_text: {
							submit: {
								// The customer's agreement to the tour-day charge, shown above the pay button
								message: `You pay ${money(DEPOSIT_EUR)} now. The remaining ${money(depositBalance)} will be charged automatically to this card on ${dueDay}, the first day of your tour. Free cancellation up to 24 hours before.`,
							},
						},
					}
				: {}),
			metadata,
			client_reference_id: booking.id,
			success_url: `${origin}/${locale}/pay-done/payment?bookingId=${booking.id}`,
			cancel_url: `${origin}/${locale}/checkout/checkout?bookingId=${booking.id}&serviceId=${booking.tourId}`,
			expires_at: Math.floor(Date.now() / 1000) + 60 * 60, // the page stays valid for 1 hour
		})

		// The plan is stored with the booking; for a balance the deposit details stay as they are
		const planFields =
			plan === 'deposit'
				? { paymentPlan: 'deposit', depositAmount: DEPOSIT_EUR, balanceAmount: depositBalance, balanceDueAt: dueAt?.toISOString() ?? null }
				: plan === 'full'
					? { paymentPlan: 'full', depositAmount: null, balanceAmount: null, balanceDueAt: null }
					: {}
		must(await db.from(T.bookings).update(touch({ paymentIntentId: session.id, ...planFields })).eq('id', booking.id))
		return NextResponse.json({ url: session.url })
	} catch (error: any) {
		console.error('Stripe checkout failed:', error?.type, error?.code, error?.message)
		// A key problem is ours, not the customer's: say so plainly
		const code = error?.type === 'StripeAuthenticationError' ? 'PAYMENTS_UNAVAILABLE' : 'STRIPE_ERROR'
		return NextResponse.json({ error: code }, { status: 502 })
	}
}
