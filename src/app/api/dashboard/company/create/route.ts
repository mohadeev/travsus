export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import { db, T, must, withMeta } from '@/lib/db'
import getUserData from '@/app/api/user/getUserData'

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

		const body = await request.json().catch(() => ({}))
		const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
		const name = text(body.name, 120)
		const email = text(body.email, 160).toLowerCase()
		if (name.length < 2) {
			return NextResponse.json({ message: 'Please enter the company name.' }, { status: 400 })
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			return NextResponse.json({ message: 'Please enter a valid business email.' }, { status: 400 })
		}
		if (!['TRAVEL_AGENCY', 'STAY'].includes(body.type)) {
			return NextResponse.json({ message: 'Please choose what kind of business it is.' }, { status: 400 })
		}

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
						name,
						email,
						adminName: text(body.adminName, 120) || null,
						phoneNumber: text(body.phoneNumber, 40),
						address: text(body.address, 300) || null,
						country: text(body.country, 80) || null,
						registrationNumber: text(body.registrationNumber, 60) || null,
						type: body.type,
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
