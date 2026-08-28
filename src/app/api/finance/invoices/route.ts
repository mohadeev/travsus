export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function GET(request: NextRequest) {
	try {
		// Get the current user
		const userData = await getUserData()

		// Check if user is authenticated
		if (!userData || !userData.id) {
			return NextResponse.json(
				{ message: 'User not found or not authenticated' },
				{ status: 401 },
			)
		}

		// Get the business associated with this user
		const business = await prisma.business.findFirst({
			where: {
				creatorId: userData.id,
			},
		})

		// If no business found, return empty array
		if (!business) {
			return NextResponse.json({ invoices: [] })
		}

		// Get search query from URL if present
		const searchQuery = request.nextUrl.searchParams.get('search') || ''

		// Get all invoices (bookings with invoice numbers) for this business
		const bookings = await prisma.booking.findMany({
			where: {
				invoiceNumber: {
					not: null,
				},
				tour: {
					businessId: business.id,
				},
				...(searchQuery
					? {
							customer: {
								name: {
									contains: searchQuery,
									mode: 'insensitive',
								},
							},
						}
					: {}),
			},
			select: {
				id: true,
				invoiceNumber: true,
				bookingState: true,
				totalPrice: true,
				createdAt: true,
				customer: {
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

		// Format the invoices data for the frontend
		const invoices = bookings.map((booking) => ({
			id: booking.invoiceNumber || booking.id,
			customer: booking.customer.name || 'Unknown Customer',
			amount: booking.totalPrice ? `$${booking.totalPrice.toFixed(2)}` : 'N/A',
			status:
				booking.bookingState === 'confirmed'
					? 'paid'
					: booking.bookingState === 'pending'
						? 'pending'
						: 'overdue',
			date: booking.createdAt.toISOString().split('T')[0],
		}))

		return NextResponse.json({ invoices })
	} catch (error) {
		console.error('Error fetching invoices:', error)
		return NextResponse.json(
			{ message: 'Error fetching invoices' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
