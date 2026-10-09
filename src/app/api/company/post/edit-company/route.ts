export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { db, T, must, touch, withMeta } from '@/lib/db'
import getUserData from '@/app/api/user/getUserData'

export async function POST(request: NextRequest) {
	try {
		// Parse the incoming request body
		const userData: any = await getUserData()
		const creatorId = userData?.id
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
				{ message: 'Not authenticated' },
				{ status: 401 },
			)
		}

		// Find the business by `creatorId` using findFirst since creatorId is not unique
		const existingBusiness = must(
			await db
				.from(T.businesses)
				.select('id')
				.eq('creatorId', creatorId)
				.limit(1)
				.maybeSingle(),
		)

		if (existingBusiness) {
			// Update the existing business with partial updates
			const updatedBusiness = must(
				await db
					.from(T.businesses)
					.update(
						touch({
							...(name && { name }),
							...(email && { email }),
							...(phoneNumber && { phoneNumber }),
							...(address && { address }),
							...(country && { country }),
							...(registrationNumber && { registrationNumber }),
							...(bankName && { bankName }),
							...(accountNumber && { accountNumber }),
							...(adminName && { adminName }),
						}),
					)
					.eq('id', existingBusiness.id)
					.select('*')
					.single(),
			)

			// Return the updated business
			return NextResponse.json(updatedBusiness, { status: 200 })
		} else {
			// If no business exists, create a new one
			const newBusiness = must(
				await db
					.from(T.businesses)
					.insert(
						withMeta({
							name: name || 'Default Company Name',
							email: email || `${creatorId}@default.com`,
							phoneNumber: phoneNumber || '',
							address: address || '',
							country: country || '',
							registrationNumber: registrationNumber || '',
							bankName: bankName || '',
							accountNumber: accountNumber || '',
							creatorId,
							adminName: adminName || '',
						}),
					)
					.select('*')
					.single(),
			)

			// Return the newly created business
			return NextResponse.json(newBusiness, { status: 201 })
		}
	} catch (error) {
		console.error('Error updating or creating business:', error)
		return NextResponse.json(
			{ message: 'Error updating or creating business details' },
			{ status: 500 },
		)
	}
}
