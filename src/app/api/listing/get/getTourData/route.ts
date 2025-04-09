import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export const dynamic = 'force-dynamic' // This ensures the route is always dynamic

export async function GET(request: NextRequest) {
	try {
		const userData: any = await getUserData()
		const { savedList } = userData || {}
		// console.log('userData:', userData)

		// Extract query parameters from the request URL
		const { searchParams } = new URL(request.url)
		const tourId = searchParams.get('id')
		const isLiked = savedList?.includes(tourId)

		// Check if `id` parameter is provided
		if (!tourId) {
			return NextResponse.json(
				{ message: 'service-id-is-required' },
				{ status: 400 },
			)
		}

		// Fetch the tour along with its address and geo-coordinates from the database using Prisma (MongoDB ID)
		const tour = await prisma.tour.findUnique({
			where: {
				id: tourId, // MongoDB ID is a string
			},
			include: {
				startAddress: true,
				endAddress: true,
				// address: {
				// 	include: {
				// 		geoCoordinates: true, // Include geoCoordinates in the address
				// 	},
				// },
			},
		})

		// console.log('accommodations', JSON.stringify(tour?.accommodations))
		// console.log('pricingTiers', JSON.stringify(tour?.pricingTiers))
		if (!tour) {
			return NextResponse.json(
				{ message: 'service-not-found' },
				{ status: 404 },
			)
		}
		const newTour = { ...tour, ...{ liked: isLiked } }
		return NextResponse.json(newTour)
	} catch (error) {
		// console.error('Error fetching tour:', error)
		console.log('error:', error)
		return NextResponse.json(
			{ message: 'Error fetching tour data', code: error, error },
			{ status: 500 },
		)
	} finally {
		// Close the Prisma client connection
		await prisma.$disconnect()
	}
}
