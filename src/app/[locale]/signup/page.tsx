export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
import type { Metadata } from 'next'
import SignUpClient from './SignUpClient'
import { getTranslations } from 'next-intl/server'

interface PageProps {
	params: Promise<{
		locale: string
	}>
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'Jan03_SignUp_b9k3' })

	return {
		title: t('Sign_Up_Title'),
		description: t('Sign_Up_Description'),
	}
}

export default async function SignUpPage({ params }: PageProps) {
	const { locale } = await params

	return <SignUpClient locale={locale} />
}
