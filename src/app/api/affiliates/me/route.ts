// The signed-in user's affiliate code, when they are an accepted affiliate
// (tour pages then add it to the link and show the share bar).
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { affiliateByEmail } from '@/lib/affiliates'

export const dynamic = 'force-dynamic'

export async function GET() {
	const session = await getSession().catch(() => null)
	const affiliate = await affiliateByEmail(session?.user.email).catch(() => null)
	return NextResponse.json({ code: affiliate?.code ?? null }, { headers: { 'Cache-Control': 'private, no-store' } })
}
