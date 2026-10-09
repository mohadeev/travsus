export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import getUserData from '@/app/api/user/getUserData'
import { countBookings, getBusinessTours } from '../../businessTours'

const EMPTY = { total: 0, pending: 0, confirmed: 0, cancelled: 0 }

export async function GET() {
	try {
		const userData = await getUserData()
		if (!userData || !userData.id) {
			return NextResponse.json(EMPTY, { status: 401 })
		}

		const businessTours = await getBusinessTours(userData.id)
		if (!businessTours) {
			return NextResponse.json(EMPTY)
		}

		const { tourIds } = businessTours
		const [total, pending, confirmed, cancelled] = await Promise.all([
			countBookings(tourIds),
			countBookings(tourIds, { bookingState: 'pending' }),
			countBookings(tourIds, { bookingState: 'confirmed' }),
			countBookings(tourIds, { bookingState: 'cancelled' }),
		])

		return NextResponse.json({ total, pending, confirmed, cancelled })
	} catch (error) {
		console.error('Error fetching booking stats:', error)
		return NextResponse.json(EMPTY, { status: 500 })
	}
}
