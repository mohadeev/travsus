import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const id = params.id

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

		// Get the tour
		const tour = await prisma.tour.findFirst({
			where: {
				id,
				businessId: business.id,
			},
			include: {
				bookings: {
					select: {
						id: true,
					},
				},
			},
		})

		if (!tour) {
			return NextResponse.json({ message: 'Tour not found' }, { status: 404 })
		}

		return NextResponse.json({ tour })
	} catch (error) {
		console.error('Error fetching tour:', error)
		return NextResponse.json(
			{ message: 'Error fetching tour' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const id = params.id

		// Get the current user
		const userData = await getUserData({})
		console.log('userData: ', userData)

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
		const body: any = await request.json()

		// Get the tour to ensure it belongs to this business
		const existingTour = await prisma.tour.findFirst({
			where: {
				id,
				businessId: business.id,
			},
		})

		if (!existingTour) {
			return NextResponse.json(
				{ message: 'Tour not found or does not belong to your business' },
				{ status: 404 },
			)
		}

		// Update the tour
		let newObject
		if (body) {
			const { id, ...dataNewObject }: any = body
			newObject = dataNewObject
		}

		const updatedTour = await prisma.tour.update({
			where: {
				id,
			},
			data: {
				...newObject,
				updated: true,
			},
		})

		return NextResponse.json({
			success: true,
			tour: updatedTour,
		})
	} catch (error) {
		console.error('Error updating tour:', error)
		return NextResponse.json(
			{ message: 'Error updating tour', success: false },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const id = params.id

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

		// Get the tour to ensure it belongs to this business
		const existingTour = await prisma.tour.findFirst({
			where: {
				id,
				businessId: business.id,
			},
		})

		if (!existingTour) {
			return NextResponse.json(
				{ message: 'Tour not found or does not belong to your business' },
				{ status: 404 },
			)
		}

		// Delete the tour
		await prisma.tour.delete({
			where: {
				id,
			},
		})

		return NextResponse.json({
			success: true,
			message: 'Tour deleted successfully',
		})
	} catch (error) {
		console.error('Error deleting tour:', error)
		return NextResponse.json(
			{ message: 'Error deleting tour', success: false },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
