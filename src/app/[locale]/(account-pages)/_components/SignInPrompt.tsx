'use client'
// Shown on account pages to visitors who are not signed in.
import { useClerk } from '@clerk/nextjs'
import { UserRound } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function SignInPrompt() {
	const t = useTranslations('Account')
	const { openSignIn, openSignUp } = useClerk()
	const back = () => ({ forceRedirectUrl: window.location.href })

	return (
		<div className="mx-auto max-w-md rounded-[28px] bg-neutral-100 px-6 py-14 text-center dark:bg-neutral-900">
			<UserRound className="mx-auto h-10 w-10 text-neutral-400" strokeWidth={1.5} />
			<h1 className="mt-5 text-3xl font-bold tracking-tight">{t('signed_out_title')}</h1>
			<p className="mt-2 text-neutral-500">{t('signed_out_text')}</p>
			<div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
				<button type="button" onClick={() => openSignIn(back())} className="h-12 rounded-full bg-neutral-950 px-7 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-950">
					{t('sign_in')}
				</button>
				<button type="button" onClick={() => openSignUp(back())} className="h-12 rounded-full border border-neutral-300 px-7 text-sm font-semibold transition hover:border-neutral-950 dark:border-neutral-700 dark:hover:border-white">
					{t('sign_up')}
				</button>
			</div>
		</div>
	)
}
