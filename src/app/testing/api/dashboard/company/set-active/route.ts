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
		if (!body.companyId) {
			return NextResponse.json(
				{ message: 'Company ID is required' },
				{ status: 400 },
			)
		}

		// Check if the company exists and belongs to the user
		const company = await prisma.business.findFirst({
			where: {
				id: body.companyId,
				creatorId: userData.id,
			},
		})

		if (!company) {
			return NextResponse.json(
				{ message: 'Company not found or not authorized' },
				{ status: 404 },
			)
		}

		// First, deactivate all companies for this user
		await prisma.business.updateMany({
			where: {
				creatorId: userData.id,
			},
			data: {
				isActive: false,
			},
		})

		// Then, activate the selected company
		const updatedCompany = await prisma.business.update({
			where: {
				id: body.companyId,
			},
			data: {
				isActive: true,
			},
		})

		return NextResponse.json({ success: true, company: updatedCompany })
	} catch (error) {
		console.error('Error setting active company:', error)
		return NextResponse.json(
			{ message: 'Error setting active company' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
