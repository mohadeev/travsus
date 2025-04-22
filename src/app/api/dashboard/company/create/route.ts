import { NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function POST(request: Request) {
	try {
		const data = await request.json()

		// Validate required fields
		if (!data.name || !data.email) {
			return NextResponse.json(
				{ success: false, message: 'Name and email are required' },
				{ status: 400 },
			)
		}

		// Get the current user's ID
		const userData = await getUserData()

		if (!userData || !userData.id) {
			return NextResponse.json(
				{ success: false, message: 'User not found or not authenticated' },
				{ status: 401 },
			)
		}

		// Create new company using Prisma
		const newCompany = await prisma.business.create({
			data: {
				creatorId: userData.id,
				name: data.name,
				email: data.email,
				phoneNumber: data.phoneNumber || '',
				address: data.address || '',
				country: data.country || '',
				registrationNumber: data.registrationNumber || '',
			},
		})

		return NextResponse.json({
			success: true,
			message: 'Company created successfully',
			company: newCompany,
		})
	} catch (error) {
		console.error('Error creating company:', error)
		return NextResponse.json(
			{ success: false, message: 'Failed to create company' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
