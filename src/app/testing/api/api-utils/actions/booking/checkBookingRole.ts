import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import getUserData from '@/app/api/user/getUserData'

const prisma = new PrismaClient()

export async function checkBookingRole(request: NextRequest) {
	try {
		const { id: currentUserId }: any = await getUserData({})
		const referer = request.headers.get('referer') || ''
		const url = new URL(referer)
		const searchParams = url.searchParams
		const serviceId: string = searchParams.get('serviceId') || ''
		const bookingId: string = searchParams.get('bookingId') || ''

		if (!currentUserId) {
			return {
				error: 'User not authenticated',
				allowed: false,
				status: 401,
			}
		}

		if (!bookingId) {
			return {
				error: 'Missing bookingId parameter',
				allowed: false,
				status: 400,
			}
		}

		// Validate bookingId format (assuming it's a MongoDB ObjectId)
		const objectIdRegex = /^[0-9a-fA-F]{24}$/
		if (!objectIdRegex.test(bookingId)) {
			return {
				error: 'Invalid bookingId format',
				allowed: false,
				status: 400,
			}
		}

		// Fetch the booking
		const booking = await prisma.booking.findUnique({
			where: { id: bookingId },
			include: {
				customer: true,
				provider: true,
			},
		})

		if (!booking) {
			return { error: 'Booking not found', allowed: false, status: 404 }
		}

		// Check if the current user is either the customer or the provider
		if (
			booking.customerId !== currentUserId &&
			booking.providerId !== currentUserId
		) {
			return { error: 'Unauthorized access', allowed: false, status: 403 }
		}

		const userRole =
			booking.customerId === currentUserId ? 'customer' : 'provider'
		return {
			userRole: userRole,
			bookingId: booking.id,
			bookingState: booking.bookingState,
			customerId: booking.customerId,
			providerId: booking.providerId,
			allowed: true,
			status: 200,
		}
	} catch (error) {
		console.error('Error checking booking role:', error)
		if (error instanceof Error) {
			return { error: error.message, allowed: false, status: 500 }
		}
		return { error: 'Internal server error', allowed: false, status: 500 }
	} finally {
		await prisma.$disconnect()
	}
}
