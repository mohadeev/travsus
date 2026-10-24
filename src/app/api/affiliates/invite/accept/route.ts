// Accept an affiliate invitation as the signed-in account.
// Body: { token }. Answers { ok: true } or { code: 'SIGN_IN' | 'INVALID' | 'ERROR' }.
import { NextResponse, type NextRequest } from 'next/server'
import { getSession } from '@/lib/session'
import { acceptInvite, inviteByToken } from '@/lib/affiliateInvites'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
	const session = await getSession()
	if (!session) return NextResponse.json({ code: 'SIGN_IN' }, { status: 401 })
	const { token } = await req.json().catch(() => ({}))
	const invite = await inviteByToken(token)
	if (!invite) return NextResponse.json({ code: 'INVALID' }, { status: 404 })
	try {
		await acceptInvite(invite, session.user.email)
		return NextResponse.json({ ok: true })
	} catch (error) {
		console.error('Accept affiliate invite failed:', error)
		return NextResponse.json({ code: 'ERROR' }, { status: 500 })
	}
}
