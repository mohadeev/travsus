export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { db, T, must } from '@/lib/db'
import { safeUser } from '@/lib/users'
import { createReferralLink } from './createReferralLink'

export async function GET(request: NextRequest) {
	try {
		// Creates the account on the first Clerk sign-in
		const sessionUser = await getSessionUser()
		if (!sessionUser) {
			return NextResponse.json(
				{ message: 'Not authenticated' },
				{ status: 401 },
			)
		}

		const user: any = must(
			await db
				.from(T.users)
				.select(`*, referralLinks:${T.referralLinks}(*)`)
				.eq('id', sessionUser.id)
				.maybeSingle(),
		)

		if (!user) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 })
		}

		// Create a referral link the first time
		let referralLink = user.referralLinks?.[0]
		if (!referralLink) {
			referralLink = await createReferralLink(user.id)
			user.referralLink = referralLink
		}
		return NextResponse.json({
			user: safeUser(user),
			referralLink,
			message: 'user_found',
		})
	} catch (error) {
		console.error('Error fetching user data:', error)
		return NextResponse.error()
	}
}
