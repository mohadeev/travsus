export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { db, T, must, touch } from '@/lib/db'
import getUserData from '../../user/getUserData'

const PROMO_PREFIX = 'Promo Code Applied'

export async function POST(request: NextRequest) {
	try {
		console.log('POST /api/apply-promo - Applying promo code')

		// 1️⃣ Extract bookingId from referer URL
		const referer = request.headers.get('referer') || ''
		const url = new URL(referer)
		const bookingId = url.searchParams.get('bookingId')

		if (!bookingId) {
			return NextResponse.json(
				{ error: 'Booking ID is required' },
				{ status: 400 },
			)
		}

		// 2️⃣ Get promo code from request body
		const { code } = await request.json()

		if (!code) {
			return NextResponse.json(
				{ error: 'Promo Code is required' },
				{ status: 400 },
			)
		}

		// 3️⃣ Find the promo code
		const userData: any = await getUserData()
		if (!userData?.id) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
		}

		const promo = must(
			await db
				.from(T.referralLinks)
				.select('commissionType, commissionValue')
				.eq('code', code)
				.maybeSingle(),
		)

		if (!promo) {
			return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 })
		}

		// 4️⃣ Get the booking
		const booking = must(
			await db
				.from(T.bookings)
				.select('lineItems')
				.match({ id: bookingId, customerId: userData.id })
				.maybeSingle(),
		)

		if (!booking) {
			return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
		}

		const lineItems: any[] = booking.lineItems ?? []
		if (lineItems.some((item) => item.description?.startsWith(PROMO_PREFIX))) {
			return NextResponse.json(
				{ error: 'A promo code is already applied to this booking' },
				{ status: 400 },
			)
		}

		// 5️⃣ Calculate total applicable price
		const totalApplicablePrice = lineItems
			.filter((item) => item.includeInTotal)
			.reduce((sum, item) => sum + item.totalPrice, 0)

		if (totalApplicablePrice === 0) {
			return NextResponse.json(
				{ error: 'No applicable line items for discount' },
				{ status: 400 },
			)
		}

		// 6️⃣ Calculate refund amount
		let refundAmount = 0
		if (promo.commissionType === 'percentage') {
			refundAmount = -(totalApplicablePrice * (promo.commissionValue / 100)) // Percentage discount
		} else {
			refundAmount = -Math.abs(promo.commissionValue) // Fixed amount discount
		}

		if (isNaN(refundAmount)) refundAmount = 0

		// 7️⃣ Update booking with promo code applied
		const updatedBooking = must(
			await db
				.from(T.bookings)
				.update(
					touch({
						lineItems: [
							...lineItems,
							{
								description: `${PROMO_PREFIX} (${code})`,
								unitPrice: refundAmount,
								totalPrice: refundAmount,
								totalGuests: 0,
								serviceQuantity: 1,
								includeInTotal: true,
								currency: 'EUR',
							},
						],
					}),
				)
				.eq('id', bookingId)
				.select('lineItems')
				.single(),
		)
		return NextResponse.json(
			{ lineItems: updatedBooking.lineItems, discountApplied: true },
			{ status: 200 },
		)
	} catch (error) {
		console.error('Error applying promo code:', error)
		return NextResponse.json(
			{
				error: 'Failed to apply promo code',
				details: (error as Error).message,
			},
			{ status: 500 },
		)
	}
}
