import { db, T, must, withMeta } from '@/lib/db'

function generateRandomCode(length: number = 8) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	let result = ''
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length))
	}
	return result
}

/**
 * Create a unique referral link with owner commission and client discount
 * @param userId - ID of the user
 */
export async function createReferralLink(userId: string) {
	try {
		const user: any = must(
			await db.from(T.users).select('accountData').eq('id', userId).maybeSingle(),
		)

		if (!user) throw new Error('User not found')

		const firstname = user.accountData?.firstname || ''
		const lastname = user.accountData?.lastname || ''

		const baseCode =
			firstname || lastname
				? `${firstname}${lastname}`.replace(/\s+/g, '').toLowerCase()
				: generateRandomCode(8)

		const { count } = await db
			.from(T.referralLinks)
			.select('id', { count: 'exact', head: true })
			.like('code', `${baseCode.replace(/[%_]/g, '\\$&')}%`)

		const finalCode = count ? `${baseCode}${count + 1}` : baseCode

		// Owner gets 10% commission, client gets 5% discount
		const referralLink = must(
			await db
				.from(T.referralLinks)
				.insert(
					withMeta({
						userId,
						code: finalCode,
						commissionType: 'PERCENTAGE',
						commissionValue: 10,
						clientDiscount: 5,
						isLifetime: true,
					}),
				)
				.select('*')
				.single(),
		)

		console.log('✅ Referral link created:', referralLink)
		return referralLink
	} catch (error) {
		console.error('❌ Error creating referral link:', error)
		throw error
	}
}
