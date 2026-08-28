export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma' // Adjust this path according to your project structure
import getUserData from '@/app/api/user/getUserData' // Assuming this is the utility function to fetch user data

export async function GET(request: NextRequest) {
	try {
		// Get the user data using the provided getUserData utility function
		const userData = await getUserData({})

		// Check if userData exists
		if (!userData || !userData.id) {
			return NextResponse.json(
				{ message: 'User not authenticated' },
				{ status: 401 },
			)
		}

		const userId = userData.id // Get the userId from userData

		// Fetch all bookings for the authenticated user
		const bookings = await prisma.booking.findMany({
			where: {
				customerId: userId, // Replace with the actual customer ID
			},
			include: {
				tour: true, // Optionally include tour details
			},
		})

		// If no bookings are found, return a message indicating this
		if (bookings.length === 0) {
			return NextResponse.json([], { status: 404 })
		}

		console.log('bookings:', bookings)
		// Return the bookings data
		return NextResponse.json(bookings, { status: 200 })
	} catch (error) {
		console.error('Error fetching bookings:', error)
		return NextResponse.json(
			{ message: 'Error fetching bookings' },
			{ status: 500 },
		)
	} finally {
		// Close the Prisma client connection
		await prisma.$disconnect()
	}
}
