export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import getUserData from '../user/getUserData'
import { createOrderNumber } from '@/app/actions/generateOrderNumber'
import { db, T, must, withMeta } from '@/lib/db'

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
	const { id }: any = (await getUserData({})) ?? {}
	if (!id) {
		return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
	}
	const referer = request.headers.get('referer') || ''
	console.log('referer: ', referer)
	const url = new URL(referer)
	const searchParams = url.searchParams
	const serviceIdParam: string = searchParams.get('serviceId') || ''
	const serviceId = serviceIdParam || extractTourId(referer) || ''

	try {
		const tour = must(
			await db.from(T.tours).select('creatorId').eq('id', serviceId).maybeSingle(),
		)
		if (!tour) {
			return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
		}
		const body = await request.json()
		const { accommodation, lineItems, guests, bookOwnHotels, selectedDate } =
			body

		const numberRef = await createOrderNumber()
		if (!numberRef) throw new Error('Could not generate order number')
		const now = new Date().toISOString()
		const newBooking = must(
			await db
				.from(T.bookings)
				.insert(
					withMeta({
						customerId: id,
						providerId: tour.creatorId,
						tourId: serviceId,
						bookingStates: [
							{ state: 'initiated', createdAt: now, by: 'customer', updatedAt: now },
						],
						bookingState: 'initiated',
						duration: 10,
						selectedDate,
						lineItems: lineItems ?? [],
						accommodation,
						bookOwnHotels,
						guests,
						...numberRef,
					}),
				)
				.select('*')
				.single(),
		)

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
