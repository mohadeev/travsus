export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from 'next/server'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must, withMeta, EMPTY_TOUR_LISTS } from '@/lib/db'
import { getBusinessId } from '../ownTour'

export async function POST(request: NextRequest) {
	try {
		const userData = await getUserData()
		if (!userData || !userData.id) {
			return NextResponse.json(
				{ message: 'User not found or not authenticated' },
				{ status: 401 },
			)
		}

		const businessId = await getBusinessId(userData.id)
		if (!businessId) {
			return NextResponse.json(
				{ message: 'No business found for this user' },
				{ status: 404 },
			)
		}

		const { name, price, description, duration } = await request.json()

		const tour = must(
			await db
				.from(T.tours)
				.insert(
					withMeta({
						...EMPTY_TOUR_LISTS,
						name,
						price,
						overview: description,
						duration: duration ? Number.parseInt(duration) : null,
						businessId,
						creatorId: userData.id,
						updated: false,
					}),
				)
				.select('*')
				.single(),
		)

		return NextResponse.json({ success: true, tour }, { status: 201 })
	} catch (error) {
		console.error('Error creating tour:', error)
		return NextResponse.json(
			{ message: 'Error creating tour', success: false },
			{ status: 500 },
		)
	}
}
