import { NextResponse } from 'next/server'
import prisma from '@/prisma'

export async function POST(req: Request) {
	try {
		const { token } = await req.json()

		if (!token) {
			return NextResponse.json({ error: 'Token is required' }, { status: 400 })
		}

		const user = await prisma.user.findFirst({
			where: {
				OR: [
					{ verificationLinkToken: token },
					{ verificationCodeToken: token },
				],
				verificationTokenExpiry: { gt: new Date() },
			},
		})

		if (!user) {
			return NextResponse.json(
				{ error: 'Invalid or expired token' },
				{ status: 400 },
			)
		}

		return NextResponse.json({ valid: true })
	} catch (error) {
		console.error('Token validation error:', error)
		return NextResponse.json(
			{ error: 'An error occurred during token validation' },
			{ status: 500 },
		)
	}
}
