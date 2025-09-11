import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Create a unique referral link based on user's name and lastname
 * @param userId - ID of the user
 */
export async function createReferralLink(userId: string) {
	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
		})

		if (!user) throw new Error('User not found')

		const firstname = user.accountData?.firstname || 'user'
		const lastname = user.accountData?.lastname || ''

		// Build the base code
		let baseCode = `${firstname}${lastname}`.replace(/\s+/g, '').toLowerCase()

		// Check existing referral codes that start with the baseCode
		const existingLinks = await prisma.referralLink.findMany({
			where: { code: { startsWith: baseCode } },
		})

		let finalCode = baseCode
		if (existingLinks.length > 0) {
			// If there are duplicates, add a number at the end
			finalCode = `${baseCode}${existingLinks.length + 1}`
		}

		// Create the referral link
		const referralLink = await prisma.referralLink.create({
			data: {
				user: { connect: { id: userId } },
				code: finalCode,
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
