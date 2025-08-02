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
import { useTranslations } from '@/lib/i18n'

// Define the type for our settings items
type SettingItem = {
	title: string
	description: string
	icon: LucideIcon
	href: string
}

export default function AccountPage() {
	const t = useTranslations('accountpages_account_page')

	// Array of settings items
	const settingsItems: SettingItem[] = [
		{
			title: t('Personal_Info_Title'),
			description: t('Personal_Info_Description'),
			icon: LayoutGrid,
			href: '/account-settings/personal-info',
		},
		{
			title: t('Login_Security_Title'),
			description: t('Login_Security_Description'),
			icon: Lock,
			href: '/account-settings/login-and-security',
		},
		{
			title: t('Payments_Payouts_Title'),
			description: t('Payments_Payouts_Description'),
			icon: CreditCard,
			href: '/account-settings/payment-methods',
		},
		{
			title: t('Taxes_Title'),
			description: t('Taxes_Description'),
			icon: FileText,
			href: '/account-settings/taxes',
		},
		{
			title: t('Notifications_Title'),
			description: t('Notifications_Description'),
			icon: Bell,
			href: '/account-settings/notifications',
		},
		{
			title: t('Privacy_Sharing_Title'),
			description: t('Privacy_Sharing_Description'),
			icon: Eye,
			href: '/account-settings/privacy-and-sharing',
		},
		{
			title: t('Global_Preferences_Title'),
			description: t('Global_Preferences_Description'),
			icon: Globe,
			href: '/account-settings/preferences',
		},
		{
			title: t('Travel_For_Work_Title'),
			description: t('Travel_For_Work_Description'),
			icon: MapPin,
			href: '/account-settings/travsus-for-work',
		},
		{
			title: t('Professional_Hosting_Tools_Title'),
			description: t('Professional_Hosting_Tools_Description'),
			icon: Building2,
			href: '/account-settings/professional-hosting',
		},
		{
			title: t('Referral_Credit_Coupon_Title'),
			description: t('Referral_Credit_Coupon_Description'),
			icon: Gift,
			href: '/account-settings/invite',
		},
	]

	return (
		<div className="flex min-h-screen flex-col">
			<main className="mx-auto max-w-6xl flex-1 px-6 py-8 md:px-20">
				{/* Account Header */}
				<div className="mb-8">
					<h1 className="mb-1 text-3xl font-semibold">{t('Account_Title')}</h1>
					<div className="flex items-center text-gray-700">
						<span>{t('User_Details')}</span>
						<span className="mx-2">·</span>
						<Link href="#" className="font-medium text-black underline">
							{t('Go_To_Profile')}
						</Link>
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
						{t('Need_To_Deactivate_Your_Account')}
					</p>
					<Link
						href="/account-settings-delete/reasons"
						className="font-medium text-gray-700 underline"
					>
						{t('Take_Care_Of_That_Now')}
					</Link>
				</div>
			</main>
		</div>
	)
}
