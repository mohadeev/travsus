export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function POST(request: NextRequest) {
	try {
		// Get the authenticated user data
		const userData: any = await getUserData()

		// Check if user data is available
		if (!userData || !userData.id || !userData.email || !userData.name) {
			return NextResponse.json(
				{ message: 'User data is incomplete or not authenticated' },
				{ status: 401 },
			)
		}

		// Parse the incoming request body
		const body = await request.json()
		const { phoneNumber } = body

		// Validate required fields (phoneNumber is passed from the request body)
		if (!phoneNumber) {
			return NextResponse.json(
				{ message: 'Phone number is required' },
				{ status: 400 },
			)
		}

		// Check if a business with the same email (from userData) already exists
		const existingBusiness = await prisma.business.findUnique({
			where: { email: userData.email }, // Ensure uniqueness of email
		})

		if (existingBusiness) {
			return NextResponse.json(
				{ message: 'Business with this email already exists' },
				{ status: 409 },
			)
		}

		// Create a new business record using user data and phone number from request
		const newBusiness = await prisma.business.create({
			data: {
				name: userData.name, // From userData
				email: userData.email, // From userData
				phoneNumber: phoneNumber, // From request body
				creatorId: userData.id, // User ID as the creator
			},
		})

		// Return the newly created business as a response
		return NextResponse.json(newBusiness, { status: 201 })
	} catch (error) {
		console.error('Error creating business:', error)
		return NextResponse.json(
			{ message: 'Error creating business' },
			{ status: 500 },
		)
	} finally {
		// Close the Prisma client connection
		await prisma.$disconnect()
	}
}
