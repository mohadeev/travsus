// The tours' JSON copy (src/lib/tourStore.ts): how many tours, where it was
// loaded from, whether the MongoDB change stream is open, last sync and file
// write. "Authorization: Bearer <CRON_SECRET>" required.
//   GET  /api/tours/store-status          the status
//   POST /api/tours/store-status          reads every tour from MongoDB again now
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { resyncTourStore, tourStoreStatus } from '@/lib/tourStore'

function allowed(request: Request) {
	const secret = process.env.CRON_SECRET
	return !!secret && request.headers.get('authorization') === `Bearer ${secret}`
}

const noStore = { 'Cache-Control': 'no-store' }

export async function GET(request: Request) {
	if (!allowed(request)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	return NextResponse.json(tourStoreStatus(), { headers: noStore })
}

export async function POST(request: Request) {
	if (!allowed(request)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	try {
		await resyncTourStore()
		return NextResponse.json(tourStoreStatus(), { headers: noStore })
	} catch (error) {
		return NextResponse.json({ error: error instanceof Error ? error.message : String(error), ...tourStoreStatus() }, { status: 500, headers: noStore })
	}
}
