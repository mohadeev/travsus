'use server'

import { signIn } from 'next-auth/react'
import { AuthError } from 'next-auth'

export async function login(formData: FormData) {
	try {
		await signIn('credentials', {
			email: formData.get('email') as string,
			password: formData.get('password') as string,
			redirect: false,
		})
	} catch (error) {
		if (error) {
			switch (error.type) {
				case 'CredentialsSignin':
					return { error: 'Invalid credentials.' }
				default:
					return { error: 'Something went wrong.' }
			}
		}
		throw error
	}
}
