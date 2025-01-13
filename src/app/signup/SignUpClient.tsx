'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Input from '@/shared/Input'
import ButtonPrimary from '@/shared/ButtonPrimary'
import SocialLoginButtons from '@/components/SocialLoginButtons'
import { Skeleton } from '@/components/ui/skeleton'
import VerifyEmailCodePage from './VerifyEmailCodePage'
import EmailVerificationForm from '../verify-email/code/EmailVerificationForm'
import { signIn } from 'next-auth/react'
import { useAuthAction } from '../hooks/useAuthAction'

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
	const router = useRouter()
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const [isPageLoading, setIsPageLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [showVerification, setShowVerification] = useState(false)
	const [verificationCodeToken, setVerificationCodeToken] = useState('')
	const searchParams = useSearchParams()
	const authMode = searchParams.get('authMode')

	useEffect(() => {
		const timer = setTimeout(() => setIsPageLoading(false), 1000)
		return () => clearTimeout(timer)
	}, [])

	const func = useAuthAction(async () => {}, {
		auth: 'signup',
		authMode: 'code',
		verificationCodeToken: verificationCodeToken,
	})

	useEffect(() => {
		if (verificationCodeToken?.length >= 1) {
			func()
		}
	}, [verificationCodeToken])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError(null)
		setLoading(true)

		try {
			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ firstName, lastName, email, password }),
			})

			if (response.ok) {
				const data = await response.json()
				if (isModal) {
					setVerificationCodeToken(data.verificationCodeToken)
				}
				const result = await signIn('credentials', {
					redirect: false,
					email,
					password,
				})
				if (result?.error) {
					setError(result.error)
				}
			} else {
				const data = await response.json()
				setError(data.message || 'An error occurred during sign up')
			}
		} catch (error) {
			console.error(error)
			setError('An unexpected error occurred. Please try again.')
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

	if (authMode === 'code') {
		return <EmailVerificationForm />
	}

	return (
		<div className={`nc-PageSignUp ${isModal ? 'p-0' : ''}`}>
			<div className={`${isModal ? '' : 'container mb-24 lg:mb-32'}`}>
				{!isModal && (
					<h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
						Sign up
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
							OR
						</span>
						<div className="absolute left-0 top-1/2 w-full -translate-y-1/2 transform border border-neutral-100 dark:border-neutral-800"></div>
					</div>
					<form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
						<div className="grid grid-cols-2 gap-4">
							<label className="block">
								<span className="text-neutral-800 dark:text-neutral-200">
									First name
								</span>
								<Input
									type="text"
									placeholder="John"
									className="mt-1"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									required
								/>
							</label>
							<label className="block">
								<span className="text-neutral-800 dark:text-neutral-200">
									Last name
								</span>
								<Input
									type="text"
									placeholder="Doe"
									className="mt-1"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									required
								/>
							</label>
						</div>
						<label className="block">
							<span className="text-neutral-800 dark:text-neutral-200">
								Email address
							</span>
							<Input
								type="email"
								placeholder="example@example.com"
								className="mt-1"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</label>
						<label className="block">
							<span className="flex items-center justify-between text-neutral-800 dark:text-neutral-200">
								Password
							</span>
							<Input
								type="password"
								className="mt-1"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</label>
						<ButtonPrimary type="submit" loading={loading}>
							{loading ? 'Creating account...' : 'Join'}
						</ButtonPrimary>
					</form>
					<div className="text-center text-sm">
						<p className="text-neutral-700 dark:text-neutral-300">
							Already a member?{' '}
							<Link
								href="/login"
								className="font-semibold underline"
								onClick={handleSwitchToLogin}
							>
								Sign in
							</Link>
						</p>
					</div>
					<div className="mt-8 text-center text-xs text-neutral-700 dark:text-neutral-300">
						<p>
							By proceeding, you agree to our{' '}
							<Link href="/terms" className="underline">
								Terms of Use
							</Link>{' '}
							and confirm you have read our{' '}
							<Link href="/privacy" className="underline">
								Privacy and Cookie Statement
							</Link>
							.
						</p>
						<p className="mt-2">
							This site is protected by reCAPTCHA and the Google{' '}
							<a
								href="https://policies.google.com/privacy"
								target="_blank"
								rel="noopener noreferrer"
								className="underline"
							>
								Privacy Policy
							</a>{' '}
							and{' '}
							<a
								href="https://policies.google.com/terms"
								target="_blank"
								rel="noopener noreferrer"
								className="underline"
							>
								Terms of Service
							</a>{' '}
							apply.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
