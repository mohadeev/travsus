'use server'
// Data for the business dashboard page. Admins see the whole platform,
// business owners see their own business, everyone else sees nothing.

import { getBusinessTours } from '@/app/api/dashboard/businessTours'
import { db, T, must, asDate } from '@/lib/db'
import { currentUser } from '@/lib/guards'

/** Tour ids the current user may see; null = all (admin); [] = none. */
async function visibleTourIds(): Promise<string[] | null> {
	const user = await currentUser()
	if (!user) return []
	if (user.isAdmin === true) return null
	return (await getBusinessTours(user.id))?.tourIds ?? []
}

/** Restricts a bookings/tours query to the visible tours. */
function scope(query: any, column: string, tourIds: string[] | null) {
	return tourIds === null ? query : query.in(column, tourIds)
}

// percentageChange values are placeholders until period comparison is built
export async function getDashboardStats() {
	try {
		const tourIds = await visibleTourIds()

		const [confirmed, tours, pending] = await Promise.all([
			scope(db.from(T.bookings).select('totalPrice').eq('bookingState', 'confirmed'), 'tourId', tourIds),
			scope(db.from(T.tours).select('id', { count: 'exact', head: true }), 'id', tourIds),
			scope(
				db.from(T.bookings).select('id', { count: 'exact', head: true }).eq('bookingState', 'pending'),
				'tourId',
				tourIds,
			),
		])
		for (const res of [confirmed, tours, pending]) if (res.error) throw new Error(res.error.message)

		const revenue = (confirmed.data ?? []).reduce(
			(sum: number, b: any) => sum + (b.totalPrice || 0),
			0,
		)

		return {
			totalRevenue: { value: revenue.toFixed(2), percentageChange: 20.1 },
			activeTours: { value: tours.count ?? 0, percentageChange: 18.1 },
			pendingBookings: { value: pending.count ?? 0, percentageChange: 19.0 },
			// Placeholder until ratings are calculated from reviews
			customerSatisfaction: { value: 4.8, percentageChange: 4.0 },
		}
	} catch (error) {
		console.error('Error fetching dashboard stats:', error)
		throw new Error('Failed to fetch dashboard statistics')
	}
}

export async function getTours(searchQuery = '', limit?: number) {
	try {
		const tourIds = await visibleTourIds()

		let query = scope(
			db
				.from(T.tours)
				.select(`id, name, price, updated, createdAt, bookings:${T.bookings}(count)`)
				.order('createdAt', { ascending: false }),
			'id',
			tourIds,
		)
		if (searchQuery) query = query.ilike('name', `%${searchQuery.replace(/[%_]/g, '\\$&')}%`)
		if (limit) query = query.limit(limit)

		const tours: any[] = must(await query) ?? []

		return tours.map((tour) => ({
			id: tour.id,
			name: tour.name || 'Untitled Tour',
			price: tour.price || '$0',
			status: tour.updated ? 'active' : 'draft',
			createdAt: asDate(tour.createdAt)?.toISOString().split('T')[0],
			bookings: tour.bookings?.[0]?.count ?? 0,
		}))
	} catch (error) {
		console.error('Error fetching tours:', error)
		throw new Error('Failed to fetch tours')
	}
}

export async function getRecentBookings() {
	try {
		const tourIds = await visibleTourIds()

		const bookings: any[] =
			must(
				await scope(
					db
						.from(T.bookings)
						.select(
							`id, bookingState, tour:${T.tours}(name), customer:${T.users}!customerId(id, name, profileImage)`,
						)
						.order('createdAt', { ascending: false })
						.limit(5),
					'tourId',
					tourIds,
				),
			) ?? []

		const placeholder = '/placeholder.svg?height=32&width=32'
		return bookings.map((booking) => ({
			id: booking.id,
			name: booking.customer?.name || 'Unknown Customer',
			tour: booking.tour?.name || 'Unknown Tour',
			avatar: booking.customer?.profileImage?.url || placeholder,
			status: booking.bookingState,
		}))
	} catch (error) {
		console.error('Error fetching recent bookings:', error)
		throw new Error('Failed to fetch recent bookings')
	}
}
