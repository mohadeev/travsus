import { NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function POST(request: Request) {
	try {
		// Get the current user
		const userData = await getUserData()

		// Check if user is authenticated
		if (!userData || !userData.id) {
			return NextResponse.json(
				{ success: false, message: 'Unauthorized' },
				{ status: 401 },
			)
		}

		// Get the business associated with this user
		const business = await prisma.business.findFirst({
			where: {
				creatorId: userData.id,
			},
		})

		// If no business found, return error
		if (!business) {
			return NextResponse.json(
				{ success: false, message: 'Business not found' },
				{ status: 404 },
			)
		}

		// Parse the request body
		const body = await request.json()
		const { bookingId, newStatus } = body

		if (!bookingId || !newStatus) {
			return NextResponse.json(
				{ success: false, message: 'Booking ID and new status are required' },
				{ status: 400 },
			)
		}

		// Verify the booking belongs to this business
		const booking = await prisma.booking.findUnique({
			where: { id: bookingId },
			include: {
				tour: {
					select: {
						businessId: true,
					},
				},
			},
		})

		if (!booking) {
			return NextResponse.json(
				{ success: false, message: 'Booking not found' },
				{ status: 404 },
			)
		}

		if (booking.tour?.businessId !== business.id) {
			return NextResponse.json(
				{
					success: false,
					message: 'This booking does not belong to your business',
				},
				{ status: 403 },
			)
		}

		// Update the booking status
		await prisma.booking.update({
			where: { id: bookingId },
			data: {
				bookingState: newStatus,
				bookingStates: {
					push: {
						state: newStatus,
						by: userData.id,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
				},
			},
		})

		return NextResponse.json({
			success: true,
			message: `Booking status updated to ${newStatus}`,
		})
	} catch (error) {
		console.error('Error updating booking status:', error)
		return NextResponse.json(
			{ success: false, message: 'Error updating booking status' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
