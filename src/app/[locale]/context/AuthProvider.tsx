'use client'
// Clerk sign-in for the whole site, in the visitor's language.
import { ClerkProvider } from '@clerk/nextjs'
// One file per language (the package index holds ~50 languages)
import { deDE } from '@clerk/localizations/de-DE'
import { enUS } from '@clerk/localizations/en-US'
import { esES } from '@clerk/localizations/es-ES'
import { frFR } from '@clerk/localizations/fr-FR'
import { itIT } from '@clerk/localizations/it-IT'
import { jaJP } from '@clerk/localizations/ja-JP'
import { koKR } from '@clerk/localizations/ko-KR'
import { ptPT } from '@clerk/localizations/pt-PT'
import { ruRU } from '@clerk/localizations/ru-RU'
import { zhCN } from '@clerk/localizations/zh-CN'
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
