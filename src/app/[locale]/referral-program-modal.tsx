'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/shared/Logo'
import { useTranslations } from '@/lib/i18n'

// Message map for referral program
const messageMap = {
	EMAIL_REQUIRED:
		'📭 Please enter your email address to join our referral program.',
	INVALID_EMAIL:
		"🤔 That email doesn't look quite right. It should be no more than 60 characters long.",
	SUBSCRIPTION_SUCCESS:
		"🎉 Thanks for joining our referral program! We'll send you all the details to get started.",
	ALREADY_SUBSCRIBED:
		"🌟 You're already enrolled in our referral program. Check your email for details.",
	SERVER_ERROR: '😱 Something went wrong on our end. Please try again later.',
}

interface ReferralProgramModalProps {
	isOpen: boolean
	onClose: () => void
}

export default function ReferralProgramModal({
	isOpen,
	onClose,
}: ReferralProgramModalProps) {
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [message, setMessage] = useState('')
	const [isError, setIsError] = useState(false)
	const t = useTranslations("app_locale_referralprogrammodal")

	// Form submission handler
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// Validation
		if (!email) {
			setMessage(messageMap.EMAIL_REQUIRED)
			setIsError(true)
			return
		}

		if (email.length > 60) {
			setMessage(messageMap.INVALID_EMAIL)
			setIsError(true)
			return
		}

		setIsLoading(true)
		setMessage('')
		setIsError(false)

		try {
			// Use the referral program API endpoint
			const response = await fetch('/api/user/post/referral-program', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
				}),
			})

			const data = await response.json()

			if (response.ok) {
				setMessage(
					data.message ||
						messageMap[data.code as keyof typeof messageMap] ||
						messageMap.SUBSCRIPTION_SUCCESS,
				)
				setIsError(false)
				setEmail('')
			} else {
				setMessage(
					data.message ||
						messageMap[data.code as keyof typeof messageMap] ||
						messageMap.SERVER_ERROR,
				)
				setIsError(true)
			}
		} catch (error) {
			setMessage(messageMap.SERVER_ERROR)
			setIsError(true)
		}

		setIsLoading(false)
	}

	// Prevent scrolling when modal is open
	useEffect(() => {
		if (isOpen) {
			// Disable scrolling on body
			document.body.style.overflow = 'hidden'
		}

		// Cleanup function to re-enable scrolling when modal closes or component unmounts
		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [isOpen])

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div className="relative w-[90%] max-w-md overflow-hidden rounded-lg bg-white">
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute right-4 top-4 z-10 text-black"
				>
					<X className="h-6 w-6" />
				</button>

				{/* Logo at top */}
				<div className="px-8 pt-4">
					<Logo className="h-[40px] w-[100px]" />
				</div>

				{/* Content */}
				<div className="flex flex-col justify-between">
					<div className="px-8 py-6">
						<div className="text-center">
							<h1 className="text-6xl font-black leading-tight text-black">
								{t('app_locale_referralprogrammodal_Earn')}
								<span className="text-green-600">€2500</span>
							</h1>
							<div className="mb-6 mt-4">
								<div className="relative">
									<div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 transform bg-gray-200"></div>
									<div className="relative inline-block bg-black px-4 py-1 text-4xl font-extrabold tracking-widest text-white">
										{t('app_locale_referralprogrammodal_Per_Month')}
									</div>
								</div>
							</div>
						</div>

						<p className="mt-8 text-center text-gray-600">
							{t('app_locale_referralprogrammodal_Join_Our_Referral_Program')}
						</p>

						{message && (
							<div
								className={`mt-4 rounded-md p-3 ${isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}
							>
								<p className="text-sm">{message}</p>
							</div>
						)}
					</div>

					{/* Footer with input and button in column */}
					<div className="border-t border-gray-200 bg-white px-8 py-4">
						<form id="referral-form" onSubmit={handleSubmit}>
							<div className="flex flex-col gap-2">
								<div className="relative">
									<div className="absolute inset-y-0 left-3 flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-5 w-5 text-gray-400"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<rect x="2" y="4" width="20" height="16" rx="2"></rect>
											<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
										</svg>
									</div>
									<input
										type="email"
										id="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder={t('app_locale_referralprogrammodal_Enter_Your_Email_Address')}
										className="w-full rounded border border-gray-300 py-3 pl-10 pr-3 focus:border-gray-500 focus:outline-none"
										maxLength={60}
										disabled={isLoading}
									/>
								</div>
								<button
									type="submit"
									className="rounded bg-black py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
									disabled={isLoading}
								>
									{isLoading ? t('app_locale_referralprogrammodal_Submitting') : t('app_locale_referralprogrammodal_Join_Program')}
								</button>
							</div>
						</form>

						<p className="mt-4 text-center text-xs text-gray-500">
							{t('app_locale_referralprogrammodal_By_Signing_Up')}
							<Link href="#" className="text-gray-700 hover:underline">
								{t('app_locale_referralprogrammodal_Terms_And_Conditions')}
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}