export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import getUserData from '../user/getUserData'
import { updateBooking } from '../api-utils/actions/booking/updateBooking'
import { createOrderNumber } from '@/app/actions/generateOrderNumber'

const prisma = new PrismaClient()
function extractTourId(url: any) {
	// Split the URL by slashes
	const parts = url.split('/')

	// The ID is always the second to last part (before the query parameters)
	const idWithParams = parts[parts.length - 1]

	// If there are query parameters after the ID, split them off
	const id = idWithParams.split('?')[0]

	return id
}

export async function POST(request: NextRequest) {
	const { id }: any = await getUserData({})
	const referer = request.headers.get('referer') || ''
	console.log('referer: ', referer)
	const url = new URL(referer)
	const searchParams = url.searchParams
	const serviceIdParam: string = searchParams.get('serviceId') || ''
	const serviceId = serviceIdParam || extractTourId(referer) || ''

	try {
		const tour = await prisma.tour.findFirst({
			where: { id: serviceId },
		})
		const body = await request.json()
		const { accommodation, lineItems, guests, bookOwnHotels, selectedDate } =
			body

		const bookingInitiated: any = null
		// await prisma.booking.findFirst({
		// 	where: {
		// 		customerId: id, // Replace with the actual customer ID
		// 		bookingState: 'initiated', // The specific booking state
		// 		tourId: serviceId, // Replace with the actual tour ID
		// 	},
		// 	include: {
		// 		customer: true, // Include customer details (optional)
		// 		provider: true, // Include provider details (optional)
		// 		tour: true, // Include tour details (optional)
		// 	},
		// })
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
		const numberRef = await createOrderNumber()
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
				...numberRef,
			},
			include: {
				customer: true,
				tour: true,
				provider: true,
			},
		})

		return NextResponse.json(newBooking, { status: 201 })
	} catch (error) {
		console.error('Error creating booking:', error)
		return NextResponse.json(
			{
				serviceId: serviceId,
				error: 'Failed to create dummy booking',
				details: (error as Error).message,
			},
			{ status: 500 },
		)
	}
}
