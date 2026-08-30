export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import updateListing from '@/app/api/api-utils/updateListing'
import currentServerUser from '@/app/api/user/currentServerUser'
import getUserData from '../../getUserData'
import { Prisma } from '@prisma/client'

export async function POST(request: NextRequest) {
	try {
		const userData: any = await getUserData()


		// Parse the request body to JSON
		const body = await request.json()
		const { serviceId }: any = body || {}
		console.log('Parsed body:', serviceId)

		// Check if `serviceId` is provided
		if (!serviceId) {
			return NextResponse.json(
				{ message: 'Tour ID is required' },
				{ status: 400 },
			)
		}

		// Access the savedList from the currentUser
		let updatedSavedList: any = userData?.savedList
			? [...userData?.savedList]
			: []

		let isAdded = false

		// Check if the serviceId is already in the savedList
		if (updatedSavedList?.includes(serviceId)) {
			// Remove the serviceId from the savedList
			updatedSavedList = updatedSavedList?.filter((id: any) => id !== serviceId)
			isAdded = false // Indicating the serviceId was removed
		} else {
			// Add the serviceId to the savedList
			updatedSavedList?.push(serviceId)
			isAdded = true // Indicating the serviceId was added
		}

		const updateData = {
			...(updatedSavedList && {
				savedList: updatedSavedList, // Update the `savedList` only if it exists
			}),
		}

		// Update the user's savedList in the database
		await prisma.user.update({
			where: {
				id: userData?.id, // No need to fetch the user, use userData.id directly
			},
			data: updateData,
		})

		// Send the appropriate response based on whether the serviceId was added or removed
		return NextResponse.json({
			message: 'Saved list updated successfully',
			added: isAdded, // true if added, false if removed
		})
	} catch (error) {
		console.error('Error updating saved list:', error)
		return NextResponse.json(
			{ message: 'Error updating saved list' },
			{ status: 500 },
		)
	} finally {
		// Close the Prisma client connection
		await prisma.$disconnect()
	}
}
