export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function GET() {
	try {
		// Get the current user
		const userData = await getUserData()

		if (!userData || !userData.id) {
			return NextResponse.json(
				{ message: 'User not found or not authenticated' },
				{ status: 401 },
			)
		}

		// Find the active company for this user
		const activeCompany = await prisma.business.findFirst({
			where: {
				creatorId: userData.id,
				isActive: true,
			},
		})

		// If no active company is found, get the first company
		if (!activeCompany) {
			const firstCompany = await prisma.business.findFirst({
				where: {
					creatorId: userData.id,
				},
			})

			// If there's at least one company, set it as active
			if (firstCompany) {
				await prisma.business.update({
					where: {
						id: firstCompany.id,
					},
					data: {
						isActive: true,
					},
				})

				return NextResponse.json(firstCompany)
			}

			return NextResponse.json(
				{ message: 'No companies found' },
				{ status: 404 },
			)
		}

		return NextResponse.json(activeCompany)
	} catch (error) {
		console.error('Error fetching active company:', error)
		return NextResponse.json(
			{ message: 'Error fetching active company' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}

// Add a POST method to set a company as active
export async function POST(request: Request) {
	try {
		const { companyId } = await request.json()

		if (!companyId) {
			return NextResponse.json(
				{ message: 'Company ID is required' },
				{ status: 400 },
			)
		}

		// Get the current user
		const userData = await getUserData()

		if (!userData || !userData.id) {
			return NextResponse.json(
				{ message: 'User not found or not authenticated' },
				{ status: 401 },
			)
		}

		// First, set all companies for this user as inactive
		await prisma.business.updateMany({
			where: {
				creatorId: userData.id,
			},
			data: {
				isActive: false,
			},
		})

		// Then, set the selected company as active
		const updatedCompany = await prisma.business.update({
			where: {
				id: companyId,
				creatorId: userData.id, // Ensure the company belongs to the user
			},
			data: {
				isActive: true,
			},
		})

		return NextResponse.json(updatedCompany)
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

// Add a DELETE method to clear the active company
export async function DELETE() {
	try {
		// Get the current user
		const userData = await getUserData()

		if (!userData || !userData.id) {
			return NextResponse.json(
				{ message: 'User not found or not authenticated' },
				{ status: 401 },
			)
		}

		// Set all companies for this user as inactive
		await prisma.business.updateMany({
			where: {
				creatorId: userData.id,
			},
			data: {
				isActive: false,
			},
		})

		return NextResponse.json({ message: 'Active company cleared successfully' })
	} catch (error) {
		console.error('Error clearing active company:', error)
		return NextResponse.json(
			{ message: 'Error clearing active company' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
