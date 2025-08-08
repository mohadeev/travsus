'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import Input from '@/shared/Input'
import ButtonPrimary from '@/shared/ButtonPrimary'
import SocialLoginButtons from '@/components/SocialLoginButtons'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslations } from '@/lib/i18n'

function LoginSkeleton({ isModal }: { isModal?: boolean }) {
	return (
		<div className={`nc-PageLogin ${isModal ? 'p-0' : ''}`}>
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
							<div className="flex items-center justify-between">
								<Skeleton className="h-5 w-1/4" />
								<Skeleton className="h-5 w-1/3" />
							</div>
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

function ForgotPasswordSkeleton({ isModal }: { isModal?: boolean }) {
	return (
		<div className={`nc-PageLogin ${isModal ? 'p-0' : ''}`}>
			<div className={`${isModal ? '' : 'container mb-24 lg:mb-32'}`}>
				{!isModal && (
					<Skeleton className="mx-auto my-20 h-12 w-3/4 max-w-[300px]" />
				)}
				<div className="mx-auto max-w-md space-y-6">
					<div className="space-y-2">
						<Skeleton className="h-5 w-3/4" />
						<Skeleton className="h-10 w-full" />
					</div>
					<Skeleton className="h-10 w-full" />
					<Skeleton className="mx-auto h-5 w-1/2" />
				</div>
			</div>
		</div>
	)
}

interface LoginClientProps {
	isForgotPassword?: boolean
	isModal?: boolean
	onClose?: () => void
	onSwitchToSignup?: () => void
	onSwitchToForgotPassword?: () => void
	onSwitchToLogin?: () => void
}

export default function LoginClient({
	isForgotPassword = false,
	isModal = false,
	onClose,
	onSwitchToSignup,
	onSwitchToForgotPassword,
	onSwitchToLogin,
}: LoginClientProps) {
	const t = useTranslations('Jan03_LoginClient_k9m2')
	const router = useRouter()
	const { data: session, status } = useSession()
	const [emailSent, setEmailSent] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [isPageLoading, setIsPageLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [showForgotPassword, setShowForgotPassword] = useState(isForgotPassword)

	useEffect(() => {
		if (session) {
			if (isModal) {
				// onClose?.()
			} else {
				router.push('/')
			}
		}
		const timer = setTimeout(() => setIsPageLoading(false), 1000)
		return () => clearTimeout(timer)
	}, [session, router, isModal, onClose])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError(null)
		setLoading(true)

		try {
			const result = await signIn('credentials', {
				redirect: false,
				email,
				password,
			})

			if (result?.error) {
				setError(result.error)
			} else {
				if (isModal) {
					onClose?.()
				} else {
					router.push('/')
				}
			}
		} catch (error) {
			setError(t('Unexpected_Error'))
		} finally {
			setLoading(false)
		}
	}

	const handleForgotPasswordSubmit = async (
		event: React.FormEvent<HTMLFormElement>,
	) => {
		event.preventDefault()
		if (!email) return

		setLoading(true)
		try {
			const response = await fetch('/api/user/post/forgot-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			})

			if (response.ok) {
				setEmailSent(true)
			} else {
				setError(t('Failed_Send_Reset_Email'))
			}
		} catch (error) {
			setError(t('Unexpected_Error'))
		} finally {
			setLoading(false)
		}
	}

	const handleJoin = (e: React.MouseEvent) => {
		e.preventDefault()
		if (isModal) {
			onSwitchToSignup?.()
		} else {
			router.push('/signup')
		}
	}

	const handleForgotPassword = (e: React.MouseEvent) => {
		e.preventDefault()
		if (isModal) {
			setShowForgotPassword(true)
			onSwitchToForgotPassword?.()
		} else {
			router.push('/login?forgot=true')
		}
	}

	const handleBackToLogin = (e: React.MouseEvent) => {
		e.preventDefault()
		if (isModal) {
			setShowForgotPassword(false)
			onSwitchToLogin?.()
		} else {
			router.push('/login')
		}
		setError(null)
	}

	if (status === 'loading' || isPageLoading) {
		return showForgotPassword ? (
			<ForgotPasswordSkeleton isModal={isModal} />
		) : (
			<LoginSkeleton isModal={isModal} />
		)
	}

	if (session) {
		return null
	}

	return (
		<div className={`nc-PageLogin ${isModal ? 'p-0' : ''}`}>
			<div className={`${isModal ? '' : 'container mb-24 lg:mb-32'}`}>
				{!isModal && (
					<h1 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
						{showForgotPassword ? t('Forgot_Password') : t('Login')}
					</h1>
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

					{!showForgotPassword ? (
						<>
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
										{t('Email_Address')}
									</span>
									<Input
										type="email"
										name="email"
										placeholder={t('Email_Placeholder')}
										className="mt-1"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</label>
								<label className="block">
									<span className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
										{t('Password')}
										<Link
											href="/login?forgot=true"
											className="text-sm font-medium underline"
											onClick={handleForgotPassword}
										>
											{t('Forgot_Password_Link')}
										</Link>
									</span>
									<Input
										type="password"
										name="password"
										placeholder={t('Password_Placeholder')}
										className="mt-1"
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
									/>
								</label>
								<ButtonPrimary type="submit" loading={loading}>
									{loading ? t('Logging_In') : t('Continue')}
								</ButtonPrimary>
							</form>
							<div className="text-center text-sm">
								<p className="text-neutral-700 dark:text-neutral-300">
									{t('Not_Member')}{' '}
									<Link
										href="/signup"
										className="font-semibold underline"
										onClick={handleJoin}
									>
										{t('Join')}
									</Link>{' '}
									{t('Unlock_Best_Travsus')}
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
						</>
					) : (
						<>
							<form
								className="grid grid-cols-1 gap-6"
								onSubmit={handleForgotPasswordSubmit}
							>
								<label className="block">
									<span className="text-neutral-800 dark:text-neutral-200">
										{t('Enter_Email_Reset_Password')}
									</span>
									<Input
										type="email"
										name="email"
										placeholder={t('Email_Placeholder')}
										className="mt-1"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</label>
								<ButtonPrimary type="submit" loading={loading}>
									{loading ? t('Sending') : t('Send_Password_Reset_Email')}
								</ButtonPrimary>
							</form>
							{emailSent && (
								<div className="text-center text-green-600">
									{t('Password_Reset_Email_Sent')}
								</div>
							)}
							<Link
								href="/login"
								className="block cursor-pointer text-center text-neutral-700 underline dark:text-neutral-300"
								onClick={handleBackToLogin}
							>
								{t('Back_To_Login')}
							</Link>
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
						</>
					)}
				</div>
			</div>
		</div>
	)
}
