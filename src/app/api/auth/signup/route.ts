import { NextResponse } from 'next/server'
import prisma from '@/prisma'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { sendVerificationEmail } from '@/utils/email'

function generateVerificationCode(): string {
	return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
	try {
		const { email, password } = await req.json()

		if (!email || !password) {
			return NextResponse.json(
				{ error: 'Email and password are required' },
				{ status: 400 },
			)
		}

		const existingUser = await prisma.user.findUnique({
			where: { email },
		})

		if (existingUser) {
			return NextResponse.json(
				{ error: 'User already exists' },
				{ status: 400 },
			)
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		const verificationLinkToken = uuidv4()
		const verificationCodeToken = uuidv4()
		const verificationCode = generateVerificationCode()
		const now = new Date()
		const tokenExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now
		const codeExpiry = new Date(now.getTime() + 30 * 60 * 1000) // 30 minutes from now

		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				accountData: { firstname: '', lastname: '' },
				emailVerified: false,
				verificationLinkToken,
				verificationCodeToken,
				verificationTokenExpiry: tokenExpiry,
				verificationCode,
				verificationCodeExpiry: codeExpiry,
			},
		})

		// Send verification email
		await sendVerificationEmail(
			user.email,
			verificationLinkToken,
			verificationCodeToken,
			verificationCode,
		)

		return NextResponse.json({
			success: true,
			message: 'User created. Please check your email to verify your account.',
			verificationCodeToken,
		})
	} catch (error) {
		console.error('Signup error:', error)
		return NextResponse.json(
			{ error: 'An error occurred during sign up' },
			{ status: 500 },
		)
	}
}
