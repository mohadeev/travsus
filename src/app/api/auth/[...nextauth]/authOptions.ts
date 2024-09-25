// import type { NextAuthauthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/prisma'

export const authOptions: any = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				username: {
					label: 'Username:',
					type: 'text',
					placeholder: 'your-cool-username',
				},
				password: {
					label: 'Password:',
					type: 'password',
					placeholder: 'your-awesome-password',
				},
			},
			async authorize(credentials) {
				// This is where you need to retrieve user data
				// to verify with credentials
				// Docs: https://next-auth.js.org/configuration/providers/credentials
				const user = { id: '42', name: 'Dave', password: 'nextauth' }

				if (
					credentials?.username === user.name &&
					credentials?.password === user.password
				) {
					return user
				} else {
					return null
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, account }: { token: any; account?: any }) {

			// Add the access token to the JWT token if it exists
			if (account) {
				token.accessToken = account.access_token
			}
			return token
		},
		async session({ session, token }: { session: any; token: any }) {
			// Include user.id and accessToken in the session
			if (session.user) {
				session.user.id = token.sub // or another identifier if available
				session.user.accessToken = token.accessToken
			}
			return session
		},
		// async signIn({ user }: { user: any }) {
		// 	// Check if user exists in your database
		// 	const existingUser = await prisma.user.findUnique({
		// 		where: { email: user.email },
		// 	})

		// 	// If user doesn't exist, create a new record
		// 	if (!existingUser) {
		// 		await prisma.user.create({
		// 			data: {
		// 				email: user.email,
		// 				username: user.name || undefined,
		// 				// Optionally, you can set other fields here
		// 			},
		// 		})
		// 	}

		// 	return true
		// },
	},
	// callbacks: {
	// 	async jwt({ token, account }: any) {
	// 		// If the user is logging in for the first time, add the accessToken to the token
	// 		if (account) {
	// 			token.accessToken = account.access_token
	// 		}
	// 		return token
	// 	},
	// 	async session({ session, user }: any) {
	// 		// Include user.id in session
	// 		if (user) {
	// 			session.user.id = user.id
	// 		}
	// 		// session.user.accessToken = token.accessToken

	// 		return session
	// 	},
	// 	async signIn({ user }: any) {
	// 		// Check if user exists in your database
	// 		const existingUser = await prisma.user.findUnique({
	// 			where: { email: user.email },
	// 		})

	// 		// If user doesn't exist, create a new record
	// 		// if (!existingUser) {
	// 		// 	await prisma.user.create({
	// 		// 		data: {
	// 		// 			email: user.email,
	// 		// 			username: user.name,
	// 		// 			// Optionally, you can set other fields here
	// 		// 		},
	// 		// 	})
	// 		// }

	// 		return true
	// 	},
	// },

	secret: process.env.NEXTAUTH_SECRET as string,
	// callbacks: {
	// 	async session({ session, token }: any) {
	// 		session.userId = token.id as string
	// 		//console.log('session', session, 'token', token)

	// 		return session
	// 	},
	// 	async jwt({ token, user }: any) {
	// 		if (user) {
	// 			//console.log('user', user, 'token', token)

	// 			token.id = user.id
	// 		}
	// 		return token
	// 	},
	// },
}
