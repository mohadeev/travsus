'use client'
// Clerk sign-in for the whole site, in the visitor's language.
import { ClerkProvider } from '@clerk/nextjs'
import {
	deDE,
	enUS,
	esES,
	frFR,
	itIT,
	jaJP,
	koKR,
	ptPT,
	ruRU,
	zhCN,
} from '@clerk/localizations'
import { useLocale } from 'next-intl'

const clerkLanguages: Record<string, typeof enUS> = {
	'en-US': enUS,
	'de-DE': deDE,
	'es-ES': esES,
	'fr-FR': frFR,
	'it-IT': itIT,
	'ja-JP': jaJP,
	'ko-KR': koKR,
	'pt-PT': ptPT,
	'ru-RU': ruRU,
	'zh-CN': zhCN,
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
	const locale = useLocale()
	return (
		<ClerkProvider
			localization={clerkLanguages[locale] ?? enUS}
			signInUrl={`/${locale}/sign-in`}
			signUpUrl={`/${locale}/sign-up`}
			appearance={{ variables: { colorPrimary: '#000000', borderRadius: '0.75rem' } }}
		>
			{children}
		</ClerkProvider>
	)
}
