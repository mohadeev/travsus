import { Metadata } from 'next'
import LoginClient from './LoginClient'

type Props = {
	searchParams: { forgot?: string }
}

export async function generateMetadata({
	searchParams,
}: Props): Promise<Metadata> {
	const isForgotPassword = searchParams.forgot === 'true'

	if (isForgotPassword) {
		return {
			title: 'Forgot Password | Travsus',
			description:
				'Reset your password securely and regain access to your account.',
		}
	}

	return {
		title: 'Login | Travsus',
		description:
			'Securely log in to your account and access your personalized dashboard.',
	}
}

export default function LoginPage({ searchParams }: Props) {
	const isForgotPassword = searchParams.forgot === 'true'

	return <LoginClient isForgotPassword={isForgotPassword} />
}
