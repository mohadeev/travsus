import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const { id, type, imageUrl } = await request.json()

		if (!id || !type || !imageUrl) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 },
			)
		}

		// Validate that type is either country or city
		if (type !== 'country' && type !== 'city') {
			return NextResponse.json(
				{ error: "Type must be either 'country' or 'city'" },
				{ status: 400 },
			)
		}

		const prisma = placesClient

		if (type === 'country') {
			// Get the current country data
			const country = await prisma.country.findUnique({
				where: { id },
			})

			if (!country) {
				return NextResponse.json(
					{ error: 'Country not found' },
					{ status: 404 },
				)
			}

			// Update the country with the new image
			// For MongoDB embedded documents, we need to use the `set` operation
			await prisma.country.update({
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
		} else if (type === 'city') {
			// Get the current city data
			const city = await prisma.city.findUnique({
				where: { id },
			})

			if (!city) {
				return NextResponse.json({ error: 'City not found' }, { status: 404 })
			}

			// Update the city with the new image
			// For MongoDB embedded documents, we need to use the `set` operation
			await prisma.city.update({
				where: { id },
				data: {
					image: {
						set: {
							uploadFrom: imageUrl,
							// url and public_id will be added later by the background process
						},
					},
				},
			})
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error updating image:', error)
		return NextResponse.json(
			{ error: 'Failed to update image' },
			{ status: 500 },
		)
	}
}
