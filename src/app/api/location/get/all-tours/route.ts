import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
export async function GET(request: NextRequest) {
	try {
		// Extract query parameters from the request URL
		const { searchParams } = new URL(request.url)
		const tourId = searchParams.get('id')

		const allToursData = await prisma.tour.findMany({
			where: {
				images: {
					isEmpty: false, // This checks that the array has at least one element
				},
			},
			// Example filter:
			// where: {
			//   start: { name: "Marrakech" },
			//   creator: { id: "openai", model: "gpt-4-1106-preview" },
			// },
			// include: {
			// 	// Include related models if necessary
			// 	// start: true,
			// 	// creator: true,
			// },
		})
		// console.log('allToursData', allToursData)

		// Return the tour data as a JSON response
		return NextResponse.json({ allToursData })
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
