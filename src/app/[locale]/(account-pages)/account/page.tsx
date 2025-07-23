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

// Define the type for our settings items
type SettingItem = {
	title: string
	description: string
	icon: LucideIcon
	href: string
}

export default function AccountPage() {
	// Array of settings items
	const settingsItems: SettingItem[] = [
		{
			title: 'Personal info',
			description: 'Provide personal details and how we can reach you',
			icon: LayoutGrid,
			href: '/account-settings/personal-info',
		},
		{
			title: 'Login & security',
			description: 'Update your password and secure your account',
			icon: Lock,
			href: '/account-settings/login-and-security',
		},
		{
			title: 'Payments & payouts',
			description: 'Review payments, payouts, coupons, and gift cards',
			icon: CreditCard,
			href: '/account-settings/payment-methods',
		},
		{
			title: 'Taxes',
			description: 'Manage taxpayer information and tax documents',
			icon: FileText,
			href: '/account-settings/taxes',
		},
		{
			title: 'Notifications',
			description:
				'Choose notification preferences and how you want to be contacted',
			icon: Bell,
			href: '/account-settings/notifications',
		},
		{
			title: 'Privacy & sharing',
			description:
				'Manage your personal data, connected services, and data sharing settings',
			icon: Eye,
			href: '/account-settings/privacy-and-sharing',
		},
		{
			title: 'Global preferences',
			description: 'Set your default language, currency, and timezone',
			icon: Globe,
			href: '/account-settings/preferences',
		},
		{
			title: 'Travel for work',
			description: 'Add a work email for business trip benefits',
			icon: MapPin,
			href: '/account-settings/travsus-for-work',
		},
		{
			title: 'Professional hosting tools',
			description:
				'Get professional tools if you manage several properties on travsus',
			icon: Building2,
			href: '/account-settings/professional-hosting',
		},
		{
			title: 'Referral credit & coupon',
			description: 'You have € 0 referral credits and coupon. Learn more.',
			icon: Gift,
			href: '/account-settings/invite',
		},
	]

	return (
		<div className="flex min-h-screen flex-col">
			<main className="mx-auto max-w-6xl flex-1 px-6 py-8 md:px-20">
				{/* Account Header */}
				<div className="mb-8">
					<h1 className="mb-1 text-3xl font-semibold">Account</h1>
					<div className="flex items-center text-gray-700">
						<span>Mohamed Skendoul, skendoulmohamed@gmail.com</span>
						<span className="mx-2">·</span>
						<Link href="#" className="font-medium text-black underline">
							Go to profile
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
					<p className="mb-2 text-gray-700">Need to deactivate your account?</p>
					<Link
						href="/account-settings-delete/reasons"
						className="font-medium text-gray-700 underline"
					>
						Take care of that now
					</Link>
				</div>
			</main>
		</div>
	)
}
