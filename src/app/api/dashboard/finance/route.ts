export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must } from '@/lib/db'
import { countBookings, getBusinessTours } from '../businessTours'

const EMPTY = {
	totalRevenue: { value: '0.00', percentageChange: 0 },
	pendingPayments: { value: '0.00', percentageChange: 0 },
	invoicesSent: { value: 0, percentageChange: 0 },
	paidInvoices: { value: 0, percentageChange: 0 },
}

async function sumTotalPrice(tourIds: string[], bookingState: string) {
	const rows = must(
		await db
			.from(T.bookings)
			.select('totalPrice')
			.in('tourId', tourIds)
			.eq('bookingState', bookingState),
	)
	return (rows ?? []).reduce((sum, b) => sum + (b.totalPrice || 0), 0)
}

export async function GET() {
	try {
		const userData = await getUserData()
		if (!userData || !userData.id) {
			return NextResponse.json(EMPTY, { status: 200 })
		}

		const businessTours = await getBusinessTours(userData.id)
		if (!businessTours) {
			return NextResponse.json(EMPTY)
		}

		const { tourIds } = businessTours
		const [totalRevenue, pendingPayments, invoicesSent, paidInvoices] =
			await Promise.all([
				sumTotalPrice(tourIds, 'confirmed'),
				sumTotalPrice(tourIds, 'pending'),
				countBookings(tourIds, { hasInvoice: true }),
				countBookings(tourIds, { hasInvoice: true, bookingState: 'confirmed' }),
			])

		// percentageChange values are placeholders until period comparison is built
		return NextResponse.json({
			totalRevenue: { value: totalRevenue.toFixed(2), percentageChange: 20.1 },
			pendingPayments: { value: pendingPayments.toFixed(2), percentageChange: 4.3 },
			invoicesSent: { value: invoicesSent, percentageChange: 12.0 },
			paidInvoices: { value: paidInvoices, percentageChange: 8.0 },
		})
	} catch (error) {
		console.error('Error fetching finance stats:', error)
		return NextResponse.json(EMPTY, { status: 200 })
	}
}
