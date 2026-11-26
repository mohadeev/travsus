// Admin check of the tour list behind search and country pages: reads it
// without the cache and reports how many tours came back, how long it took,
// and the error if it failed. With ?refresh=1 it also refreshes the cache.
// Allowed for the site owner's account, or with "Authorization: Bearer <CRON_SECRET>".
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, fetchAll } from '@/lib/db'
import { isOwner } from '@/lib/admin/owner'
import { loadCatalog, refreshTourCache } from '@/lib/tourCatalog'

export const dynamic = 'force-dynamic'

async function allowed(request: NextRequest) {
	const secret = process.env.CRON_SECRET
	if (secret && request.headers.get('authorization') === `Bearer ${secret}`) return true
	return isOwner()
}

async function step<T>(name: string, out: Record<string, any>, run: () => Promise<T>) {
	const start = Date.now()
	try {
		const value = await run()
		out[name] = { ms: Date.now() - start, ...(Array.isArray(value) ? { rows: value.length, bytes: JSON.stringify(value).length } : {}) }
		return value
	} catch (error: any) {
		out[name] = { ms: Date.now() - start, error: String(error?.message ?? error), stack: String(error?.stack ?? '').slice(0, 1500) }
		return null
	}
}

export async function GET(request: NextRequest) {
	if (!(await allowed(request))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
	const out: Record<string, any> = {}
	await step('ids', out, () => fetchAll(() => db.from(T.tours).select('id').gt('images', '[]').order('id')))
	await step('catalog', out, () => loadCatalog())
	if (request.nextUrl.searchParams.get('refresh') === '1') {
		refreshTourCache()
		out.refreshed = true
	}
	return NextResponse.json(out)
}
