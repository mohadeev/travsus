'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function AccountPage() {
	return (
		<div className="mx-auto max-w-4xl px-6 py-8">
			{/* Breadcrumb */}
			<div className="mb-6 flex items-center text-sm">
				<Link href="/account" className="text-gray-600 hover:underline">
					Account
				</Link>
				<ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
				<span className="text-gray-800">Account details</span>
			</div>

			{/* Page Title */}
			<h1 className="mb-8 text-3xl font-semibold">Account details</h1>

			{/* Content sections with border between them */}
			<div className="space-y-8 divide-y divide-gray-200">
				{/* Personal Information Section */}
				<div className="space-y-4 pb-8">
					<h2 className="text-xl font-semibold">Personal information</h2>
					<p className="text-gray-600">
						Update your personal details and how we contact you.
					</p>
					<div className="grid gap-4 sm:grid-cols-2">
						<Link
							href="/account/personal-info"
							className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm"
						>
							<div>
								<h3 className="font-medium">Personal info</h3>
								<p className="text-sm text-gray-500">
									Name, email, phone, and more
								</p>
							</div>
							<ChevronRight className="h-5 w-5 text-gray-400" />
						</Link>
						<Link
							href="/account/login-and-security"
							className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm"
						>
							<div>
								<h3 className="font-medium">Login & security</h3>
								<p className="text-sm text-gray-500">
									Password, login preferences
								</p>
							</div>
							<ChevronRight className="h-5 w-5 text-gray-400" />
						</Link>
					</div>
				</div>

				{/* Payments Section */}
				<div className="space-y-4 py-8">
					<h2 className="text-xl font-semibold">Payments & payouts</h2>
					<p className="text-gray-600">
						Review your payment methods and payout settings.
					</p>
					<div className="grid gap-4 sm:grid-cols-2">
						<Link
							href="/account/payment-methods"
							className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm"
						>
							<div>
								<h3 className="font-medium">Payment methods</h3>
								<p className="text-sm text-gray-500">
									Add or remove payment methods
								</p>
							</div>
							<ChevronRight className="h-5 w-5 text-gray-400" />
						</Link>
						<Link
							href="/account/payouts"
							className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm"
						>
							<div>
								<h3 className="font-medium">Payout preferences</h3>
								<p className="text-sm text-gray-500">
									When and how you get paid
								</p>
							</div>
							<ChevronRight className="h-5 w-5 text-gray-400" />
						</Link>
					</div>
				</div>

				{/* Account Management Section */}
				<div className="space-y-4 pt-8">
					<h2 className="text-xl font-semibold">Account management</h2>
					<p className="text-gray-600">
						Manage your account settings and preferences.
					</p>
					<div className="grid gap-4 sm:grid-cols-2">
						<Link
							href="/account/preferences"
							className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm"
						>
							<div>
								<h3 className="font-medium">Global preferences</h3>
								<p className="text-sm text-gray-500">
									Language, currency, timezone
								</p>
							</div>
							<ChevronRight className="h-5 w-5 text-gray-400" />
						</Link>
						<Link
							href="/account/notifications"
							className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm"
						>
							<div>
								<h3 className="font-medium">Notifications</h3>
								<p className="text-sm text-gray-500">How we contact you</p>
							</div>
							<ChevronRight className="h-5 w-5 text-gray-400" />
						</Link>
						<Link
							href="/account/privacy"
							className="flex items-center justify-between rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm"
						>
							<div>
								<h3 className="font-medium">Privacy & sharing</h3>
								<p className="text-sm text-gray-500">
									Control your data and connected services
								</p>
							</div>
							<ChevronRight className="h-5 w-5 text-gray-400" />
						</Link>
					</div>

					{/* Deactivation link */}
					<div className="mt-8 border-t border-gray-200 pt-4">
						<Link
							href="/account/deactivate"
							className="text-gray-600 hover:text-red-600 hover:underline"
						>
							Need to deactivate your account?
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
