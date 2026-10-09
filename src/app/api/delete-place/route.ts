export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { db, T, must } from '@/lib/db'
import { adminOnly } from '@/lib/guards'

export async function POST(request: Request) {
	try {
		const denied = await adminOnly()
		if (denied) return denied

		const { placeId } = await request.json()
		if (!placeId) {
			return NextResponse.json({ error: 'Missing place ID' }, { status: 400 })
		}

		const deleted = must(await db.from(T.places).delete().eq('id', placeId).select('id'))
		if (!deleted?.length) {
			return NextResponse.json({ error: 'Place not found' }, { status: 404 })
		}

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Error deleting place:', error)
		return NextResponse.json(
			{ error: 'Failed to delete place' },
			{ status: 500 },
		)
	}
}
