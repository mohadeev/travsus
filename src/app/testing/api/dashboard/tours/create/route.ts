import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function POST(request: NextRequest) {
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

		// If no business found, return error
		if (!business) {
			return NextResponse.json(
				{ message: 'No business found for this user' },
				{ status: 404 },
			)
		}

		// Parse the request body
		const body = await request.json()
		const {
			name,
			price,
			description,
			duration,
			location,
			maxGuests,
			minGuests,
		} = body

		// Create the tour
		const tour = await prisma.tour.create({
			data: {
				name,
				price,
				overview: description,
				duration: duration ? Number.parseInt(duration) : undefined,
				location,
				maxGuests: maxGuests ? Number.parseInt(maxGuests) : undefined,
				minGuests: minGuests ? Number.parseInt(minGuests) : undefined,
				businessId: business.id,
				creatorId: userData.id,
				updated: false,
			},
		})

		return NextResponse.json(
			{
				success: true,
				tour,
			},
			{ status: 201 },
		)
	} catch (error) {
		console.error('Error creating tour:', error)
		return NextResponse.json(
			{ message: 'Error creating tour', success: false },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
