export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { checkBookingRole } from '../api-utils/actions/booking/checkBookingRole'

export async function POST(request: NextRequest) {
	try {
		const bookingRole: any = await checkBookingRole(request)
		return NextResponse.json(bookingRole, { status: bookingRole.status })
	} catch (error) {
		console.error('Error checking booking state:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
