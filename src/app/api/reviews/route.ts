import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
	try {
		const reviews = await prisma.review.findMany({
			include: {
				user: {
					select: {
						id: true,
						name: true,
						username: true,
						email: true,
						accountData: true,
					},
				},
			},
			orderBy: { createdAt: 'desc' },
		})

		const formattedReviews = reviews.map((review) => ({
			id: review.id,
			travelDate1: review.travelDate1,
			content: review.content,
			rating: review.rating,
			userName:
				review.user?.accountData?.firstname ||
				review.user?.name ||
				review.user?.username ||
				'Anonymous',
			title: review.title,
			tourId: review.tourId,
		}))

		return NextResponse.json(formattedReviews)
	} catch (error) {
		console.error('Error fetching reviews:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch reviews' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
