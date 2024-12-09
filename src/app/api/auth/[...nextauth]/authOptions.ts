import { NextAuthOptions, User, Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

// Generate a strong secret if one is not provided
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
			// console.log('token, user ', token, user)
			// console.log({ token, user })
			// console.log('JWT Callback - Input:', {
			// 	tokenId: token?.id,
			// 	userId: user?.id,
			// })
			if (user) {
				token.id = user.id
			}
			// console.log('JWT Callback - Output:', { tokenId: token.id })
			return token
		},
		async session({ session, token }: { session: any; token: JWT }) {
			// console.log('Session Callback - Input:', {
			// 	sessionUserId: session.user?.id,
			// 	tokenId: token.id,
			// })
			// console.log('session, token: ', token)
			if (session.user) {
				session.user.id = token.id as string
			}
			// console.log('Session Callback - Output:', {
			// 	sessionUserId: session.user?.id,
			// })
			return session
		},
	},
	secret: secret,
	debug: process.env.NODE_ENV === 'development',
}
