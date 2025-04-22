import { type NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const companyId = params.id

		// Fetch the company from the database
		const company = await db.business.findUnique({
			where: {
				id: companyId,
			},
		})

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
		const companyId = params.id
		const data = await request.json()

		// Update the company in the database
		const updatedCompany = await db.business.update({
			where: {
				id: companyId,
			},
			data: {
				name: data.name,
				description: data.description,
				type: data.type,
				// Add other fields as needed
			},
		})

		return NextResponse.json(updatedCompany)
	} catch (error) {
		console.error('Error updating company:', error)
		return NextResponse.json(
			{ error: 'Failed to update company' },
			{ status: 500 },
		)
	}
}
