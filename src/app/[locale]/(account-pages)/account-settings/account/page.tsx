export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
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
import { useTranslations } from 'use-intl'

// Define the type for our settings items
type SettingItem = {
	title: string
	description: string
	icon: LucideIcon
	href: string
}

export default function AccountPage() {
	const t = useTranslations("accountsettings_account_page_Personal")

	// Array of settings items
	const settingsItems: SettingItem[] = [
		{
			title: t('accountsettings_account_page_Personal_Info_Title'),
			description: t('accountsettings_account_page_Personal_Info_Description'),
			icon: LayoutGrid,
			href: '/account-settings/personal-info',
		},
		{
			title: t('accountsettings_account_page_Login_Security_Title'),
			description: t('accountsettings_account_page_Login_Security_Description'),
			icon: Lock,
			href: '/account-settings/login-and-security',
		},
		{
			title: t('accountsettings_account_page_Payments_Payouts_Title'),
			description: t(
				'accountsettings_account_page_Payments_Payouts_Description',
			),
			icon: CreditCard,
			href: '/account-settings/payment-methods',
		},
		{
			title: t('accountsettings_account_page_Taxes_Title'),
			description: t('accountsettings_account_page_Taxes_Description'),
			icon: FileText,
			href: '/account-settings/taxes',
		},
		{
			title: t('accountsettings_account_page_Notifications_Title'),
			description: t('accountsettings_account_page_Notifications_Description'),
			icon: Bell,
			href: '/account-settings/notifications',
		},
		{
			title: t('accountsettings_account_page_Privacy_Sharing_Title'),
			description: t(
				'accountsettings_account_page_Privacy_Sharing_Description',
			),
			icon: Eye,
			href: '/account-settings/privacy-and-sharing',
		},
		{
			title: t('accountsettings_account_page_Global_Preferences_Title'),
			description: t(
				'accountsettings_account_page_Global_Preferences_Description',
			),
			icon: Globe,
			href: '/account-settings/preferences',
		},
		{
			title: t('accountsettings_account_page_Travel_For_Work_Title'),
			description: t(
				'accountsettings_account_page_Travel_For_Work_Description',
			),
			icon: MapPin,
			href: '/account-settings/travsus-for-work',
		},
		{
			title: t('accountsettings_account_page_Professional_Hosting_Tools_Title'),
			description: t(
				'accountsettings_account_page_Professional_Hosting_Tools_Description',
			),
			icon: Building2,
			href: '/account-settings/professional-hosting',
		},
		{
			title: t('accountsettings_account_page_Referral_Credit_Coupon_Title'),
			description: t(
				'accountsettings_account_page_Referral_Credit_Coupon_Description',
			),
			icon: Gift,
			href: '/account-settings/invite',
		},
	]

	const { userData } = useSelector((state: any) => state.userReducer)
	const userEmail = userData?.email || 'user@example.com'
	const userName =
		userData?.name || userData?.accountData?.firstname || 'traveler'
	return (
		<div className="flex min-h-screen flex-col">
			<main className="mx-auto max-w-6xl flex-1 px-6 py-8 md:px-20">
				{/* Account Header */}
				<div className="mb-8">
					<h1 className="mb-1 text-3xl font-semibold">
						{t('accountsettings_account_page_Account_Header')}
					</h1>
					<div className="flex items-center text-gray-700">
						<span>
							{userName}, {userEmail}
						</span>
						<span className="mx-2">·</span>
						{/* <Link href="#" className="font-medium text-black underline">
							Go to profile
						</Link> */}
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
						{t('accountsettings_account_page_Need_To_Deactivate_Your_Account')}
					</p>
					<Link
						href="/account-settings/deactivate"
						className="font-medium text-gray-700 underline"
					>
						{t('accountsettings_account_page_Take_Care_Of_That_Now')}
					</Link>
				</div>
			</main>
		</div>
	)
}
