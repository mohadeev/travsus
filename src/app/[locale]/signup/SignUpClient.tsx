'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Input from '@/shared/Input'
import ButtonPrimary from '@/shared/ButtonPrimary'
import SocialLoginButtons from '@/components/SocialLoginButtons'
import { Skeleton } from '@/components/ui/skeleton'
import VerifyEmailCodePage from './VerifyEmailCodePage'
import { useTranslations } from '@/lib/i18n'

function SignUpSkeleton({ isModal }: { isModal?: boolean }) {
	return (
		<div className={`nc-PageSignUp ${isModal ? 'p-0' : ''}`}>
			<div className={`${isModal ? '' : 'container mb-24 lg:mb-32'}`}>
				{!isModal && (
					<Skeleton className="mx-auto my-20 h-12 w-3/4 max-w-[300px]" />
				)}
				<div className="mx-auto max-w-md space-y-6">
					<div className="space-y-3">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="relative">
						<Skeleton className="mx-auto h-4 w-8" />
						<Skeleton className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2" />
					</div>
					<div className="space-y-6">
						<div className="space-y-2">
							<Skeleton className="h-5 w-1/4" />
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-5 w-1/4" />
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-5 w-1/4" />
							<Skeleton className="h-10 w-full" />
						</div>
						<Skeleton className="h-10 w-full" />
					</div>
					<Skeleton className="mx-auto h-5 w-3/4" />
				</div>
			</div>
		</div>
	)
}

interface SignUpClientProps {
	isModal?: boolean
	onClose?: () => void
	onSwitchToLogin?: () => void
}

export default function SignUpClient({
	isModal = false,
	onClose,
	onSwitchToLogin,
}: SignUpClientProps) {
	const t = useTranslations('Jan03_SignUpClient_p7k4')
	const router = useRouter()
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [isPageLoading, setIsPageLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [showVerification, setShowVerification] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => setIsPageLoading(false), 1000)
		return () => clearTimeout(timer)
	}, [])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError(null)
		setLoading(true)

		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password }),
			})

			if (response.ok) {
				// Sign up successful, show verification page
				setShowVerification(true)
			} else {
				const data = await response.json()
				setError(data.message || t('Sign_Up_Error'))
			}
		} catch (error) {
			setError(t('Unexpected_Error'))
		} finally {
			setLoading(false)
		}
	}

	const handleSwitchToLogin = (e: React.MouseEvent) => {
		e.preventDefault()
		if (isModal) {
			onSwitchToLogin?.()
		} else {
			router.push('/login')
		}
	}

	if (isPageLoading) {
		return <SignUpSkeleton isModal={isModal} />
	}

	if (showVerification) {
		return <VerifyEmailCodePage email={email} />
	}

	return (
		<div className={`nc-PageSignUp ${isModal ? 'p-0' : ''}`}>
			<div className={`${isModal ? '' : 'container mb-24 lg:mb-32'}`}>
				{!isModal && (
					<h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
						{t('Sign_Up')}
					</h2>
				)}
				<div className="mx-auto max-w-md space-y-6">
					{error && (
						<div
							className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
							role="alert"
						>
							<span className="block sm:inline">{error}</span>
						</div>
					)}

					<SocialLoginButtons />

					<div className="relative text-center">
						<span className="relative z-10 inline-block bg-white px-4 text-sm font-medium dark:bg-neutral-900 dark:text-neutral-400">
							{t('OR')}
						</span>
						<div className="absolute left-0 top-1/2 w-full -translate-y-1/2 transform border border-neutral-100 dark:border-neutral-800"></div>
					</div>

					<form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
						<label className="block">
							<span className="text-neutral-800 dark:text-neutral-200">
								{t('Full_Name')}
							</span>
							<Input
								type="text"
								placeholder={t('Full_Name_Placeholder')}
								className="mt-1"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</label>
						<label className="block">
							<span className="text-neutral-800 dark:text-neutral-200">
								{t('Email_Address')}
							</span>
							<Input
								type="email"
								placeholder={t('Email_Placeholder')}
								className="mt-1"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</label>
						<label className="block">
							<span className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
								{t('Password')}
							</span>
							<Input
								type="password"
								placeholder={t('Password_Placeholder')}
								className="mt-1"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</label>
						<ButtonPrimary type="submit" loading={loading}>
							{loading ? t('Creating_Account') : t('Join')}
						</ButtonPrimary>
					</form>

					<div className="text-center text-sm">
						<p className="text-neutral-700 dark:text-neutral-300">
							{t('Already_Member')}{' '}
							<Link
								href="/login"
								className="font-semibold underline"
								onClick={handleSwitchToLogin}
							>
								{t('Sign_In')}
							</Link>
						</p>
					</div>

					<div className="mt-8 text-center text-xs text-neutral-700 dark:text-neutral-300">
						<p>
							{t('By_Proceeding_Agree')}{' '}
							<Link href="/terms" className="underline">
								{t('Terms_Of_Use')}
							</Link>{' '}
							{t('And_Confirm_Read')}{' '}
							<Link href="/privacy" className="underline">
								{t('Privacy_Cookie_Statement')}
							</Link>
							.
						</p>
						<p className="mt-2">
							{t('Site_Protected_ReCAPTCHA')}{' '}
							<a
								href="https://policies.google.com/privacy"
								target="_blank"
								rel="noopener noreferrer"
								className="underline"
							>
								{t('Privacy_Policy')}
							</a>{' '}
							{t('And')}{' '}
							<a
								href="https://policies.google.com/terms"
								target="_blank"
								rel="noopener noreferrer"
								className="underline"
							>
								{t('Terms_Of_Service')}
							</a>{' '}
							{t('Apply')}.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
