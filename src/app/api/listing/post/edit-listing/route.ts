export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import updateListing from '@/app/api/api-utils/updateListing'

export async function POST(request: NextRequest) {
	try {
		// Parse the request body to JSON
		const body = await request.json()
		const tourData: any = body?.tourData
		const tourId: any = tourData?.id // Make sure you're extracting tourId from body

		// console.log('Parsed body:', tourId)
		await updateListing(tourId, tourData)

		// Check if `tourId` is provided
		if (!tourId) {
			return NextResponse.json(
				{ message: 'Tour ID is required' },
				{ status: 400 },
			)
		}

		// Update the tour listing using your utility function

		// Fetch the tour from the database using Prisma (MongoDB ID)
		const tour = await prisma.tour.findUnique({
			where: {
				id: tourId, // MongoDB ID is a string
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
