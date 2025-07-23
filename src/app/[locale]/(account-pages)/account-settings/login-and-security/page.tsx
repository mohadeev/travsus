'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Shield } from 'lucide-react'
import AccountPass from '@/components/AccountPass'
// import AccountPass from '@/components/account-settingsPass'

export default function LoginAndSecurityPage() {
	const [activeTab, setActiveTab] = useState('login')
	const [showPasswordUpdate, setShowPasswordUpdate] = useState(false)

	return (
		<div className="mx-auto max-w-4xl px-6 py-8">
			{/* Breadcrumb */}
			<div className="mb-6 flex items-center text-sm">
				<Link
					href="/account-settings"
					className="text-gray-600 hover:underline"
				>
					Account
				</Link>
				<ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
				<span className="text-gray-800">Login & security</span>
			</div>

			{/* Page Title */}
			<h1 className="mb-8 text-3xl font-semibold">Login & security</h1>

			{/* Tabs */}
			<div className="mb-8 border-b border-gray-200">
				<div className="flex space-x-8">
					<button
						className={`px-1 pb-4 ${
							activeTab === 'login'
								? 'border-b-2 border-black font-medium text-black'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('login')}
					>
						LOGIN
					</button>
					<button
						className={`px-1 pb-4 ${
							activeTab === 'shared'
								? 'border-b-2 border-black font-medium text-black'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('shared')}
					>
						SHARED ACCESS
					</button>
				</div>
			</div>

			{activeTab === 'login' ? (
				<div className="space-y-8">
					<div>
						<h2 className="mb-6 text-2xl font-medium">Login</h2>

						{/* Password Section */}
						<div className="border-b border-gray-200 py-6">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">Password</h3>
									<p className="mt-1 text-sm text-gray-500">
										Last updated 2 years ago
									</p>
								</div>
								<button
									onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}
									className="font-medium text-black underline"
								>
									{showPasswordUpdate ? 'Cancel' : 'Update'}
								</button>
							</div>

							{showPasswordUpdate && (
								<div className="mt-6">
									<AccountPass />
								</div>
							)}
						</div>

						{/* Account Section */}
						<div className="py-6">
							<h2 className="mb-6 text-2xl font-medium">Account</h2>
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">Deactivate your account</h3>
								</div>
								<Link
									href="/account-settings-delete/reasons"
									className="font-medium text-red-500 underline"
								>
									Deactivate
								</Link>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="space-y-8">
					<h2 className="mb-6 text-2xl font-medium">Shared Access</h2>
					<p className="text-gray-600">
						You can give trusted friends and family members access to your
						travsus account. Learn more about shared access.
					</p>
					<button className="rounded-lg border border-black px-6 py-2 font-medium hover:bg-gray-100">
						Add trusted person
					</button>
				</div>
			)}

			{/* Security Info Card */}
			<div className="mt-12 rounded-xl border border-gray-200 p-6">
				<div className="flex items-start">
					<div className="mr-4 rounded-full bg-amber-100 p-3">
						<Shield className="h-6 w-6 text-amber-500" />
					</div>
					<div>
						<h2 className="mb-2 text-lg font-semibold">
							Keeping your account secure
						</h2>
						<p className="mb-4 text-gray-600">
							We regularly review accounts to make sure they're secure as
							possible. We'll also let you know if there's more we can do to
							increase the security of your account.
						</p>
						<p className="text-gray-600">
							Learn about safety tips for{' '}
							<Link href="#" className="font-medium text-black underline">
								guests
							</Link>{' '}
							and{' '}
							<Link href="#" className="font-medium text-black underline">
								hosts
							</Link>
							.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
