export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server'
import prisma from '@/prisma'

export async function POST(req: Request) {
	try {
		const { token, code } = await req.json()

		if (!token) {
			return NextResponse.json({ error: 'Token is required' }, { status: 400 })
		}

		const user = await prisma.user.findFirst({
			where: {
				verificationToken: token,
				verificationTokenExpiry: { gt: new Date() },
			},
		})

		if (!user) {
			return NextResponse.json(
				{ error: 'Invalid or expired token' },
				{ status: 400 },
			)
		}

		if (code) {
			if (
				user.verificationCode !== code ||
				user.verificationCodeExpiry < new Date()
			) {
				return NextResponse.json(
					{ error: 'Invalid or expired verification code' },
					{ status: 400 },
				)
			}
		}

		await prisma.user.update({
			where: { id: user.id },
			data: {
				emailVerified: true,
				verificationToken: null,
				verificationTokenExpiry: null,
				verificationCode: null,
				verificationCodeExpiry: null,
			},
		})

		return NextResponse.json({ message: 'Email verified successfully' })
	} catch (error) {
		console.error('Email verification error:', error)
		return NextResponse.json(
			{ error: 'An error occurred during email verification' },
			{ status: 500 },
		)
	}
}
