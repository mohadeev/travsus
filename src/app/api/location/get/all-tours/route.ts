import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function GET(request: NextRequest) {
	try {
		const userData: any = await getUserData() 
		const { savedList } = userData // Extract the savedList from user data

		// Fetch all tours with images
		const allToursData = await prisma.tour.findMany({
			where: {
				images: {
					isEmpty: false, // This checks that the array has at least one element
				},
			},
		})

		// Map through all tours and check if each tour ID is in the savedList
		const modifiedToursData = allToursData.map(tour => ({
			...tour,
			liked: savedList.includes(tour.id) // Check if the tour ID is in the savedList
		}))

		// Return the modified tour data as a JSON response
		return NextResponse.json({ allToursData: modifiedToursData })
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
