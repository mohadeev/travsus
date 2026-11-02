// Every morning: reminds the people who haven't accepted their affiliate
// invitation yet, 1, 7, 14 and 28 days after it was sent, then never again
// (see remindPendingInvites in src/lib/affiliateInvites.ts).
// Called by Vercel Cron (vercel.json) with "Authorization: Bearer <CRON_SECRET>".
export const dynamic = 'force-dynamic'
export const maxDuration = 60
import { NextResponse, type NextRequest } from 'next/server'
import { remindPendingInvites } from '@/lib/affiliateInvites'

export async function GET(request: NextRequest) {
	const secret = process.env.CRON_SECRET
	if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}
	const results = await remindPendingInvites()
	return NextResponse.json({ reminded: Object.keys(results).length, results })
}
