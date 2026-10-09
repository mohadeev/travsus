export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from 'next/server'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must, asDate } from '@/lib/db'
import { getBusinessId } from './ownTour'

export async function GET(request: NextRequest) {
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
			return NextResponse.json({ tours: [] })
		}

		const searchQuery = request.nextUrl.searchParams.get('search') || ''

		let query = db
			.from(T.tours)
			.select(`id, name, price, updated, createdAt, bookings:${T.bookings}(count)`)
			.eq('businessId', businessId)
			.order('createdAt', { ascending: false })
		if (searchQuery) query = query.ilike('name', `%${searchQuery.replace(/[%_]/g, '\\$&')}%`)

		const tours: any[] = must(await query) ?? []

		const formattedTours = tours.map((tour) => ({
			id: tour.id,
			name: tour.name || 'Untitled Tour',
			price: tour.price || '$0',
			status: tour.updated ? 'active' : 'draft',
			createdAt: asDate(tour.createdAt)?.toISOString().split('T')[0],
			bookings: tour.bookings?.[0]?.count ?? 0,
		}))

		return NextResponse.json({ tours: formattedTours })
	} catch (error) {
		console.error('Error fetching tours:', error)
		return NextResponse.json(
			{ message: 'Error fetching tours' },
			{ status: 500 },
		)
	}
}
