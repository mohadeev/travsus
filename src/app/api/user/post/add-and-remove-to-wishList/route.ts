import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import updateListing from '@/app/api/api-utils/updateListing'
import currentServerUser from '@/app/api/user/currentServerUser'

export async function POST(request: NextRequest) {
	try {
		const currentUser = await currentServerUser()

		// Parse the request body to JSON
		const body = await request.json()
		const { serviceId }: any = body || {}
		console.log('Parsed body:', serviceId)
		// await updateListing(serviceId, tourData)

		// Check if `serviceId` is provided
		if (!serviceId) {
			return NextResponse.json(
				{ message: 'Tour ID is required' },
				{ status: 400 },
			)
		}

		// Update the tour listing using your utility function

		// Fetch the tour from the database using Prisma (MongoDB ID)
		const tour = await prisma.tour.findUnique({
			where: {
				id: serviceId, // MongoDB ID is a string
			},
		})

		// Check if the tour exists
		if (!tour) {
			return NextResponse.json({ message: 'Tour not found' }, { status: 404 })
		}

		// Return the tour data as a JSON response
		return NextResponse.json(tour)
	} catch (error) {
		console.error('Error fetching tour:', error)
		return NextResponse.json(
			{ message: 'Error fetching tour data' },
			{ status: 500 },
		)
	} finally {
		// Close the Prisma client connection
		await prisma.$disconnect()
	}
}
