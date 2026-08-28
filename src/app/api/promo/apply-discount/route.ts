export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
	try {
		console.log('POST /api/apply-promo - Applying promo code')

		// 1️⃣ Extract bookingId from referer URL
		const referer = request.headers.get('referer') || ''
		const url = new URL(referer)
		const bookingId = url.searchParams.get('bookingId')
		console.log('referer')

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
		const promo = await prisma.referralLink.findUnique({
			where: { code },
		})

		if (!promo) {
			return NextResponse.json({ error: 'Invalid promo code' }, { status: 400 })
		}

		// 4️⃣ Get the booking
		const booking = await prisma.booking.findUnique({
			where: { id: bookingId },
			select: { lineItems: true },
		})

		if (!booking) {
			return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
		}

		// 5️⃣ Calculate total applicable price
		const totalApplicablePrice = booking.lineItems
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
		const updatedBooking = await prisma.booking.update({
			where: { id: bookingId },
			data: {
				lineItems: {
					push: {
						description: `Promo Code Applied (${code})`,
						unitPrice: refundAmount, // ✅ Correct calculation
						totalPrice: refundAmount, // ✅ Correct refund
						totalGuests: 0,
						serviceQuantity: 1,
						includeInTotal: true,
						currency: 'EUR',
					},
				},
			},
		})
		console.log('Promo code applied successfully', updatedBooking.lineItems)
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
