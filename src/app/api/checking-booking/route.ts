export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import getUserData from '../user/getUserData'
import { checkBookingRole } from '../api-utils/actions/booking/checkBookingRole'

const prisma = new PrismaClient()

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
	} finally {
		await prisma.$disconnect()
	}
}

// import { NextRequest, NextResponse } from 'next/server'
// import stripe from '@/libs/stripe'

// export async function POST(request: NextRequest) {
// 	console.log(
// 		'booking was maded here---------------------------------------------------------------------------------',
// 	)
// 	return NextResponse.json(
// 		{ message: 'Missing payment intent ID' },
// 		{ status: 200 },
// 	)
// }
