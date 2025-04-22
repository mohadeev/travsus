import { NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function GET() {
	try {
		// Retrieve user data to get the creatorId
		const userData = await getUserData()
		console.log('User data for companies:', userData)

		// Ensure userData contains creatorId
		if (!userData || !userData.id) {
			return NextResponse.json(
				{ message: 'User not found or not authenticated' },
				{ status: 401 },
			)
		}

		const creatorId = userData.id

		// Fetch all companies (businesses) for the current user
		const companies = await prisma.business.findMany({
			where: { creatorId: creatorId },
			orderBy: [
				{ isActive: 'desc' }, // Active companies first
				{ name: 'asc' }, // Then alphabetically by name
			],
		})

		console.log('Found companies:', companies)

		return NextResponse.json({ companies })
	} catch (error) {
		console.error('Error fetching companies:', error)
		return NextResponse.json(
			{ message: 'Error fetching companies' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
