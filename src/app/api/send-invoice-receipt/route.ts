import { NextRequest, NextResponse } from 'next/server'
import { bookingConfirmationEmail } from '@/utils/bookingConfirmationEmail'
import { emailTemplatesFooter } from '@/components/email-templates/EmailTemplatesFooter'
import { emailTemplatesHeader } from '@/components/email-templates/EmailTemplatesHeader'
import prisma from '@/prisma' // Prisma client instance
import { extractBookingDetails } from '@/utils/extractBookingDetails'

const dummyBookingData = {
	// Existing fields
	invoiceNumber: 'INV-2024-0042',
	receiptNumber: 'REC-2024-0042',
	orderDate: '2024-03-15',
	orderNumber: 'TV-1176279-9389155',
	customerName: 'Emma Thompson',
	customerEmail: 'skendoulmohamed@gmail.com',
	customerAddress: '123 Sunshine Avenue',
	customerCity: 'Barcelona',
	customerRegion: 'Catalonia',
	customerPostalCode: '08001',
	customerCountry: 'Spain',
	tourName: 'Mediterranean Cruise Adventure',
	tourDuration: 10,
	tourStartDate: '2024-07-01',
	tourEndDate: '2024-07-10',
	priceExclVAT: 2500.0,
	vatRate: 21,
	vatAmount: 525.0,
	priceInclVAT: 3025.0,
	name: 'Emma Thompson',
	bookingReference: 'TRVS-24-0042',
	destination: 'Mediterranean Sea',
	checkInDate: '2024-07-01',
	checkOutDate: '2024-07-10',
	numberOfGuests: 2,
	totalAmount: '€3,025.00',
	bookingDetailsLink: 'https://www.travsus.com/booking/TRVS-24-0042',
}

export async function GET(request: NextRequest) {
	const prismaBooking: any = await prisma.booking.findUnique({
		where: { id: '67536aad31dcd195d35de04f' },
		include: {
			customer: true,
			provider: true,
			tour: true,
			paymentMethod: true,
		},
	})
	console.log('prismaBooking:', JSON.stringify(prismaBooking))
	const booking = extractBookingDetails({ booking: prismaBooking })
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
