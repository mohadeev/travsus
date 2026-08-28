export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import NextAuth from 'next-auth'
import { authOptions } from './authOptions'
import { sendVerificationEmail } from '@/utils/email'
import sendEmail from '@/utils/email/sendMail'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeUserByEmail(email) {
	try {
		const deletedUser = await prisma.user.delete({
			where: {
				email: email,
			},
		})
		console.log(`User with email ${email} has been removed:`, deletedUser)
		return deletedUser
	} catch (error) {
		if (error.code === 'P2025') {
			console.log(`User with email ${email} not found.`)
			return null
		}
		console.error('Error removing user:', error)
		throw error
	} finally {
		await prisma.$disconnect()
	}
}

// const emailToRemove = 'skendoulmohamed@gmail.com'
// removeUserByEmail(emailToRemove)
// 	.then(() => console.log('Removal process completed.'))
// 	.catch((e) => console.error('Removal process failed:', e))

async function updateTourCreator() {
	try {
		// Find the user with the specified email
		const user = await prisma.user.findUnique({
			where: {
				email: 'skendoulmohamed@gmail.com',
			},
		})
		// console.log('user:', user.id)

		if (!user) {
			console.log('User not found with the specified email.')
			return
		}

		console.log(`Found user with ID: ${user.id}`)

		// Update all tours with the found user's ID
		const result = await prisma.tour.updateMany({
			data: {
				creatorId: user.id,
			},
		})

		console.log(`Updated ${result.count} tours with new creatorId: ${user.id}`)
	} catch (error) {
		console.error('Error updating tour creator:', error)
	} finally {
		await prisma.$disconnect()
	}
}

//
// updateTourCreator()

// console.log('heereerer')
// ;(async () => {
// 	const bookingInitiated: any = await prisma.booking.findFirst({
// 		where: { id: '6794fc07dc24f9494aa628e3' },
// 		include: {
// 			customer: true,
// 			provider: true,
// 			tour: true,
// 			paymentMethod: true,
// 		},
// 	})
// 	console.log('bookingInitiated:', bookingInitiated.paymentMethod)
// })()
