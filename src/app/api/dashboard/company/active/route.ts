export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must, touch } from '@/lib/db'
import { setActiveCompany } from '../activeCompany'

const unauthenticated = () =>
	NextResponse.json(
		{ message: 'User not found or not authenticated' },
		{ status: 401 },
	)

export async function GET() {
	try {
		const userData = await getUserData()
		if (!userData || !userData.id) return unauthenticated()

		const companies = must(
			await db
				.from(T.businesses)
				.select('*')
				.eq('creatorId', userData.id)
				.order('isActive', { ascending: false })
				.limit(1),
		)
		const company = companies?.[0]

		if (!company) {
			return NextResponse.json({ message: 'No companies found' }, { status: 404 })
		}

		// No active company yet: make the first one active
		if (!company.isActive) {
			must(
				await db
					.from(T.businesses)
					.update(touch({ isActive: true }))
					.eq('id', company.id),
			)
		}

		return NextResponse.json(company)
	} catch (error) {
		console.error('Error fetching active company:', error)
		return NextResponse.json(
			{ message: 'Error fetching active company' },
			{ status: 500 },
		)
	}
}

// Set a company as active
export async function POST(request: Request) {
	try {
		const { companyId } = await request.json()

		if (!companyId) {
			return NextResponse.json(
				{ message: 'Company ID is required' },
				{ status: 400 },
			)
		}

		const userData = await getUserData()
		if (!userData || !userData.id) return unauthenticated()

		const updatedCompany = await setActiveCompany(userData.id, companyId)
		if (!updatedCompany) {
			return NextResponse.json({ message: 'Company not found' }, { status: 404 })
		}
		return NextResponse.json(updatedCompany)
	} catch (error) {
		console.error('Error setting active company:', error)
		return NextResponse.json(
			{ message: 'Error setting active company' },
			{ status: 500 },
		)
	}
}

// Clear the active company
export async function DELETE() {
	try {
		const userData = await getUserData()
		if (!userData || !userData.id) return unauthenticated()

		must(
			await db
				.from(T.businesses)
				.update(touch({ isActive: false }))
				.eq('creatorId', userData.id),
		)

		return NextResponse.json({ message: 'Active company cleared successfully' })
	} catch (error) {
		console.error('Error clearing active company:', error)
		return NextResponse.json(
			{ message: 'Error clearing active company' },
			{ status: 500 },
		)
	}
}
