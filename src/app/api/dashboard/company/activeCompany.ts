import { db, T, must, touch } from '@/lib/db'

/** Makes `companyId` the user's only active company. Returns it, or null if not theirs. */
export async function setActiveCompany(userId: string, companyId: string) {
	const company = must(
		await db
			.from(T.businesses)
			.select('id')
			.match({ id: companyId, creatorId: userId })
			.maybeSingle(),
	)
	if (!company) return null

	must(await db.from(T.businesses).update(touch({ isActive: false })).eq('creatorId', userId))
	return must(
		await db
			.from(T.businesses)
			.update(touch({ isActive: true }))
			.eq('id', companyId)
			.select('*')
			.single(),
	)
}
