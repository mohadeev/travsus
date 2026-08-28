export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function GET(request: NextRequest) {
	try {
		// Get the current user
		const userData = await getUserData()

		// Check if user is authenticated
		if (!userData || !userData.id) {
			return NextResponse.json(
				{ message: 'User not found or not authenticated' },
				{ status: 401 },
			)
		}

		// Get the business associated with this user
		const business = await prisma.business.findFirst({
			where: {
				creatorId: userData.id,
			},
		})

		// If no business found, return empty array
		if (!business) {
			return NextResponse.json({ tours: [] })
		}

		// Get search query from URL if present
		const searchQuery = request.nextUrl.searchParams.get('search') || ''

		// Get all tours associated with this business
		const tours = await prisma.tour.findMany({
			where: {
				businessId: business.id,
				...(searchQuery
					? {
							name: {
								contains: searchQuery,
								mode: 'insensitive',
							},
						}
					: {}),
			},
			include: {
				bookings: {
					select: {
						id: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		// Format the tours data for the frontend
		const formattedTours = tours.map((tour) => ({
			id: tour.id,
			name: tour.name || 'Untitled Tour',
			price: tour.price || '$0',
			status: tour.updated ? 'active' : 'draft',
			createdAt: tour.createdAt.toISOString().split('T')[0],
			bookings: tour.bookings.length,
		}))

		return NextResponse.json({ tours: formattedTours })
	} catch (error) {
		console.error('Error fetching tours:', error)
		return NextResponse.json(
			{ message: 'Error fetching tours' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
