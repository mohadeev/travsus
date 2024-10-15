import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/prisma' // Prisma client instance
import jwt from 'jsonwebtoken'
import sendEmail from '@/utils/email/sendMail'

export async function POST(req: NextRequest) {
	try {
		const { email } = await req.json()

		if (!email) {
			return NextResponse.json(
				{ message: 'Email is required for password reset' },
				{ status: 400 },
			)
		}

		// Find the user by email using Prisma
		const user = await prisma.user.findUnique({
			where: { email: email },
		})

		if (!user) {
			return NextResponse.json({ message: 'Email not found' }, { status: 404 })
		}

		// Generate JWT token for password reset
		const secretKey = process.env.ACCESS_TOKEN_SECRET
		if (!secretKey) {
			throw new Error('Secret key not set in environment variables')
		}

		// Payload for JWT token
		const tokenPayload = {
			email: email,
		}

		// Set the expiration time for 24 hours
		const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24

		// Create the JWT token
		const resetToken = jwt.sign(
			{ ...tokenPayload, exp: expirationTime },
			secretKey,
		)

		// Update the user record with the reset token
		await prisma.user.update({
			where: { email: email },
			data: {
				passwordResetToken: resetToken,
				passwordResetTokenExpiry: new Date(expirationTime * 1000), // Save expiry time in the database
			},
		})
		sendEmail({
			to: user.email,
			subject: '',
			message: '',
			type: 'forgetPassword',
			emailData: {
				// name: firstname,
				email: user.email,
				restLink: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/q?token=${resetToken}`,
			},
		})

		return NextResponse.json({
			message: 'Password reset token generated and email sent',
			token: resetToken,
		})
	} catch (error) {
		console.error('Error during password reset:', error)
		return NextResponse.json(
			{ message: 'Internal Server Error' },
			{ status: 500 },
		)
	} finally {
		await prisma.$disconnect()
	}
}
