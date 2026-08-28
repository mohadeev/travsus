export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function POST(request: Request) {
	try {
		// Get the current user
		const userData = await getUserData()

		if (!userData || !userData.id) {
			return NextResponse.json(
				{ message: 'User not found or not authenticated' },
				{ status: 401 },
			)
		}

		// Get request body
		const body = await request.json()

		// Validate required fields
		if (!body.name || !body.email) {
			return NextResponse.json(
				{ message: 'Company name and email are required' },
				{ status: 400 },
			)
		}

		// Validate company type
		const validTypes = ['TRAVEL_AGENCY', 'STAY']
		if (!validTypes.includes(body.type)) {
			return NextResponse.json(
				{ message: 'Invalid company type' },
				{ status: 400 },
			)
		}

		// Check if this is the first company for the user
		const existingCompaniesCount = await prisma.business.count({
			where: {
				creatorId: userData.id,
			},
		})

		// If this is the first company, set it as active
		const isActive = existingCompaniesCount === 0

		// Create new company
		const newCompany = await prisma.business.create({
			data: {
				name: body.name,
				email: body.email,
				phoneNumber: body.phoneNumber || null,
				address: body.address || null,
				country: body.country || null,
				registrationNumber: body.registrationNumber || null,
				type: body.type,
				isActive: isActive,
				creatorId: userData.id,
			},
		})

		return NextResponse.json(
			{ success: true, company: newCompany },
			{ status: 201 },
		)
	} catch (error) {
		console.error('Error creating company:', error)
		return NextResponse.json(
			{ message: 'Error creating company' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
