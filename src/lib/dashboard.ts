// Data for the business dashboard. Server only.
//
// Who sees what:
//   - the site owner: every tour and booking on TRAVSUS
//   - a business owner: the tours of their business and their bookings
//   - anyone else: nothing (the dashboard offers to create a company)
//
// Money: a booking's total is the sum of its line items that count towards
// the price (euros). Only paid bookings are revenue; "initiated" bookings are
// checkouts that were started but not paid.
import 'server-only'
import { cache } from 'react'
import { db, T, must } from '@/lib/db'
import { getSessionUser } from '@/lib/session'
import { isOwner } from '@/lib/admin/owner'
import { readTripDates } from '@/lib/tripDates'

export const PAID_STATES = ['paid', 'confirmed']
export const OPEN_STATES = ['initiated', 'payment_failed']
export const CLOSED_STATES = ['cancelled', 'REFUNDED', 'refunded']

export type Scope = { label: string; all: boolean; tourIds: string[]; businessId: string | null; user: any }

/** What the signed-in user may see (null: signed out; tourIds empty: no business). */
export const dashboardScope = cache(async (): Promise<Scope | null> => {
	const user = await getSessionUser().catch(() => null)
	if (!user) return null
	if (await isOwner()) return { label: 'All of TRAVSUS', all: true, tourIds: [], businessId: null, user }
	const business = must(await db.from(T.businesses).select('id, name').eq('creatorId', user.id).order('isActive', { ascending: false }).limit(1).maybeSingle()) as any
	if (!business) return { label: '', all: false, tourIds: [], businessId: null, user }
	const tours = (must(await db.from(T.tours).select('id').eq('businessId', business.id)) ?? []) as any[]
	return { label: business.name, all: false, tourIds: tours.map((t) => t.id), businessId: business.id, user }
})

/** A query limited to the scope's tours (column: the tour id column). */
const within = (query: any, scope: Scope, column: string) => (scope.all ? query : query.in(column, scope.tourIds.length ? scope.tourIds : ['-']))

export const bookingTotal = (lineItems: any[] = []) =>
	(lineItems ?? []).filter((i) => i?.includeInTotal === true).reduce((sum, i) => sum + (i?.totalPrice || 0), 0)

const tourName = (tour: any) => tour?.name?.trim() || 'Untitled tour'

/** Every booking in scope with what the pages need (newest first). */
async function scopedBookings(scope: Scope) {
	const rows: any[] = []
	for (let from = 0; ; from += 1000) {
		const page = (must(
			await within(
				db
					.from(T.bookings)
					.select(`id, tourId, customerId, bookingState, bookingStates, selectedDate, guests, lineItems, bookingReference, orderNumber, createdAt, updatedAt, tour:${T.tours}(id, name, images, slugs), customer:${T.users}!customerId(id, email, username, accountData, profileImage)`)
					.order('createdAt', { ascending: false })
					.range(from, from + 999),
				scope,
				'tourId',
			),
		) ?? []) as any[]
		rows.push(...page)
		if (page.length < 1000) break
	}
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	return rows.map((b) => {
		const [start, end] = readTripDates(b.selectedDate)
		const paid = PAID_STATES.includes(b.bookingState)
		const closed = CLOSED_STATES.includes(b.bookingState)
		const future = !!start && start >= today
		const status: 'upcoming' | 'completed' | 'unpaid' | 'abandoned' | 'cancelled' = closed
			? 'cancelled'
			: paid
				? future
					? 'upcoming'
					: 'completed'
				: future
					? 'unpaid'
					: 'abandoned'
		const c = b.customer
		return {
			id: b.id as string,
			reference: (b.bookingReference || b.orderNumber || b.id.slice(-8)) as string,
			status,
			state: b.bookingState as string,
			paid,
			start,
			end,
			createdAt: b.createdAt as string,
			// When the payment was recorded (state history), else the last update
			paidAt: paid ? ((b.bookingStates ?? []).find((s: any) => PAID_STATES.includes(s?.state))?.createdAt ?? b.updatedAt) as string : null,
			total: bookingTotal(b.lineItems),
			adults: b.guests?.guestAdults ?? 0,
			children: b.guests?.guestChildren ?? 0,
			tour: { id: b.tourId as string, name: tourName(b.tour), image: b.tour?.images?.[0]?.url as string | undefined, slug: b.tour?.slugs?.find((s: any) => s.language === 'en-US')?.slug ?? b.tour?.slugs?.[0]?.slug },
			customer: {
				id: c?.id as string,
				email: (c?.email ?? '') as string,
				name: [c?.accountData?.firstname, c?.accountData?.lastname].filter(Boolean).join(' ') || c?.username || c?.email || 'Customer',
				image: c?.profileImage?.url as string | undefined,
			},
		}
	})
}
export type DashboardBooking = Awaited<ReturnType<typeof scopedBookings>>[number]

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`

/** Revenue and paid bookings per month for the last `months` months. */
function byMonth(bookings: DashboardBooking[], months: number) {
	const now = new Date()
	const keys = Array.from({ length: months }, (_, i) => monthKey(new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1)))
	const map = new Map(keys.map((k) => [k, { month: k, revenue: 0, bookings: 0 }]))
	for (const b of bookings) {
		if (!b.paid) continue
		const slot = map.get(monthKey(new Date(b.paidAt ?? b.createdAt)))
		if (slot) {
			slot.revenue += b.total
			slot.bookings += 1
		}
	}
	return Array.from(map.values())
}

export async function overview(scope: Scope) {
	const bookings = await scopedBookings(scope)
	const paid = bookings.filter((b) => b.paid)
	const since30 = Date.now() - 30 * 86400_000
	const sum = (xs: DashboardBooking[]) => xs.reduce((s, b) => s + b.total, 0)

	const [tours, reviews] = await Promise.all([
		within(db.from(T.tours).select('id', { count: 'exact', head: true }), scope, 'id'),
		within(db.from(T.reviews).select('rating'), scope, 'tourId'),
	])
	const ratings = ((reviews.data ?? []) as any[]).map((r) => Number(r.rating)).filter((n) => n > 0)

	// Best sellers by revenue
	const byTour = new Map<string, { id: string; name: string; image?: string; revenue: number; bookings: number }>()
	for (const b of paid) {
		const t = byTour.get(b.tour.id) ?? { id: b.tour.id, name: b.tour.name, image: b.tour.image, revenue: 0, bookings: 0 }
		t.revenue += b.total
		t.bookings += 1
		byTour.set(b.tour.id, t)
	}

	return {
		revenueTotal: sum(paid),
		revenue30: sum(paid.filter((b) => new Date(b.paidAt ?? b.createdAt).getTime() > since30)),
		paidCount: paid.length,
		upcomingCount: bookings.filter((b) => b.status === 'upcoming').length,
		unpaidCount: bookings.filter((b) => b.status === 'unpaid').length,
		unpaidValue: sum(bookings.filter((b) => b.status === 'unpaid')),
		toursCount: tours.count ?? 0,
		customersCount: new Set(paid.map((b) => b.customer.id)).size,
		rating: ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null,
		reviewsCount: ratings.length,
		months: byMonth(bookings, 6),
		upcoming: bookings
			.filter((b) => b.status === 'upcoming')
			.sort((a, b) => (a.start?.getTime() ?? 0) - (b.start?.getTime() ?? 0))
			.slice(0, 6),
		recent: bookings.filter((b) => b.status !== 'abandoned').slice(0, 6),
		topTours: Array.from(byTour.values())
			.sort((a, b) => b.revenue - a.revenue)
			.slice(0, 5),
	}
}

export const BOOKING_FILTERS = ['all', 'upcoming', 'unpaid', 'completed', 'cancelled', 'abandoned'] as const
export type BookingFilter = (typeof BOOKING_FILTERS)[number]

export async function bookingsList(scope: Scope, filter: BookingFilter, query: string) {
	const all = await scopedBookings(scope)
	const counts = Object.fromEntries(BOOKING_FILTERS.map((f) => [f, f === 'all' ? all.filter((b) => b.status !== 'abandoned').length : all.filter((b) => b.status === f).length])) as Record<BookingFilter, number>
	const q = query.trim().toLowerCase()
	const rows = all
		.filter((b) => (filter === 'all' ? b.status !== 'abandoned' : b.status === filter))
		.filter((b) => !q || [b.reference, b.customer.name, b.customer.email, b.tour.name].some((v) => v?.toLowerCase().includes(q)))
	if (filter === 'upcoming' || filter === 'unpaid') rows.sort((a, b) => (a.start?.getTime() ?? 0) - (b.start?.getTime() ?? 0))
	return { rows: rows.slice(0, 300), total: rows.length, counts }
}

export async function customersList(scope: Scope, query: string) {
	const all = await scopedBookings(scope)
	const map = new Map<string, { id: string; name: string; email: string; image?: string; bookings: number; paid: number; spent: number; last: string }>()
	for (const b of all) {
		if (!b.customer.id || b.status === 'abandoned') continue
		const c = map.get(b.customer.id) ?? { ...b.customer, bookings: 0, paid: 0, spent: 0, last: b.createdAt }
		c.bookings += 1
		if (b.paid) {
			c.paid += 1
			c.spent += b.total
		}
		if (b.createdAt > c.last) c.last = b.createdAt
		map.set(b.customer.id, c)
	}
	const q = query.trim().toLowerCase()
	return Array.from(map.values())
		.filter((c) => !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
		.sort((a, b) => b.spent - a.spent || b.last.localeCompare(a.last))
}

export async function finance(scope: Scope) {
	const all = await scopedBookings(scope)
	const paid = all.filter((b) => b.paid).sort((a, b) => (b.paidAt ?? b.createdAt).localeCompare(a.paidAt ?? a.createdAt))
	const year = new Date().getFullYear()
	return {
		total: paid.reduce((s, b) => s + b.total, 0),
		thisYear: paid.filter((b) => new Date(b.paidAt ?? b.createdAt).getFullYear() === year).reduce((s, b) => s + b.total, 0),
		average: paid.length ? paid.reduce((s, b) => s + b.total, 0) / paid.length : 0,
		count: paid.length,
		months: byMonth(all, 12),
		payments: paid.slice(0, 200),
	}
}

export async function toursList(scope: Scope) {
	const [tours, bookings] = await Promise.all([
		within(db.from(T.tours).select('id, name, images, slugs, days, price, createdAt, updatedAt').order('createdAt', { ascending: false }), scope, 'id').then((r: any) => must(r) ?? []),
		scopedBookings(scope),
	])
	return (tours as any[]).map((t) => {
		const mine = bookings.filter((b) => b.tour.id === t.id && b.paid)
		return {
			id: t.id as string,
			name: tourName(t),
			image: t.images?.[0]?.url as string | undefined,
			slug: t.slugs?.find((s: any) => s.language === 'en-US')?.slug ?? t.slugs?.[0]?.slug,
			days: (t.days ?? []).length,
			bookings: mine.length,
			revenue: mine.reduce((s, b) => s + b.total, 0),
			updatedAt: (t.updatedAt ?? t.createdAt) as string,
		}
	})
}
