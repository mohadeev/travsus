// A visit with ?ref=CODE (sent by AffiliateRefCapture): counts a click for the
// affiliate and keeps the code in a cookie for 60 days, so a booking made
// later is credited to them. Unknown codes and the affiliate's own visits
// are ignored; the same visitor following the same link again isn't recounted.
import { NextResponse, type NextRequest } from 'next/server'
import { db, T } from '@/lib/db'
import { getSession } from '@/lib/session'
import { place, isBot } from '@/lib/analytics/classify'
import { affiliateByCode, REF_COOKIE, REF_DAYS } from '@/lib/affiliates'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
	const body = await req.json().catch(() => ({}))
	if (isBot(req.headers.get('user-agent') ?? '')) return NextResponse.json({ ok: false })
	const affiliate = await affiliateByCode(body.code).catch(() => null)
	if (!affiliate) return NextResponse.json({ ok: false })

	const session = await getSession().catch(() => null)
	if (session?.user.email === affiliate.email) return NextResponse.json({ ok: false, self: true })

	const res = NextResponse.json({ ok: true })
	if (req.cookies.get(REF_COOKIE)?.value !== affiliate.code) {
		const path = typeof body.path === 'string' ? body.path.split('?')[0].slice(0, 300) : null
		await db.from(T.affiliateClicks).insert({ affiliate_id: affiliate.id, path, country: place(req.headers).country })
	}
	res.cookies.set(REF_COOKIE, affiliate.code!, {
		httpOnly: true,
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: REF_DAYS * 86400,
	})
	return res
}
