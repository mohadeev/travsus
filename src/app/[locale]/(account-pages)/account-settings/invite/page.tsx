export const dynamic = "force-dynamic";
export const dynamic = "force-dynamic";
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Copy, Gift, ChevronRight } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useTranslations } from '@/lib/i18n'

export default function CreditsAndCouponsPage() {
	const t = useTranslations('CreditsAndCoupons')
	const { userData } = useSelector((state: any) => state.userReducer)

	const [copied, setCopied] = useState(false)

	// Example values — ideally fetched from backend
	const creditBalance = userData?.credits || 0

	// Use dynamic origin
	const origin = typeof window !== 'undefined' ? window.location.origin : ''
	const referralLink = userData?.referralLinks?.[0]?.code
		? `${origin}/${userData.referralLinks[0].code}`
		: ''

	const handleCopy = () => {
		navigator.clipboard.writeText(referralLink)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

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
				<span className="text-gray-800">{t('Credits_Coupons')}</span>
			</div>

			{/* Page Title */}
			<h1 className="mb-8 text-3xl font-semibold">{t('Credits_Coupons')}</h1>

			{/* Balance Section */}
			<div className="flex items-start space-x-4 rounded-xl border border-gray-200 p-6">
				<div className="rounded-full bg-pink-100 p-3">
					<Gift className="h-6 w-6 text-pink-500" />
				</div>
				<div>
					<p className="text-gray-700">
						{t('You_Have')} € {creditBalance} {t('In_Credits')}
					</p>
					<Link
						href="/help/credits"
						className="text-sm text-pink-600 hover:underline"
					>
						{t('More_Info')}
					</Link>
				</div>
			</div>

			{/* Referral Link Section */}
			<div className="mt-8 space-y-2">
				<h2 className="text-lg font-medium">{t('Referral_Link')}</h2>
				<div className="flex items-center space-x-2">
					<input
						type="text"
						value={referralLink}
						readOnly
						className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
					/>
					<button
						onClick={handleCopy}
						className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
					>
						{copied ? t('Copied') : <Copy className="h-4 w-4" />}
					</button>
				</div>
			</div>

			{/* Share Section */}
			<div className="mt-6 space-y-2">
				<h2 className="text-lg font-medium">{t('Share')}</h2>
				<div className="flex flex-wrap gap-2">
					<button
						onClick={() =>
							window.open(
								`https://api.whatsapp.com/send?text=${encodeURIComponent(referralLink)}`,
								'_blank',
							)
						}
						className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
					>
						WhatsApp
					</button>
					<button
						onClick={() =>
							window.open(
								`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=Únete%20conmigo%20en%20esta%20plataforma!`,
								'_blank',
							)
						}
						className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
					>
						Twitter
					</button>
					<button
						onClick={() =>
							window.open(
								`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
								'_blank',
							)
						}
						className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
					>
						Facebook
					</button>
					<button
						onClick={() =>
							(window.location.href = `mailto:?subject=Únete%20conmigo&body=${referralLink}`)
						}
						className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100"
					>
						Email
					</button>
				</div>
			</div>
		</div>
	)
}
