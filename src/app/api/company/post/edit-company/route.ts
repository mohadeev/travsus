export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma'
import getUserData from '@/app/api/user/getUserData'

export async function POST(request: NextRequest) {
	try {
		// Parse the incoming request body
		const userData: any = await getUserData()
		const creatorId = userData.id
		const body = await request.json()
		const {
			name,
			email,
			phoneNumber,
			address,
			country,
			registrationNumber,
			bankName,
			accountNumber,
			adminName,
		} = body

		// Validate that creatorId is provided since it's required to find or create the business
		if (!creatorId) {
			return NextResponse.json(
				{ message: 'CreatorId is required' },
				{ status: 400 },
			)
		}

		// Find the business by `creatorId` using findFirst since creatorId is not unique
		const existingBusiness = await prisma.business.findFirst({
			where: {
				creatorId: creatorId,
			},
		})

		if (existingBusiness) {
			// Update the existing business with partial updates
			const updatedBusiness = await prisma.business.update({
				where: {
					id: existingBusiness.id, // Use unique `id` to update
				},
				data: {
					...(name && { name }),
					...(email && { email }),
					...(phoneNumber && { phoneNumber }),
					...(address && { address }),
					...(country && { country }),
					...(registrationNumber && { registrationNumber }),
					...(bankName && { bankName }),
					...(accountNumber && { accountNumber }),
					...(adminName && { adminName }),
				},
			})

			// Return the updated business
			return NextResponse.json(updatedBusiness, { status: 200 })
		} else {
			// If no business exists, create a new one
			const newBusiness = await prisma.business.create({
				data: {
					name: name || 'Default Company Name',
					email: email || `${creatorId}@default.com`, // Ensure some default email if none provided
					phoneNumber: phoneNumber || '',
					address: address || '',
					country: country || '',
					registrationNumber: registrationNumber || '',
					bankName: bankName || '',
					accountNumber: accountNumber || '',
					creatorId: creatorId,
					adminName: adminName || '',
				},
			})

			// Return the newly created business
			return NextResponse.json(newBusiness, { status: 201 })
		}
	} catch (error) {
		console.error('Error updating or creating business:', error)
		return NextResponse.json(
			{ message: 'Error updating or creating business details' },
			{ status: 500 },
		)
	} finally {
		// Close the Prisma client connection
		await prisma.$disconnect()
	}
}
