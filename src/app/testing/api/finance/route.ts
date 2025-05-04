import { NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function GET() {
	try {
		// Get the current user
		const userData = await getUserData()

		// Check if user is authenticated
		if (!userData || !userData.id) {
			return NextResponse.json(
				{
					totalRevenue: { value: '0.00', percentageChange: 0 },
					pendingPayments: { value: '0.00', percentageChange: 0 },
					invoicesSent: { value: 0, percentageChange: 0 },
					paidInvoices: { value: 0, percentageChange: 0 },
				},
				{ status: 200 },
			)
		}

		// Get the business associated with this user
		const business = await prisma.business.findFirst({
			where: {
				creatorId: userData.id,
			},
		})

		// If no business found, return default data
		if (!business) {
			return NextResponse.json({
				totalRevenue: { value: '0.00', percentageChange: 0 },
				pendingPayments: { value: '0.00', percentageChange: 0 },
				invoicesSent: { value: 0, percentageChange: 0 },
				paidInvoices: { value: 0, percentageChange: 0 },
			})
		}

		// Calculate total revenue from confirmed bookings for this business
		const confirmedBookings = await prisma.booking.findMany({
			where: {
				bookingState: 'confirmed',
				tour: {
					businessId: business.id,
				},
			},
			select: {
				totalPrice: true,
			},
		})

		const totalRevenue = confirmedBookings.reduce((sum, booking) => {
			return sum + (booking.totalPrice || 0)
		}, 0)

		// Calculate pending payments from pending bookings
		const pendingBookings = await prisma.booking.findMany({
			where: {
				bookingState: 'pending',
				tour: {
					businessId: business.id,
				},
			},
			select: {
				totalPrice: true,
			},
		})

		const pendingPayments = pendingBookings.reduce((sum, booking) => {
			return sum + (booking.totalPrice || 0)
		}, 0)

		// Count invoices sent (bookings with invoice numbers)
		const invoicesSent = await prisma.booking.count({
			where: {
				invoiceNumber: {
					not: null,
				},
				tour: {
					businessId: business.id,
				},
			},
		})

		// Count paid invoices (confirmed bookings with invoice numbers)
		const paidInvoices = await prisma.booking.count({
			where: {
				invoiceNumber: {
					not: null,
				},
				bookingState: 'confirmed',
				tour: {
					businessId: business.id,
				},
			},
		})

		return NextResponse.json({
			totalRevenue: {
				value: totalRevenue.toFixed(2),
				percentageChange: 20.1, // This would be calculated based on previous period
			},
			pendingPayments: {
				value: pendingPayments.toFixed(2),
				percentageChange: 4.3,
			},
			invoicesSent: {
				value: invoicesSent,
				percentageChange: 12.0,
			},
			paidInvoices: {
				value: paidInvoices,
				percentageChange: 8.0,
			},
		})
	} catch (error) {
		console.error('Error fetching finance stats:', error)
		// Return a default response even in case of error
		return NextResponse.json(
			{
				totalRevenue: { value: '0.00', percentageChange: 0 },
				pendingPayments: { value: '0.00', percentageChange: 0 },
				invoicesSent: { value: 0, percentageChange: 0 },
				paidInvoices: { value: 0, percentageChange: 0 },
			},
			{ status: 200 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
