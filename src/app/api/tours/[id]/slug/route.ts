// The addresses of one tour, for the redirect in the middleware (which runs
// where the database can't be reached). Public data, cached for a day.
import { NextResponse } from 'next/server'
import { db, T } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
	if (!/^[0-9a-f]{24}$/.test(params.id)) return NextResponse.json({ slugs: [] }, { status: 400 })
	const { data, error } = await db.from(T.tours).select('slugs').eq('id', params.id).maybeSingle()
	if (error) return NextResponse.json({ slugs: [] }, { status: 500 })
	return NextResponse.json(
		{ slugs: data?.slugs ?? [] },
		{ status: data ? 200 : 404, headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } },
	)
}
