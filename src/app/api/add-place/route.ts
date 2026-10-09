export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { db, T, must, newId, withMeta } from '@/lib/db'
import { adminOnly } from '@/lib/guards'

export async function POST(request: Request) {
	try {
		const denied = await adminOnly()
		if (denied) return denied

		const data = await request.json()
		const { name, description, category, cityId, countryId, imageUrl, geo } = data

		if (!name || !description || !category || !countryId) {
			return NextResponse.json(
				{
					error:
						'Missing required fields: name, description, category, and countryId are required',
				},
				{ status: 400 },
			)
		}

		// English name + description as translatable content
		const contentId = newId()
		must(
			await db
				.from(T.geoContents)
				.insert({ id: contentId, entity: 'place', type: 'place', code3: data.code3 || null }),
		)
		must(
			await db.from(T.geoTexts).insert([
				{ id: newId(), contentId, language: 'en-US', text: name, type: 'name' },
				{ id: newId(), contentId, language: 'en-US', text: description, type: 'description' },
			]),
		)

		// url / public_id are filled in later by the image upload process
		const imageData = imageUrl ? { uploadFrom: imageUrl, url: '', public_id: '' } : null

		const place = must(
			await db
				.from(T.places)
				.insert(
					withMeta({
						cityId: cityId || null,
						countryId,
						contentId,
						geo: geo || { lat: 0, log: 0 },
						type: 'place',
						category,
						subcategory: data.subcategory || null,
						tags: data.tags || [category],
						rating: data.rating || 4.5,
						address: data.address || '',
						website: data.website || null,
						phone: data.phone || null,
						image: imageData,
					}),
				)
				.select('id, image')
				.single(),
		)

		return NextResponse.json({
			success: true,
			place: { id: place.id, name, description, category, cityId, countryId, image: place.image },
		})
	} catch (error) {
		console.error('Error adding place:', error)
		return NextResponse.json({ error: 'Failed to add place' }, { status: 500 })
	}
}
