import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { travelDate } = await request.json()

		const updatedReview = await prisma.review.update({
			where: { id: params.id },
			data: { travelDate1: new Date(travelDate) },
		})

		return NextResponse.json({ success: true, review: updatedReview })
	} catch (error) {
		console.error('Error updating review:', error)
		return NextResponse.json(
			{ error: 'Failed to update review' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
