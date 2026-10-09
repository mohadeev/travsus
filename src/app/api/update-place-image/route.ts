export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { db, T, must, touch } from '@/lib/db'
import { adminOnly } from '@/lib/guards'

export async function POST(request: Request) {
	try {
		const denied = await adminOnly()
		if (denied) return denied

		const { id, imageUrl } = await request.json()
		if (!id || !imageUrl) {
			return NextResponse.json(
				{ error: 'Missing required fields' },
				{ status: 400 },
			)
		}

		// url / public_id are filled in later by the image upload process
		const updated = must(
			await db
				.from(T.places)
				.update(touch({ image: { url: '', public_id: '', uploadFrom: imageUrl } }))
				.eq('id', id)
				.select('id'),
		)
		if (!updated?.length) {
			return NextResponse.json({ error: 'Place not found' }, { status: 404 })
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error updating place image:', error)
		return NextResponse.json(
			{ error: 'Failed to update image' },
			{ status: 500 },
		)
	}
}
