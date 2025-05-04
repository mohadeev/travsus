import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const { placeId } = await request.json()

		if (!placeId) {
			return NextResponse.json({ error: 'Missing place ID' }, { status: 400 })
		}

		const prisma = placesClient

		// Get the current place data to verify it exists
		const place = await prisma.place.findUnique({
			where: { id: placeId },
		})

		if (!place) {
			return NextResponse.json({ error: 'Place not found' }, { status: 404 })
		}

		// Directly delete the place without trying to delete related content
		// This is safer and will work regardless of the database schema
		await prisma.place.delete({
			where: {
				id: placeId,
			},
		})

		console.log(`Successfully deleted place with ID: ${placeId}`)
		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error deleting place:', error)
		return NextResponse.json(
			{ error: 'Failed to delete place' },
			{ status: 500 },
		)
	}
}
