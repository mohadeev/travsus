'use client'
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslations } from '@/lib/i18n'

function SkeletonLoading() {
	return (
		<Card className="mx-auto w-[350px]">
			<CardHeader>
				<Skeleton className="mx-auto mb-2 h-8 w-3/4" />
			</CardHeader>
			<CardContent>
				<Skeleton className="mb-4 h-4 w-full" />
				<Skeleton className="mx-auto h-4 w-3/4" />
			</CardContent>
		</Card>
	)
}

const VerifyEmailTokenPage: React.FC = () => {
	const t = useTranslations('rights_verifyemail_token_page')
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		const token = searchParams.get('token')
		if (token) {
			verifyEmail(token)
		} else {
			notFound()
		}
	}, [searchParams])

	const verifyEmail = async (token: string) => {
		try {
			const response = await fetch('/api/auth/verify-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token }),
			})

			const data = await response.json()

			if (response.ok) {
				setSuccess(t('Email_Verified_Successfully'))
				setTimeout(() => router.push('/login'), 3000)
			} else {
				setError(data.error || t('Error_Occurred_During_Verification'))
			}
		} catch (error) {
			setError(t('Error_Occurred_During_Verification'))
		} finally {
			setIsLoading(false)
		}
	}

	if (isLoading) {
		return (
			<div className="container mx-auto px-4 py-8">
				<SkeletonLoading />
			</div>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="mx-auto max-w-md">
				<CardHeader>
					<CardTitle className="text-center">
						{t('Verify_Your_Email')}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{error && (
						<div className="rounded bg-red-100 p-2 text-center text-red-700">
							{error}
						</div>
					)}
					{success && (
						<div className="rounded bg-green-100 p-2 text-center text-green-700">
							{success}
						</div>
					)}
					{!error && !success && (
						<div className="text-center">
							<p>{t('Verifying_Your_Email')}</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}

export default VerifyEmailTokenPage
