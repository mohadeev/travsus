// Whether the signed-in user is the owner, so the account menu can show the
// Admin link (the owner's email never goes to the browser).
import { NextResponse } from 'next/server'
import { isOwner } from '@/lib/admin/owner'

export const dynamic = 'force-dynamic'

export async function GET() {
	return NextResponse.json({ owner: await isOwner() }, { headers: { 'Cache-Control': 'private, no-store' } })
}
