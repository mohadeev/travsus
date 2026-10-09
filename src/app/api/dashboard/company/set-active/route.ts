export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import getUserData from '@/app/api/user/getUserData'
import { setActiveCompany } from '../activeCompany'

export async function POST(request: Request) {
	try {
		const userData = await getUserData()
		if (!userData || !userData.id) {
			return NextResponse.json(
				{ message: 'User not found or not authenticated' },
				{ status: 401 },
			)
		}

		const body = await request.json()
		if (!body.companyId) {
			return NextResponse.json(
				{ message: 'Company ID is required' },
				{ status: 400 },
			)
		}

		const company = await setActiveCompany(userData.id, body.companyId)
		if (!company) {
			return NextResponse.json(
				{ message: 'Company not found or not authorized' },
				{ status: 404 },
			)
		}

		return NextResponse.json({ success: true, company })
	} catch (error) {
		console.error('Error setting active company:', error)
		return NextResponse.json(
			{ message: 'Error setting active company' },
			{ status: 500 },
		)
	}
}
