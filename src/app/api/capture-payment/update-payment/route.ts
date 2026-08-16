import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
	const bookingInitiated = await prisma.booking.findFirst({
		// where: { id: '6760ad2aef5c1bf3f7c55243' },
		include: {
			// customer: true,
			// provider: { include: { businesses: true } },
			// tour: true,
			paymentMethod: true,
		},
	})
	console.log('bookingInitiated:', bookingInitiated)
	// try {
	// 	await updateDefaultPaymentMethod(
	// 		'673a1768ec99ae645fc474a9',
	// 		'673a2e9aec99ae645fc4750d',
	// 	)
	return NextResponse.json({
		success: true,
		message: 'Default payment method updated successfully',
	})
	// } catch (error) {
	// 	console.error('Error in POST handler:', error)
	// 	return NextResponse.json(
	// 		{ success: false, message: 'Failed to update default payment method' },
	// 		{ status: 500 },
	// 	)
	// }
}

async function updateDefaultPaymentMethod(
	userId: string,
	paymentMethodId: string,
) {
	try {
		await prisma.$transaction([
			prisma.paymentMethod.updateMany({
				where: { userId, isDefault: true },
				data: { isDefault: false },
			}),
			prisma.paymentMethod.update({
				where: { id: paymentMethodId },
				data: { isDefault: true },
			}),
		])
	} catch (error) {
		console.error('Error updating default payment method:', error)
		// Rethrow the error to be caught by the main try-catch block
		throw error
	}
}
