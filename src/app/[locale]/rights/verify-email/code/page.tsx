import { Metadata } from 'next'
import EmailVerificationForm from './EmailVerificationForm'
// import EmailVerificationForm from './EmailVerificationForm'

export const metadata: Metadata = {
	title: 'Verify Email Code | Travsus',
	description: 'Verify email code page.',
}

export default function VerifyEmailCodePage() {
	return <EmailVerificationForm />
}
