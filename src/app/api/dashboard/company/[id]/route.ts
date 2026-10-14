export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from 'next/server'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must, touch } from '@/lib/db'
import { companyFields } from '../fields'

// Only the company's creator can read or edit it (it holds bank details)
export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const userData = await getUserData()
		if (!userData?.id) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
		}

		const company = must(
			await db
				.from(T.businesses)
				.select('*')
				.match({ id: params.id, creatorId: userData.id })
				.maybeSingle(),
		)

		if (!company) {
			return NextResponse.json({ error: 'Company not found' }, { status: 404 })
		}

		return NextResponse.json(company)
	} catch (error) {
		console.error('Error fetching company:', error)
		return NextResponse.json(
			{ error: 'Failed to fetch company' },
			{ status: 500 },
		)
	}
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const userData = await getUserData()
		if (!userData?.id) {
			return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
		}
		const { fields, error } = companyFields(await request.json().catch(() => ({})))
		if (!fields) return NextResponse.json({ message: error }, { status: 400 })
		const updatedCompany = must(
			await db
				.from(T.businesses)
				.update(touch(fields))
				.match({ id: params.id, creatorId: userData.id })
				.select('*')
				.maybeSingle(),
		)

		if (!updatedCompany) {
			return NextResponse.json({ error: 'Company not found' }, { status: 404 })
		}

		return NextResponse.json(updatedCompany)
	} catch (error) {
		console.error('Error updating company:', error)
		return NextResponse.json(
			{ error: 'Failed to update company' },
			{ status: 500 },
		)
	}
}
