// Starts payment on Stripe's own checkout page for one booking.
// POST { locale } → { url } (the browser goes there). The amount is always
// worked out here from the booking in the database, never from the browser.
// Stripe sends the customer back to /pay-done/payment; the booking is marked
// paid by the webhook (payment_intent.succeeded) or by that page, whichever
// comes first.
export const dynamic = 'force-dynamic'
import { NextResponse, type NextRequest } from 'next/server'
import stripe from '@/lib/stripe'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must, touch } from '@/lib/db'
import { CURRENCY, OPEN_STATES, amountToCharge, stripeCustomerFor } from '@/lib/payments'
import { routing } from '@/i18n/routing'
import { readTripDates } from '@/lib/tripDates'

// Stripe's checkout languages for our site languages
const STRIPE_LOCALES: Record<string, string> = { 'en-US': 'en', 'de-DE': 'de', 'es-ES': 'es', 'fr-FR': 'fr', 'it-IT': 'it', 'ja-JP': 'ja', 'ko-KR': 'ko', 'pt-PT': 'pt', 'ru-RU': 'ru', 'zh-CN': 'zh' }

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
	const user: any = await getUserData()
	if (!user?.id) return NextResponse.json({ error: 'NOT_SIGNED_IN' }, { status: 401 })

	const body = await request.json().catch(() => ({}))
	const locale = (routing.locales as readonly string[]).includes(body.locale) ? body.locale : routing.defaultLocale

	const booking: any = must(
		await db
			.from(T.bookings)
			.select(`id, tourId, lineItems, bookingState, paymentIntentId, selectedDate, tour:${T.tours}(name, images, translations)`)
			.match({ id: params.id, customerId: user.id })
			.maybeSingle(),
	)
	if (!booking) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
	if (!OPEN_STATES.includes(booking.bookingState)) return NextResponse.json({ error: 'ALREADY_PAID' }, { status: 409 })

	const amount = amountToCharge(booking.lineItems, user.email)
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
		const metadata = { bookingId: booking.id, serviceId: booking.tourId, customerId: user.id }

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
							name: tourName.slice(0, 250),
							...(dates ? { description: dates } : {}),
							...(image?.startsWith('https://') ? { images: [image] } : {}),
						},
					},
				},
			],
			// The webhook marks the booking paid from the payment's metadata
			payment_intent_data: { metadata, description: `TRAVSUS booking ${booking.id}`, receipt_email: user.email },
			metadata,
			client_reference_id: booking.id,
			success_url: `${origin}/${locale}/pay-done/payment?bookingId=${booking.id}`,
			cancel_url: `${origin}/${locale}/checkout/checkout?bookingId=${booking.id}&serviceId=${booking.tourId}`,
			expires_at: Math.floor(Date.now() / 1000) + 60 * 60, // the page stays valid for 1 hour
		})

		must(await db.from(T.bookings).update(touch({ paymentIntentId: session.id })).eq('id', booking.id))
		return NextResponse.json({ url: session.url })
	} catch (error: any) {
		console.error('Stripe checkout failed:', error?.type, error?.code, error?.message)
		// A key problem is ours, not the customer's: say so plainly
		const code = error?.type === 'StripeAuthenticationError' ? 'PAYMENTS_UNAVAILABLE' : 'STRIPE_ERROR'
		return NextResponse.json({ error: code }, { status: 502 })
	}
}
