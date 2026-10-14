// Data for the analytics panel. Owner only (anyone else gets a 404).
//   ?view=live              → visitors online now
//   ?view=report&days=7     → everything for the last N days (1, 7, 30, 90)
//   ?view=visit&id=<id>     → one visit, step by step
import { NextResponse, type NextRequest } from 'next/server'
import { isAnalyticsOwner } from '@/lib/analytics/owner'
import { liveVisitors, report, visitDetail } from '@/lib/analytics/report'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
	if (!(await isAnalyticsOwner())) return new NextResponse(null, { status: 404 })
	const params = req.nextUrl.searchParams
	const view = params.get('view')
	const headers = { 'Cache-Control': 'no-store' }

	try {
		if (view === 'live') return NextResponse.json(await liveVisitors(), { headers })
		if (view === 'report') {
			const days = [1, 7, 30, 90].includes(Number(params.get('days'))) ? Number(params.get('days')) : 7
			return NextResponse.json(await report(days), { headers })
		}
		if (view === 'visit') {
			const visit = await visitDetail(String(params.get('id') ?? ''))
			return visit ? NextResponse.json(visit, { headers }) : new NextResponse(null, { status: 404 })
		}
		return new NextResponse(null, { status: 400 })
	} catch (error) {
		console.error('Analytics report failed:', error)
		return NextResponse.json({ error: 'Could not load analytics' }, { status: 500 })
	}
}
