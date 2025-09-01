import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
	try {
		const reviews = await prisma.review.findMany({
			take: 10,
			include: {
				user: {
					select: {
						accountData: true,
						profileImage: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return NextResponse.json(reviews)
	} catch (error) {
		console.error('Error fetching reviews:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch reviews' },
			{ status: 500 },
		)
	}
}
