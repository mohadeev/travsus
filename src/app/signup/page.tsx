import { Metadata } from 'next'
import SignUpClient from './SignUpClient'

export const metadata: Metadata = {
	title: 'Sign Up | Travsus',
	description: 'Create a new account and join our community.',
}

export default function SignUpPage() {
	return <SignUpClient />
}
