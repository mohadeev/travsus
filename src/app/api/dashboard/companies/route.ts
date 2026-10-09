export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must } from '@/lib/db'

export async function GET() {
	try {
		const userData = await getUserData()
		if (!userData || !userData.id) {
			return NextResponse.json(
				{ message: 'User not found or not authenticated' },
				{ status: 401 },
			)
		}

		// Active companies first, then alphabetically
		const companies = must(
			await db
				.from(T.businesses)
				.select('*')
				.eq('creatorId', userData.id)
				.order('isActive', { ascending: false })
				.order('name', { ascending: true }),
		)

		return NextResponse.json(companies)
	} catch (error) {
		console.error('Error fetching companies:', error)
		return NextResponse.json(
			{ message: 'Error fetching companies' },
			{ status: 500 },
		)
	}
}
