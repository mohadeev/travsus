import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
		const user = await prisma.user.findUnique({
			where: { id: userId },
		})

		if (!user) throw new Error('User not found')

		const firstname = user.accountData?.firstname || ''
		const lastname = user.accountData?.lastname || ''

		let baseCode = ''

		if (firstname || lastname) {
			baseCode = `${firstname}${lastname}`.replace(/\s+/g, '').toLowerCase()
		} else {
			baseCode = generateRandomCode(8)
		}

		const existingLinks = await prisma.referralLink.findMany({
			where: { code: { startsWith: baseCode } },
		})

		let finalCode = baseCode
		if (existingLinks.length > 0) {
			finalCode = `${baseCode}${existingLinks.length + 1}`
		}

		// Create the referral link with owner commission and client discount
		const referralLink = await prisma.referralLink.create({
			data: {
				user: { connect: { id: userId } },
				code: finalCode,
				commissionType: 'PERCENTAGE', // Owner commission
				commissionValue: 10, // 10% for owner
				clientDiscount: 5, // 5% discount for client
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
