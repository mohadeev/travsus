export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from 'next/server'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must, withMeta } from '@/lib/db'

export async function GET(request: NextRequest) {
	try {
		const userData = await getUserData()
		if (!userData || !userData.id) {
			return NextResponse.json(
				{ message: 'User not found or not authenticated' },
				{ status: 401 },
			)
		}

		const company = must(
			await db
				.from(T.businesses)
				.select('*')
				.eq('creatorId', userData.id)
				.limit(1)
				.maybeSingle(),
		)

		// First visit: create an empty company for the user
		if (!company) {
			const newCompany = must(
				await db
					.from(T.businesses)
					.insert(
						withMeta({
							creatorId: userData.id,
							name: '',
							email: '',
							phoneNumber: '',
							address: '',
						}),
					)
					.select('*')
					.single(),
			)
			return NextResponse.json(newCompany, { status: 201 })
		}

		return NextResponse.json(company)
	} catch (error) {
		console.error('Error fetching company:', error)
		return NextResponse.json(
			{ message: 'Error fetching company data' },
			{ status: 500 },
		)
	}
}
