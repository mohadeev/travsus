'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Shield } from 'lucide-react'
import AccountPass from '@/components/AccountPass'
import { useTranslations } from 'next-intl'

export default function LoginAndSecurityPage() {
	const [activeTab, setActiveTab] = useState('login')
	const [showPasswordUpdate, setShowPasswordUpdate] = useState(false)
	const t = useTranslations('accountsettings_loginandsecurity_page')

	return (
		<div className="mx-auto max-w-4xl px-6 py-8">
			{/* Breadcrumb */}
			<div className="mb-6 flex items-center text-sm">
				<Link
					href="/account-settings"
					className="text-gray-600 hover:underline"
				>
					{t('Account')}
				</Link>
				<ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
				<span className="text-gray-800">{t('Login_Security')}</span>
			</div>

			{/* Page Title */}
			<h1 className="mb-8 text-3xl font-semibold">{t('Login_Security')}</h1>

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
						{t('Login')}
					</button>
					<button
						className={`px-1 pb-4 ${
							activeTab === 'shared'
								? 'border-b-2 border-black font-medium text-black'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('shared')}
					>
						{t('Shared_Access')}
					</button>
				</div>
			</div>

			{activeTab === 'login' ? (
				<div className="space-y-8">
					<div>
						<h2 className="mb-6 text-2xl font-medium">{t('Login')}</h2>

						{/* Password Section */}
						<div className="border-b border-gray-200 py-6">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">{t('Password')}</h3>
									<p className="mt-1 text-sm text-gray-500">
										{t('Last_Updated_2_Years_Ago')}
									</p>
								</div>
								<button
									onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}
									className="font-medium text-black underline"
								>
									{showPasswordUpdate ? t('Cancel') : t('Update')}
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
							<h2 className="mb-6 text-2xl font-medium">{t('Account_2')}</h2>
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">
										{t('Deactivate_Your_Account')}
									</h3>
								</div>
								<Link
									href="/account-settings-delete/reasons"
									className="font-medium text-red-500 underline"
								>
									{t('Deactivate')}
								</Link>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="space-y-8">
					<h2 className="mb-6 text-2xl font-medium">{t('Shared_Access')}</h2>
					<p className="text-gray-600">{t('You_Can_Give_Trusted_Friends')}</p>
					<button className="rounded-lg border border-black px-6 py-2 font-medium hover:bg-gray-100">
						{t('Add_Trusted_Person')}
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
							{t('Keeping_Your_Account_Secure')}
						</h2>
						<p className="mb-4 text-gray-600">
							{t('We_Regularly_Review_Accounts')}
						</p>
						<p className="text-gray-600">
							{t('Learn_About_Safety_Tips')}{' '}
							<Link href="#" className="font-medium text-black underline">
								{t('Guests')}
							</Link>{' '}
							and{' '}
							<Link href="#" className="font-medium text-black underline">
								{t('Hosts')}
							</Link>
							.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
