'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { UserProfile } from '@clerk/nextjs'
import { useTranslations } from '@/lib/i18n'

// Password, connected Google account, email and signed-in devices: all by Clerk
export default function LoginAndSecurityPage() {
	const t = useTranslations('LoginSecurityPage')

	return (
		<div className="mx-auto max-w-4xl px-6 py-8">
			<div className="mb-6 flex items-center text-sm">
				<Link href="/account-settings" className="text-gray-600 hover:underline">
					{t('account')}
				</Link>
				<ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
				<span className="text-gray-800">{t('login_security')}</span>
			</div>

			<h1 className="mb-8 text-3xl font-semibold">{t('login_security')}</h1>

			<UserProfile routing="hash" />

			<div className="mt-10 flex items-center justify-between border-t border-gray-200 py-6">
				<h2 className="font-medium">{t('deactivate_account')}</h2>
				<Link
					href="/account-settings-delete/reasons"
					className="font-medium text-red-500 underline"
				>
					{t('deactivate')}
				</Link>
			</div>
		</div>
	)
}
