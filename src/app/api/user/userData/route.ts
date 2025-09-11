import prisma from '@/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/authOptions'
import currentServerUser from '../currentServerUser'
import { createReferralLink } from './createReferralLink' // import the function

export async function GET(request: NextRequest) {
	try {
		const session: any = await getServerSession(authOptions)

		if (!session || !session?.user?.email) {
			return NextResponse.json(
				{ message: 'Not authenticated' },
				{ status: 401 },
			)
		}

		const user: any = await prisma.user.findUnique({
			where: { email: session.user.email },
			include: { referralLinks: true }, // fetch existing referral links
		})

		if (!user) {
			return NextResponse.json({ message: 'User not found' }, { status: 404 })
		}

		// Check if user already has a referral link
		let referralLink = user.referralLinks?.[0]

		if (!referralLink) {
			// Create a new referral link if none exists
			referralLink = await createReferralLink(user.id)
		}

		return NextResponse.json({
			user,
			referralLink,
			message: 'user_found',
		})
	} catch (error) {
		console.error('Error fetching user data:', error)
		return NextResponse.error()
	}
}
