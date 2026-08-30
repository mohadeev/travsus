export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function GET(request: Request) {
	try {
		// Get the current user
		const userData = await getUserData()

		// Check if user is authenticated
		if (!userData || !userData.id) {
			return NextResponse.json({ bookings: [] }, { status: 401 })
		}

		// Get the business associated with this user
		const business = await prisma.business.findFirst({
			where: {
				creatorId: userData.id,
			},
		})

		// If no business found, return empty array
		if (!business) {
			return NextResponse.json({ bookings: [] })
		}

		// Get search query and status filter from URL if present
		const url = new URL(request.url)
		const searchQuery = url.searchParams.get('search') || ''
		const statusFilter = url.searchParams.get('status') || ''

		// Get all bookings associated with this business's tours
		const bookings = await prisma.booking.findMany({
			where: {
				tour: {
					businessId: business.id,
				},
				...(statusFilter ? { bookingState: statusFilter } : {}),
				...(searchQuery
					? {
							OR: [
								{
									customer: {
										name: {
											contains: searchQuery,
											mode: 'insensitive',
										},
									},
								},
								{
									tour: {
										name: {
											contains: searchQuery,
											mode: 'insensitive',
										},
									},
								},
								{
									orderNumber: {
										contains: searchQuery,
										mode: 'insensitive',
									},
								},
							],
						}
					: {}),
			},
			include: {
				customer: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
				tour: {
					select: {
						id: true,
						name: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		// Format the bookings data for the frontend
		const formattedBookings = bookings.map((booking) => ({
			id: booking.id,
			customer: booking.customer?.name || 'Unknown Customer',
			customerEmail: booking.customer?.email || '',
			tour: booking.tour?.name || 'Unknown Tour',
			tourId: booking.tour?.id || '',
			date: booking.selectedDate
				? new Date(booking.selectedDate.startDate).toISOString().split('T')[0]
				: 'N/A',
			status: booking.bookingState,
			amount: booking.totalPrice ? `$${booking.totalPrice.toFixed(2)}` : 'N/A',
			guests:
				(booking.guests?.guestAdults || 0) +
				(booking.guests?.guestChildren || 0),
			orderNumber: booking.orderNumber || '',
			createdAt: booking.createdAt.toISOString(),
		}))

		return NextResponse.json({ bookings: formattedBookings })
	} catch (error) {
		console.error('Error fetching bookings:', error)
		return NextResponse.json(
			{ message: 'Error fetching bookings', bookings: [] },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
