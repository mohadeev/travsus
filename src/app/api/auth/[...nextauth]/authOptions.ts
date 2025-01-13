import { NextAuthOptions, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

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
		async jwt({ token, user }: { token: JWT; user?: User }) {
			if (user) {
				token.id = user.id
			}
			return token
		},
		async session({ session, token }: { session: any; token: JWT }) {
			if (session.user) {
				session.user.id = token.id as string
			}
			return session
		},
	},
	secret: secret,
	debug: process.env.NODE_ENV === 'development',
}

export default authOptions
