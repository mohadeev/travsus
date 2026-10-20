// Booking emails: the data they show (from the database) and sending the
// "Booking confirmed" email with its PDF, plus the team notice.
import 'server-only'
import { db, T, must } from '@/lib/db'
import { OWNER_EMAIL } from '@/lib/admin/owner'
import { PAID_STATES } from '@/lib/dashboard'
import { readTripDates } from '@/lib/tripDates'
import { SITE } from './layout'
import { bookingPdf, bookingPdfName } from './bookingPdf'
import { sendTemplate } from './send'
import type { BookingEmail } from './templates'

const LABELS: Record<string, string> = {
	transport: 'Transport',
	accommodation: 'Accommodation',
	tax: 'Taxes & fees',
	taxes: 'Taxes & fees',
	discount: 'Discount',
	promo: 'Promo code',
}
const label = (item: any) => {
	const key = String(item?.description ?? '').toLowerCase()
	const base = LABELS[key] ?? (key ? key.charAt(0).toUpperCase() + key.slice(1) : 'Item')
	return item?.promoCode ? `${base} (${item.promoCode})` : base
}
/** Trip dates are stored as the visitor's local midnight: noon UTC is the right day anywhere */
const midday = (d: Date | null) => (d ? new Date(d.getTime() + 12 * 3600_000).toISOString() : null)

/** A booking as the emails and the PDF show it, or null if it doesn't exist */
export async function bookingEmailData(bookingId: string): Promise<BookingEmail | null> {
	const b: any = must(
		await db
			.from(T.bookings)
			.select(`id, tourId, bookingReference, orderNumber, bookingState, bookingStates, selectedDate, duration, guests, lineItems, updatedAt, paymentPlan, depositAmount, balanceAmount, balanceDueAt, customer:${T.users}!customerId(email, username, accountData), tour:${T.tours}(id, name, images, slugs)`)
			.eq('id', bookingId)
			.maybeSingle(),
	)
	if (!b) return null
	const [start, end] = readTripDates(b.selectedDate)
	const items = ((b.lineItems ?? []) as any[]).filter((i) => i?.includeInTotal === true).map((i) => [label(i), Number(i.totalPrice) || 0] as [string, number])
	const slug = b.tour?.slugs?.find((x: any) => x.language === 'en-US')?.slug ?? b.tour?.slugs?.[0]?.slug
	const name = [b.customer?.accountData?.firstname, b.customer?.accountData?.lastname].filter(Boolean).join(' ') || b.customer?.username || b.customer?.email || 'Traveller'
	const image = b.tour?.images?.[0]?.url as string | undefined
	return {
		reference: b.bookingReference || b.orderNumber || b.id.slice(-8).toUpperCase(),
		customerName: name,
		customerEmail: b.customer?.email ?? '',
		tourName: b.tour?.name?.trim() || 'TRAVSUS tour',
		// A wide, light version of the tour's first photo
		tourImage: image?.includes('/upload/') ? image.replace('/upload/', '/upload/c_fill,w_1040,h_600,q_auto,f_jpg/') : image,
		tourUrl: slug ? `${SITE}${slug.startsWith('/') ? '' : '/'}${slug}` : undefined,
		start: midday(start),
		end: midday(end),
		days: b.duration || 1,
		adults: b.guests?.guestAdults ?? 0,
		children: b.guests?.guestChildren ?? 0,
		items,
		total: Math.round(items.reduce((s, [, n]) => s + n, 0) * 100) / 100,
		paidAt: ((b.bookingStates ?? []) as any[]).find((s) => PAID_STATES.includes(s?.state) || s?.state === 'deposit_paid')?.createdAt ?? b.updatedAt,
		deposit:
			b.paymentPlan === 'deposit' && b.bookingState !== 'paid'
				? { paid: Number(b.depositAmount) || 0, balance: Number(b.balanceAmount) || 0, dueAt: b.balanceDueAt ?? null }
				: null,
		tourId: b.tourId,
		bookingId: b.id,
	} as BookingEmail & { tourId: string; bookingId: string }
}

/** After payment: confirmation + PDF to the customer, notice to the team. Never throws. */
export async function sendBookingConfirmed(bookingId: string) {
	try {
		const data = await bookingEmailData(bookingId)
		if (!data?.customerEmail) return
		const pdf = await bookingPdf(data).catch((error) => {
			console.error('Booking PDF failed:', error)
			return null
		})
		await sendTemplate('booking-confirmed', {
			to: { email: data.customerEmail, name: data.customerName },
			data,
			attachments: pdf ? [{ name: bookingPdfName(data), content: pdf }] : undefined,
		})
		await sendTemplate('new-booking-team', { to: OWNER_EMAIL, data })
	} catch (error) {
		console.error('Booking confirmation emails failed:', error)
	}
}

/** Book now, pay later: the tour-day charge failed. Asks the customer to pay. Never throws. */
export async function sendBalanceFailed(bookingId: string, reason?: string) {
	try {
		const data: any = await bookingEmailData(bookingId)
		if (!data?.customerEmail) return
		const payUrl = `${SITE}/en-US/checkout/checkout?bookingId=${bookingId}&serviceId=${data.tourId}`
		await sendTemplate('balance-failed', { to: { email: data.customerEmail, name: data.customerName }, data: { ...data, reason, payUrl } })
		await sendTemplate('new-booking-team', { to: OWNER_EMAIL, data, subjectPrefix: 'BALANCE FAILED – ' })
	} catch (error) {
		console.error('Balance failed emails failed:', error)
	}
}
