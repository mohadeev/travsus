import prisma from '@/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import getUserData from '../../getUserData'

// Function to check if a string is a valid MongoDB ObjectID
function isValidObjectId(id: string) {
	// Check if the string matches the ObjectID format (24 hex characters)
	return /^[0-9a-fA-F]{24}$/.test(id)
}

export async function GET(request: NextRequest) {
	console.log('GET')
	const cookies = request.headers.get('cookie')

	try {
		// Fetch user data and savedList (the array of tour IDs)
		const userData: any = await getUserData() 
		let { savedList } = userData

		console.log("currentUser", userData)

		// Validate IDs in savedList
		savedList = savedList?.filter((id: string) => isValidObjectId(id)) || []

		// Fetch the session to verify the user
		const session: any = await getServerSession(authOptions)
		if (!session || !session?.user?.email) {
			return NextResponse.json(
				{ message: 'Not authenticated' },
				{ status: 401 },
			)
		}

		// Get the current user from the session
		const user: any = await prisma.user.findUnique({
			where: { email: session.user.email },
		})
		if (!user) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 })
		}

		// If no valid IDs, return early
		if (savedList.length === 0) {
			return NextResponse.json({ message: 'No valid tour IDs found' }, { status: 400 })
		}

		// Fetch tours that match any of the valid IDs in the savedList array
		const tours = await prisma.tour.findMany({
			where: {
				id: {
					in: savedList, // Filter tours whose IDs are in the valid savedList array
				},
				images: {
					isEmpty: false, // Ensure that tours have images
				},
			},
		})

		// Add savedToWishList: true to each tour
		const list = tours.map(tour => ({
			...tour,
			liked: true, // Add the flag to each tour
		}))

		console.log("tour list:", list)

		// Send the fetched tours as a response
		return NextResponse.json({ list, message: 'tours_found' })
	} catch (error) {
		console.error('Error fetching user data:', error)
		return NextResponse.error()
	}
}
