// Photo uploads for the tour editor: the browser sends the file straight to
// Cloudinary with a short-lived signature made here (the secret never leaves
// the server). Only the site owner or the tour's business can get one.
import { createHash } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { db, T, must } from '@/lib/db'
import { dashboardScope } from '@/lib/dashboard'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
	const { tourId } = await req.json().catch(() => ({}))
	if (typeof tourId !== 'string' || !/^[0-9a-f]{24}$/.test(tourId)) return NextResponse.json({ error: 'Missing tour' }, { status: 400 })

	const scope = await dashboardScope()
	const tour: any = must(await db.from(T.tours).select('id, businessId').eq('id', tourId).maybeSingle())
	if (!scope || !tour || !(scope.all || (scope.businessId && tour.businessId === scope.businessId))) {
		return NextResponse.json({ error: 'Not allowed' }, { status: 403 })
	}

	const { CLOUDINARY_CLOUD_NAME: cloudName, CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: secret } = process.env
	if (!cloudName || !apiKey || !secret) return NextResponse.json({ error: 'Photo uploads are not set up' }, { status: 503 })

	const timestamp = Math.floor(Date.now() / 1000)
	const folder = `tours/${tourId}`
	// Cloudinary signature: the signed parameters in A–Z order, then the secret
	const signature = createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest('hex')
	return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature })
}
