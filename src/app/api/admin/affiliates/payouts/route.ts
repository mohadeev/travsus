// Record a payout made to an affiliate (owner only). The money is sent
// outside the site (PayPal, bank transfer); this only keeps the record, which
// the affiliate sees in their account and which lowers their balance.
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'
import { affiliateReport, affiliateSummary, type Affiliate } from '@/lib/affiliates'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
	if (!(await isOwner())) return NextResponse.json({ error: 'Not found' }, { status: 404 })
	const body = await req.json().catch(() => ({}))
	const amount = Math.round(Number(body.amount) * 100) / 100
	if (!(Number.isFinite(amount) && amount > 0 && amount < 1_000_000)) return NextResponse.json({ error: 'Enter an amount above 0' }, { status: 400 })

	try {
		const affiliate = must(await db.from(T.affiliates).select('*').eq('id', String(body.affiliateId ?? '')).maybeSingle()) as Affiliate | null
		if (!affiliate) return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
		must(await db.from(T.affiliatePayouts).insert({ affiliate_id: affiliate.id, amount, note: String(body.note ?? '').trim().slice(0, 200) || null }))
		return NextResponse.json({ stats: affiliateSummary(await affiliateReport(affiliate)) }, { status: 201 })
	} catch (error) {
		console.error('Affiliate payout error:', error)
		return NextResponse.json({ error: 'Could not save the payout. Please try again.' }, { status: 500 })
	}
}
