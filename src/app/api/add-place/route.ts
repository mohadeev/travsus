export const dynamic = "force-dynamic";
import { placesClient } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
	try {
		const data = await request.json()
		const { name, description, category, cityId, countryId, imageUrl, geo } =
			data

		// Validate required fields
		if (!name || !description || !category || !countryId) {
			return NextResponse.json(
				{
					error:
						'Missing required fields: name, description, category, and countryId are required',
				},
				{ status: 400 },
			)
		}

		const prisma = placesClient

		// Create translatable content for the place
		const content = await prisma.translatableContent.create({
			data: {
				entity: 'place',
				type: 'place',
				code3: data.code3 || null,
				translations: {
					create: [
						{
							language: 'en-US',
							text: name,
							type: 'name',
						},
						{
							language: 'en-US',
							text: description,
							type: 'description',
						},
					],
				},
			},
		})

		// Prepare image data if provided
		const imageData = imageUrl
			? {
					uploadFrom: imageUrl,
					url: '',
					public_id: '',
				}
			: undefined

		// Create the place
		const place = await prisma.place.create({
			data: {
				cityId: cityId || null,
				countryId,
				contentId: content.id,
				geo: geo || { lat: 0, log: 0 },
				type: 'place',
				category: category,
				subcategory: data.subcategory || null,
				tags: data.tags || [category],
				rating: data.rating || 4.5,
				address: data.address || '',
				website: data.website || null,
				phone: data.phone || null,
				image: imageData,
			},
		})

		return NextResponse.json({
			success: true,
			place: {
				id: place.id,
				name,
				description,
				category,
				cityId,
				countryId,
				image: place.image,
			},
		})
	} catch (error) {
		console.error('Error adding place:', error)
		return NextResponse.json({ error: 'Failed to add place' }, { status: 500 })
	}
}
