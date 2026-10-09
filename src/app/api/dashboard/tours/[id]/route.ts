export const dynamic = 'force-dynamic'
import { type NextRequest, NextResponse } from 'next/server'
import getUserData from '@/app/api/user/getUserData'
import { db, T, must, touch } from '@/lib/db'
import { getBusinessId, PROTECTED_TOUR_FIELDS } from '../ownTour'

type Params = { params: { id: string } }

/** Resolves the signed-in user's business, or an error response. */
async function requireBusiness() {
	const userData = await getUserData()
	if (!userData || !userData.id) {
		return {
			error: NextResponse.json(
				{ message: 'User not found or not authenticated' },
				{ status: 401 },
			),
		}
	}
	const businessId = await getBusinessId(userData.id)
	if (!businessId) {
		return {
			error: NextResponse.json(
				{ message: 'No business found for this user' },
				{ status: 404 },
			),
		}
	}
	return { businessId }
}

const notFound = () =>
	NextResponse.json(
		{ message: 'Tour not found or does not belong to your business' },
		{ status: 404 },
	)

export async function GET(request: NextRequest, { params }: Params) {
	try {
		const { businessId, error } = await requireBusiness()
		if (error) return error

		const tour = must(
			await db
				.from(T.tours)
				.select(`*, bookings:${T.bookings}(id)`)
				.match({ id: params.id, businessId })
				.maybeSingle(),
		)

		if (!tour) {
			return NextResponse.json({ message: 'Tour not found' }, { status: 404 })
		}

		return NextResponse.json({ tour })
	} catch (error) {
		console.error('Error fetching tour:', error)
		return NextResponse.json(
			{ message: 'Error fetching tour' },
			{ status: 500 },
		)
	}
}

export async function PUT(request: NextRequest, { params }: Params) {
	try {
		const { businessId, error } = await requireBusiness()
		if (error) return error

		const body: Record<string, any> = (await request.json()) ?? {}
		const changes = { ...body }
		for (const field of PROTECTED_TOUR_FIELDS) delete changes[field]

		const updatedTour = must(
			await db
				.from(T.tours)
				.update(touch({ ...changes, updated: true }))
				.match({ id: params.id, businessId })
				.select('*')
				.maybeSingle(),
		)

		if (!updatedTour) return notFound()

		return NextResponse.json({ success: true, tour: updatedTour })
	} catch (error) {
		console.error('Error updating tour:', error)
		return NextResponse.json(
			{ message: 'Error updating tour', success: false },
			{ status: 500 },
		)
	}
}

export async function DELETE(request: NextRequest, { params }: Params) {
	try {
		const { businessId, error } = await requireBusiness()
		if (error) return error

		const tour = must(
			await db
				.from(T.tours)
				.select(`id, bookings:${T.bookings}(count)`)
				.match({ id: params.id, businessId })
				.maybeSingle(),
		)
		if (!tour) return notFound()

		// Tours with bookings can't be deleted (keeps booking history intact)
		if ((tour as any).bookings?.[0]?.count > 0) {
			return NextResponse.json(
				{ message: 'This tour has bookings and cannot be deleted', success: false },
				{ status: 409 },
			)
		}

		must(await db.from(T.reviews).delete().eq('tourId', params.id))
		must(await db.from(T.tours).delete().eq('id', params.id))

		return NextResponse.json({
			success: true,
			message: 'Tour deleted successfully',
		})
	} catch (error) {
		console.error('Error deleting tour:', error)
		return NextResponse.json(
			{ message: 'Error deleting tour', success: false },
			{ status: 500 },
		)
	}
}
