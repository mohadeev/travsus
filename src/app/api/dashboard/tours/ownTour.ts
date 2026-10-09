import { db, T, must } from '@/lib/db'

/** The user's first business id, or null. */
export async function getBusinessId(userId: string) {
	const business = must(
		await db
			.from(T.businesses)
			.select('id')
			.eq('creatorId', userId)
			.limit(1)
			.maybeSingle(),
	)
	return business?.id ?? null
}

/** Fields a business may not change on its own tours. */
export const PROTECTED_TOUR_FIELDS = ['id', 'creatorId', 'businessId', 'createdAt'] as const
