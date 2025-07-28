'use client'
import Link from 'next/link'
import {
	Bell,
	Building2,
	CreditCard,
	Eye,
	FileText,
	Gift,
	Globe,
	LayoutGrid,
	Lock,
	MapPin,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useTranslations } from '@/lib/i18n'

export default function AccountPage() {
	const t = useTranslations('AccountPage')

	// Array of settings items with translated text
	const settingsItems = [
		{
			title: t('personal_info_title'),
			description: t('personal_info_description'),
			icon: LayoutGrid,
			href: '/account-settings/personal-info',
		},
		{
			title: t('login_security_title'),
			description: t('login_security_description'),
			icon: Lock,
			href: '/account-settings/login-and-security',
		},
		{
			title: t('payments_title'),
			description: t('payments_description'),
			icon: CreditCard,
			href: '/account-settings/payment-methods',
		},
		{
			title: t('taxes_title'),
			description: t('taxes_description'),
			icon: FileText,
			href: '/account-settings/taxes',
		},
		{
			title: t('notifications_title'),
			description: t('notifications_description'),
			icon: Bell,
			href: '/account-settings/notifications',
		},
		{
			title: t('privacy_title'),
			description: t('privacy_description'),
			icon: Eye,
			href: '/account-settings/privacy-and-sharing',
		},
		{
			title: t('preferences_title'),
			description: t('preferences_description'),
			icon: Globe,
			href: '/account-settings/preferences',
		},
		{
			title: t('work_travel_title'),
			description: t('work_travel_description'),
			icon: MapPin,
			href: '/account-settings/travsus-for-work',
		},
		{
			title: t('hosting_tools_title'),
			description: t('hosting_tools_description'),
			icon: Building2,
			href: '/account-settings/professional-hosting',
		},
		{
			title: t('referral_title'),
			description: t('referral_description'),
			icon: Gift,
			href: '/account-settings/invite',
		},
	]

	const { userData } = useSelector((state: any) => state.userReducer)
	const userEmail = userData?.email || 'user@example.com'
	const userName =
		userData?.name || userData?.accountData?.firstname || t('default_username')

	return (
		<div className="flex min-h-screen flex-col">
			<main className="mx-auto max-w-6xl flex-1 px-6 py-8 md:px-20">
				{/* Account Header */}
				<div className="mb-8">
					<h1 className="mb-1 text-3xl font-semibold">{t('account_title')}</h1>
					<div className="flex items-center text-gray-700">
						<span>
							{userName}, {userEmail}
						</span>
					</div>
				</div>

				{/* Account Settings Grid */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{settingsItems.map((item, index) => {
						const Icon = item.icon
						return (
							<Link
								key={index}
								href={item.href}
								className="rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md"
							>
								<div className="mb-4 flex items-start">
									<Icon className="mr-4 h-8 w-8" />
									<div>
										<h2 className="mb-1 text-lg font-semibold">{item.title}</h2>
										<p className="text-sm text-gray-600">{item.description}</p>
									</div>
								</div>
							</Link>
						)
					})}
				</div>

				{/* Deactivate Account */}
				<div className="mt-12 text-center">
					<p className="mb-2 text-gray-700">
						{t('deactivate_account_message')}
					</p>
					<Link
						href="/account-settings/deactivate"
						className="font-medium text-gray-700 underline"
					>
						{t('deactivate_account_link')}
					</Link>
				</div>
			</main>
		</div>
	)
}
