import { Metadata } from 'next'
import LoginClient from './LoginClient'
import { useTranslations } from 'next-intl'

type Props = {
	searchParams: { forgot?: string }
}

// export function generateMetadata({ searchParams }: Props): Promise<Metadata> {
// 	const isForgotPassword = searchParams.forgot === 'true'
// 	const t = useTranslations(login_page_Reset)

// 	if (isForgotPassword) {
// 		return {
// 			title: t('login_page_Forgot_Password'),
// 			description: t('login_page_Reset_Your_Password_Securely'),
// 		}
// 	}

// 	return {
// 		title: t('login_page_Login'),
// 		description: t('login_page_Securely_Log_In_To_Your_Account'),
// 	}
// }

export default function LoginPage({ searchParams }: Props) {
	const isForgotPassword = searchParams.forgot === 'true'

	return <LoginClient isForgotPassword={isForgotPassword} />
}
