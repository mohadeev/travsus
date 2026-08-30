export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { updateBooking } from '@/app/api/api-utils/actions/booking/updateBooking'
import getUserData from '@/app/api/user/getUserData'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
	try {
		const { id }: any = await getUserData()
		const referer = request.headers.get('referer') || ''
		const url = new URL(referer)
		const searchParams = url.searchParams
		const serviceId: string = searchParams.get('serviceId') || ''
		const tour = await prisma.tour.findFirst({
			where: { id: serviceId },
		})
		const body = await request.json()
		const { accommodation, lineItems, guests, bookOwnHotels, selectedDate } =
			body

		const bookingInitiated = await prisma.booking.findFirst({
			where: {
				customerId: id, // Replace with the actual customer ID
				bookingState: 'initiated', // The specific booking state
				tourId: serviceId, // Replace with the actual tour ID
			},
			include: {
				customer: true, // Include customer details (optional)
				provider: true, // Include provider details (optional)
				tour: true, // Include tour details (optional)
			},
		})
		if (bookingInitiated) {
			await updateBooking(bookingInitiated.id, {
				accommodation,
				lineItems,
				guests,
				bookOwnHotels,
				selectedDate,
			})
			return NextResponse.json(bookingInitiated, { status: 200 })
		}
		const newBooking = await prisma.booking.create({
			data: {
				customer: { connect: { id: id } },
				provider: { connect: { id: tour?.creatorId } },
				tour: { connect: { id: serviceId } },
				bookingStates: [
					{
						state: 'initiated',
						createdAt: new Date(),
						by: 'customer',
						updatedAt: new Date(),
					},
				],
				bookingState: 'initiated',
				duration: 10,
				selectedDate: selectedDate,
				lineItems: lineItems,
				accommodation,
				bookOwnHotels,
			},
			include: {
				customer: true,
				tour: true,
				provider: true,
			},
		})

		return NextResponse.json(newBooking, { status: 201 })
	} catch (error) {
		console.error('Failed to confirm booking', error)
		return NextResponse.json(
			{
				error: 'Failed to create dummy booking',
				details: (error as Error).message,
			},
			{ status: 500 },
		)
	}
}
