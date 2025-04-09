import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import sendEmail from '@/utils/email/sendMail'

function generateVerificationCode(): string {
	console.log('Generating verification code')
	return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
	console.log('POST request received for signup')
	try {
		const { email, password, firstName, lastName } = await req.json()
		console.log('Received email and password')
		if (!email || !password || !firstName || !lastName) {
			console.log('Email, password, firstName, or lastName missing')
			return NextResponse.json(
				{ error: 'Email, password, first name, and last name are required' },
				{ status: 400 },
			)
		}

		console.log('Checking if user already exists')
		const existingUser = await prisma.user.findUnique({
			where: { email },
		})

		if (existingUser) {
			console.log('User already exists')
			return NextResponse.json(
				{ error: 'User already exists' },
				{ status: 400 },
			)
		}

		console.log('Hashing password')
		const hashedPassword = await bcrypt.hash(password, 10)
		console.log('Generating verification tokens and code')
		const verificationLinkToken = uuidv4()
		const verificationCodeToken = uuidv4()
		const verificationCode = generateVerificationCode()
		const now = new Date()
		const tokenExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours from now
		const codeExpiry = new Date(now.getTime() + 30 * 60 * 1000) // 30 minutes from now

		console.log('Creating user in database')
		const user = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				accountData: { firstname: firstName, lastname: lastName },
				emailVerified: false,
				verificationLinkToken,
				verificationCodeToken,
				verificationTokenExpiry: tokenExpiry,
				verificationCode,
				verificationCodeExpiry: codeExpiry,
			},
		})

		console.log('User created successfully')

		console.log('moroccostartour@gmail.com:', 'moroccostartour@gmail.com')
		await sendEmail({
			to: user.email,
			type: 'verifyEmailAddress',
			emailData: {
				verificationLinkToken: verificationLinkToken,
				verificationCodeToken: verificationCodeToken,
				verificationCode: verificationCode,
			},
		})
		console.log('Verification email sent')

		console.log('Sending success response')
		return NextResponse.json({
			success: true,
			message:
				'User created successfully. Please check your email to verify your account.',
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
