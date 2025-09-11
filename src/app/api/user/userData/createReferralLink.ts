import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Create a referral link for a user with a code based on their name + last name
 * @param userId - ID of the user
 * @returns ReferralLink object
 */
export async function createReferralLink(userId: string) {
	try {
		// 1. Get user data
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { firstName: true, lastName: true },
		})

		if (!user) {
			throw new Error('User not found')
		}

		const baseCode =
			(user.firstName || '').toLowerCase() + (user.lastName || '').toLowerCase()

		if (!baseCode) {
			throw new Error('User has no name/lastname to build referral code')
		}

		// 2. Ensure uniqueness
		let uniqueCode = baseCode
		let counter = 1

		while (true) {
			const existing = await prisma.referralLink.findUnique({
				where: { code: uniqueCode },
			})

			if (!existing) break // code is free → stop

			uniqueCode = `${baseCode}${counter}`
			counter++
		}

		// 3. Create referral link with 10% commission
		const referralLink = await prisma.referralLink.create({
			data: {
				user: { connect: { id: userId } },
				code: uniqueCode,
				commissionType: 'PERCENTAGE',
				commissionValue: 10, // 10% commission
				isLifetime: true,
			},
		})

		console.log('✅ Referral link created:', referralLink)
		return referralLink
	} catch (error) {
		console.error('❌ Error creating referral link:', error)
		throw error
	} finally {
		await prisma.$disconnect()
	}
}
