import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const { placeId } = await request.json()
		console.log('placeId', placeId)

		if (!placeId) {
			return NextResponse.json({ error: 'Missing place ID' }, { status: 400 })
		}

		const prisma = placesClient

		// Get the current place data to verify it exists
		const place = await prisma.place.findUnique({
			where: { id: placeId },
			include: {
				content: true,
			},
		})

		if (!place) {
			return NextResponse.json({ error: 'Place not found' }, { status: 404 })
		}

		// First delete the translations associated with the content
		if (place.contentId) {
			await prisma.translation.deleteMany({
				where: {
					contentId: place.contentId,
				},
			})
		}

		// Then delete the content
		if (place.contentId) {
			await prisma.translatableContent.delete({
				where: {
					id: place.contentId,
				},
			})
		}

		// Finally delete the place
		await prisma.place.delete({
			where: {
				id: placeId,
			},
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error deleting place:', error)
		return NextResponse.json(
			{ error: 'Failed to delete place' },
			{ status: 500 },
		)
	}
}
