'use client'
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Input from '@/shared/Input'
import ButtonPrimary from '@/shared/ButtonPrimary'

const VerifyEmailPage: React.FC = () => {
	const [verificationInput, setVerificationInput] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)
	const router = useRouter()
	const searchParams = useSearchParams()

	useEffect(() => {
		const token = searchParams.get('token')
		if (token) {
			verifyEmail(token)
		}
	}, [searchParams])

	const verifyEmail = async (input: string) => {
		try {
			const response = await fetch('/api/auth/verify-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					token: input.length > 6 ? input : null,
					code: input.length === 6 ? input : null,
				}),
			})

			const data = await response.json()

			if (response.ok) {
				setSuccess('Email verified successfully. Redirecting to login...')
				setTimeout(() => router.push('/login'), 3000)
			} else {
				setError(data.error || 'An error occurred during email verification.')
			}
		} catch (error) {
			setError('An error occurred during email verification.')
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		verifyEmail(verificationInput)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="mb-6 text-center text-3xl font-bold">Verify Your Email</h1>
			<div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-md dark:bg-neutral-800">
				<p className="mb-4 text-center">
					We've sent a verification code to your email. Please enter it below or
					use the link in the email to verify your account.
				</p>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="verificationInput"
							className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Verification Code:
						</label>
						<Input
							id="verificationInput"
							type="text"
							value={verificationInput}
							onChange={(e) => setVerificationInput(e.target.value)}
							placeholder="Enter 6-digit code"
							required
						/>
					</div>
					<ButtonPrimary type="submit" className="w-full">
						Verify Email
					</ButtonPrimary>
				</form>
				{error && (
					<div className="mt-4 rounded bg-red-100 p-2 text-center text-red-700">
						{error}
					</div>
				)}
				{success && (
					<div className="mt-4 rounded bg-green-100 p-2 text-center text-green-700">
						{success}
					</div>
				)}
			</div>
		</div>
	)
}

export default VerifyEmailPage
