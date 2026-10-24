// Accept an affiliate invitation (no account needed: the link was sent to the
// invited inbox). Body: { token, locale? }.
// Answers { link, email } or { code: 'INVALID' | 'ERROR' }.
import { NextResponse, type NextRequest } from 'next/server'
import { acceptInvite, affiliateLink, inviteByToken } from '@/lib/affiliateInvites'
import { routing } from '@/i18n/routing'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
	const { token, locale } = await req.json().catch(() => ({}))
	const invite = await inviteByToken(token)
	if (!invite) return NextResponse.json({ code: 'INVALID' }, { status: 404 })
	try {
		const affiliate = await acceptInvite(invite)
		const lang = (routing.locales as readonly string[]).includes(locale) ? locale : routing.defaultLocale
		return NextResponse.json({ link: affiliateLink(affiliate.code!, lang), email: affiliate.email })
	} catch (error) {
		console.error('Accept affiliate invite failed:', error)
		return NextResponse.json({ code: 'ERROR' }, { status: 500 })
	}
}
