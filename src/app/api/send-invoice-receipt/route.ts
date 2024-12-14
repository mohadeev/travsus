import { NextRequest, NextResponse } from 'next/server'
import { bookingConfirmationEmail } from '@/utils/bookingConfirmationEmail'
import { emailTemplatesFooter } from '@/components/email-templates/EmailTemplatesFooter'
import { emailTemplatesHeader } from '@/components/email-templates/EmailTemplatesHeader'
import prisma from '@/prisma' // Prisma client instance
import { extractBookingDetails } from '@/utils/extractBookingDetails'

export async function GET(request: NextRequest) {
	const prismaBooking: any = await prisma.booking.findFirst({
		orderBy: {
			createdAt: 'desc', // Replace 'createdAt' with your timestamp field
		},
		include: {
			customer: true,
			provider: true,
			tour: true,
			paymentMethod: true,
		},
	})
	// console.log('prismaBooking:', JSON.stringify(prismaBooking))
	try {
		const result = await bookingConfirmationEmail(prismaBooking)
		if (result?.success) {
			return NextResponse.json({ message: result.message }, { status: 200 })
		} else {
			return NextResponse.json({ error: result?.error }, { status: 500 })
		}
	} catch (error) {
		console.error('Error in send-booking-confirmation route:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
