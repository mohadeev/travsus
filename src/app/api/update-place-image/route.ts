export const dynamic = "force-dynamic";
import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const { id, imageUrl } = await request.json()

		if (!id || !imageUrl) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 },
			)
		}

		const prisma = placesClient

		// Get the current place data
		const place = await prisma.place.findUnique({
			where: { id },
		})

		if (!place) {
			return NextResponse.json({ error: 'Place not found' }, { status: 404 })
		}

		// Update the place with the new image
		// For MongoDB embedded documents, we need to use the `set` operation
		await prisma.place.update({
			where: { id },
			data: {
				image: {
					set: {
						url: '',
						public_id: '',
						uploadFrom: imageUrl,
						// url and public_id will be added later by the background process
					},
				},
			},
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error updating place image:', error)
		return NextResponse.json(
			{ error: 'Failed to update image' },
			{ status: 500 },
		)
	}
}
