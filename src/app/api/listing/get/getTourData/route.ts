import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'

export const dynamic = 'force-dynamic' // This ensures the route is always dynamic

export async function GET(request: NextRequest) {
	try {
		// Extract query parameters from the request URL
		const { searchParams } = new URL(request.url)
		const tourId = searchParams.get('id')

		// Check if `id` parameter is provided
		if (!tourId) {
			return NextResponse.json(
				{ message: 'Tour ID is required' },
				{ status: 400 },
			)
		}

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
