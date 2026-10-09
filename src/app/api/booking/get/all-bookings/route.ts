export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { db, T, must } from '@/lib/db'
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
		const bookings = must(
			await db.from(T.bookings).select(`*, tour:${T.tours}(*)`).eq('customerId', userId),
		)

		// If no bookings are found, return a message indicating this
		if (bookings.length === 0) {
			return NextResponse.json([], { status: 404 })
		}

		// Return the bookings data
		return NextResponse.json(bookings, { status: 200 })
	} catch (error) {
		console.error('Error fetching bookings:', error)
		return NextResponse.json(
			{ message: 'Error fetching bookings' },
			{ status: 500 },
		)
	}
}
