import { NextAuthOptions, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import sendEmail from '@/utils/email/sendMail'

const secret = process.env.NEXTAUTH_SECRET

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'text' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				console.log('Starting authorization process')

				if (!credentials?.email || !credentials?.password) {
					console.log('Missing credentials')
					throw new Error('Email and password are required')
				}

				try {
					const user = await prisma.user.findUnique({
						where: { email: credentials.email },
					})

					console.log('User lookup result:', user ? 'Found' : 'Not found')

					if (!user || !user.password) {
						throw new Error('No user found with this email')
					}

					const isPasswordValid = await bcrypt.compare(
						credentials.password,
						user.password,
					)
					console.log(
						'Password validation:',
						isPasswordValid ? 'Success' : 'Failed',
					)

					if (!isPasswordValid) {
						throw new Error('Invalid password')
					}

					console.log('Authorization successful')
					return {
						id: user.id,
						email: user.email,
						name: user.name,
					}
				} catch (error) {
					console.error('Authorization error:', error)
					throw error
				}
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
	],
	session: {
		strategy: 'jwt',
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	pages: {
		signIn: '/login',
	},
	callbacks: {
		async signIn({ user, account, profile }) {
			// Only proceed for Google provider
			if (account?.provider === 'google' && user.email) {
				try {
					// Check if user exists in database
					const existingUser = await prisma.user.findUnique({
						where: { email: user.email },
					})

					// If user doesn't exist, create a new one
					if (!existingUser && user.email) {
						// Split the name into first and last name
						const nameParts = user.name ? user.name.split(' ') : ['', '']
						const firstName = nameParts[0]
						const lastName = nameParts.slice(1).join(' ')

						await prisma.user.create({
							data: {
								email: user.email,
								accountData: {
									firstname: firstName,
									lastname: lastName,
								},
								password: '', // Empty password for Google users
								emailVerified: true, // Google accounts are already verified
							},
						})
						sendEmail({
							to: user.email,
							type: 'welcome',
							emailData: {
								email: user.email,
								// restLink: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/q?token=${resetToken}`,
							},
						})
						console.log('New Google user created:', user.email)
					}

					return true // Allow sign in
				} catch (error) {
					console.error('Error in Google sign in:', error)
					return false // Deny sign in on error
				}
			}

			return true // Allow sign in for other providers
		},
	},
	secret: secret,
	debug: process.env.NODE_ENV === 'development',
}

export default authOptions
