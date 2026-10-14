export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { db, T, must, withMeta } from '@/lib/db'
import getUserData from '@/app/api/user/getUserData'
import { companyFields } from '../fields'

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

		const { fields, error } = companyFields(await request.json().catch(() => ({})))
		if (!fields) return NextResponse.json({ message: error }, { status: 400 })

		// Check if this is the first company for the user
		const { count: existingCompaniesCount, error: countError } = await db
			.from(T.businesses)
			.select('id', { count: 'exact', head: true })
			.eq('creatorId', userData.id)
		if (countError) throw new Error(countError.message)

		// If this is the first company, set it as active
		const isActive = existingCompaniesCount === 0

		// Create new company
		const newCompany = must(
			await db
				.from(T.businesses)
				.insert(
					withMeta({
						...fields,
						isActive,
						creatorId: userData.id,
					}),
				)
				.select('*')
				.single(),
		)

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
	}
}
