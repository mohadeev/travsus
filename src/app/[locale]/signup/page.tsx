import { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import SignUpClient from './SignUpClient'

export const metadata: Metadata = {
	title: t('signup_page_Sign_Up_Travsus'),
	description: t('signup_page_Create_New_Account_And_Join_Our_Community'),
}

export default function SignUpPage() {
	const t = useTranslations('SignUpPage')
	return <SignUpClient />
}
