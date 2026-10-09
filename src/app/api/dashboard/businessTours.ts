import { db, T, must } from '@/lib/db'

/** The user's business and the ids of its tours (null when the user has no business). */
export async function getBusinessTours(userId: string) {
	const business = must(
		await db
			.from(T.businesses)
			.select('id')
			.eq('creatorId', userId)
			.limit(1)
			.maybeSingle(),
	)
	if (!business) return null

	const tours = must(await db.from(T.tours).select('id').eq('businessId', business.id))
	return { business, tourIds: (tours ?? []).map((t) => t.id) }
}

/** Number of bookings on the given tours, optionally filtered. */
export async function countBookings(
	tourIds: string[],
	filter: { bookingState?: string; hasInvoice?: boolean } = {},
) {
	let query = db
		.from(T.bookings)
		.select('id', { count: 'exact', head: true })
		.in('tourId', tourIds)
	if (filter.bookingState) query = query.eq('bookingState', filter.bookingState)
	if (filter.hasInvoice) query = query.not('invoiceNumber', 'is', null)
	const { count, error } = await query
	if (error) throw new Error(error.message)
	return count ?? 0
}
