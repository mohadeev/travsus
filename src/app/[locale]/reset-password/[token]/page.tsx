'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Input from '@/shared/Input'
import ButtonPrimary from '@/shared/ButtonPrimary'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslations } from 'next-intl'
import axios from 'axios'

function SkeletonLoading() {
	return (
		<div className="nc-ResetPassword">
			<div className="container mb-24 lg:mb-32">
				<div className="mx-auto max-w-md space-y-6">
					<div className="space-y-4">
						<Skeleton className="mx-auto my-20 h-12 w-full" />
						{[1, 2].map((i) => (
							<Skeleton key={i} className="h-12 w-full" />
						))}
					</div>
					<Skeleton className="h-12 w-full" />
				</div>
			</div>
		</div>
	)
}

export default function ResetPasswordPage() {
	const t = useTranslations('Jan03_ResetPassword_r8k5')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)
	const [loading, setLoading] = useState(false)
	const [isPageLoading, setIsPageLoading] = useState(true)
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token') || ''

	useEffect(() => {
		const timer = setTimeout(() => setIsPageLoading(false), 1000)
		return () => clearTimeout(timer)
	}, [])

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError(null)
		setLoading(true)

		if (newPassword !== confirmPassword) {
			setError(t('passwords_not_match'))
			setLoading(false)
			return
		}

		try {
			const response = await axios.post('/api/user/post/update-password', {
				token,
				newPassword,
				confirmPassword,
			})

			if (response.status === 200) {
				setSuccess(true)
				setTimeout(() => {
					router.push('/login')
				}, 2000)
			} else {
				setError(response.data.message || t('something_went_wrong'))
			}
		} catch (err: any) {
			if (err.response && err.response.data && err.response.data.message) {
				setError(err.response.data.message)
			} else {
				setError(t('failed_reset_password'))
			}
		} finally {
			setLoading(false)
		}
	}

	if (isPageLoading) {
		return <SkeletonLoading />
	}

	return (
		<div className="nc-ResetPassword">
			<div className="container mb-24 lg:mb-32">
				<h2 className="my-20 flex items-center justify-center text-3xl font-semibold leading-[115%] text-neutral-900 dark:text-neutral-100 md:text-5xl md:leading-[115%]">
					{t('reset_password_title')}
				</h2>
				<div className="mx-auto max-w-md space-y-6">
					{error && (
						<div
							className="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
							role="alert"
						>
							<span className="block sm:inline">{error}</span>
						</div>
					)}
					{success && (
						<div
							className="relative rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700"
							role="alert"
						>
							<span className="block sm:inline">
								{t('password_reset_success')}
							</span>
						</div>
					)}
					<form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
						<label className="block">
							<span className="text-neutral-800 dark:text-neutral-200">
								{t('new_password_label')}
							</span>
							<Input
								type="password"
								placeholder={t('new_password_placeholder')}
								className="mt-1"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
							/>
						</label>
						<label className="block">
							<span className="text-neutral-800 dark:text-neutral-200">
								{t('confirm_password_label')}
							</span>
							<Input
								type="password"
								placeholder={t('confirm_password_placeholder')}
								className="mt-1"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
						</label>
						<ButtonPrimary type="submit" loading={loading}>
							{loading ? t('resetting_button') : t('reset_password_button')}
						</ButtonPrimary>
					</form>
					<span className="block text-center text-neutral-700 dark:text-neutral-300">
						{t('remember_password')}{' '}
						<Link href="/login" className="font-semibold underline">
							{t('back_to_login')}
						</Link>
					</span>
				</div>
			</div>
		</div>
	)
}
