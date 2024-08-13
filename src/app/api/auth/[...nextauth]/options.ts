// import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

export const options: any = {
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
	secret: process.env.NEXTAUTH_SECRET as string,
	// callbacks: {
	// 	async session({ session, token }: any) {
	// 		session.userId = token.id as string
	// 		console.log('session', session, 'token', token)

	// 		return session
	// 	},
	// 	async jwt({ token, user }: any) {
	// 		if (user) {
	// 			console.log('user', user, 'token', token)

	// 			token.id = user.id
	// 		}
	// 		return token
	// 	},
	// },
}
