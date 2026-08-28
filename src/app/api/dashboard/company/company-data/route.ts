export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { type NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function GET(request: NextRequest) {
	try {
		// Retrieve user data to get the creatorId
		const userData = await getUserData()

		// Ensure userData contains creatorId
		if (!userData || !userData.id) {
			return NextResponse.json(
				{ message: 'User not found or not authenticated' },
				{ status: 401 },
			)
		}

		const creatorId = userData.id // Get creatorId from userData

		// Check if a company exists for the given creatorId
		const companies = await prisma.business.findMany({
			where: { creatorId: creatorId },
		})
		console.log('companies', companies)

		// If no company found, create a new one (optional logic)
		if (companies.length === 0) {
			const newCompany = await prisma.business.create({
				data: {
					creatorId: creatorId,
					name: '', // Change this to whatever default values you want
					email: ``, // Default email or use other logic to set this
					phoneNumber: '',
					address: '',
				},
			})
			return NextResponse.json(newCompany, { status: 201 })
		}

		// Return the found company (assuming the first one if there are multiple)
		return NextResponse.json(companies[0])
	} catch (error) {
		console.error('Error fetching company:', error)
		return NextResponse.json(
			{ message: 'Error fetching company data' },
			{ status: 500 },
		)
	} finally {
		// Close the Prisma client connection
		await prisma.$disconnect()
	}
}
