'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Shield } from 'lucide-react'
import AccountPass from '@/components/AccountPass'
import { useTranslations } from 'next-intl'

export default function LoginAndSecurityPage() {
	const [activeTab, setActiveTab] = useState('login')
	const [showPasswordUpdate, setShowPasswordUpdate] = useState(false)
	const t = useTranslations('LoginSecurityPage')

	return (
		<div className="mx-auto max-w-4xl px-6 py-8">
			{/* Breadcrumb */}
			<div className="mb-6 flex items-center text-sm">
				<Link
					href="/account-settings"
					className="text-gray-600 hover:underline"
				>
					{t('account')}
				</Link>
				<ChevronRight className="mx-2 h-4 w-4 text-gray-500" />
				<span className="text-gray-800">{t('login_security')}</span>
			</div>

			{/* Page Title */}
			<h1 className="mb-8 text-3xl font-semibold">{t('login_security')}</h1>

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
						{t('login')}
					</button>
					<button
						className={`px-1 pb-4 ${
							activeTab === 'shared'
								? 'border-b-2 border-black font-medium text-black'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('shared')}
					>
						{t('shared_access')}
					</button>
				</div>
			</div>

			{activeTab === 'login' ? (
				<div className="space-y-8">
					<div>
						<h2 className="mb-6 text-2xl font-medium">{t('login')}</h2>

						{/* Password Section */}
						<div className="border-b border-gray-200 py-6">
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">{t('password')}</h3>
									<p className="mt-1 text-sm text-gray-500">
										{t('last_updated')}
									</p>
								</div>
								<button
									onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}
									className="font-medium text-black underline"
								>
									{showPasswordUpdate ? t('cancel') : t('update')}
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
							<h2 className="mb-6 text-2xl font-medium">{t('account')}</h2>
							<div className="flex items-center justify-between">
								<div>
									<h3 className="font-medium">{t('deactivate_account')}</h3>
								</div>
								<Link
									href="/account-settings-delete/reasons"
									className="font-medium text-red-500 underline"
								>
									{t('deactivate')}
								</Link>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="space-y-8">
					<h2 className="mb-6 text-2xl font-medium">{t('shared_access')}</h2>
					<p className="text-gray-600">{t('shared_access_description')}</p>
					<button className="rounded-lg border border-black px-6 py-2 font-medium hover:bg-gray-100">
						{t('add_trusted_person')}
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
							{t('account_security_title')}
						</h2>
						<p className="mb-4 text-gray-600">
							{t('account_security_description')}
						</p>
						<p className="text-gray-600">
							{t('safety_tips')}{' '}
							<Link href="#" className="font-medium text-black underline">
								{t('guests')}
							</Link>{' '}
							{t('and')}{' '}
							<Link href="#" className="font-medium text-black underline">
								{t('hosts')}
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
