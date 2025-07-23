'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ButtonPrimary from '@/shared/ButtonPrimary'

const EmailVerificationForm: React.FC = () => {
	const [verificationCode, setVerificationCode] = useState([
		'',
		'',
		'',
		'',
		'',
		'',
	])
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)
	const [isValidToken, setIsValidToken] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const inputRefs = useRef<(HTMLInputElement | null)[]>([])
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('verificationCodeToken')

	useEffect(() => {
		if (token) {
			validateToken(token)
		} else {
			setError('Invalid token. Please request a new verification email.')
			setIsLoading(false)
		}
	}, [token])

	const validateToken = async (token: string) => {
		try {
			const response = await fetch('/api/auth/validate-token', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ token }),
			})

			const data = await response.json()

			if (response.ok) {
				setIsValidToken(true)
			} else {
				setError(data.error || 'Invalid or expired token.')
			}
		} catch (error) {
			setError('An error occurred while validating the token.')
		} finally {
			setIsLoading(false)
		}
	}

	const handleChange = (index: number, value: string) => {
		if (value.length <= 1) {
			const newCode = [...verificationCode]
			newCode[index] = value
			setVerificationCode(newCode)

			if (value !== '' && index < 5) {
				inputRefs.current[index + 1]?.focus()
			}
		}
	}

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault()
		const pastedData = e.clipboardData
			.getData('text')
			.replace(/[^0-9]/g, '')
			.slice(0, 6)
		const newCode = [...verificationCode]

		for (let i = 0; i < 6; i++) {
			if (i < pastedData.length) {
				newCode[i] = pastedData[i]
			} else {
				newCode[i] = ''
			}
		}

		setVerificationCode(newCode)

		const nextEmptyIndex = newCode.findIndex((digit) => digit === '')
		if (nextEmptyIndex !== -1) {
			inputRefs.current[nextEmptyIndex]?.focus()
		} else {
			inputRefs.current[5]?.focus()
		}
	}

	const handleSubmit = async () => {
		setError(null)
		setSuccess(null)
		setIsSubmitting(true)

		if (!token) {
			setError('Invalid token. Please request a new verification email.')
			setIsSubmitting(false)
			return
		}

		const code = verificationCode.join('')
		if (code.length !== 6) {
			setError('Please enter all 6 digits of the verification code.')
			setIsSubmitting(false)
			return
		}

		try {
			const response = await fetch('/api/auth/verify-email/code', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					code,
					token,
				}),
			})

			const data = await response.json()

			if (response.ok) {
				setSuccess('Email verified successfully.')
				// setTimeout(() => router.push('/login'), 3000)
			} else {
				setError(data.error || 'An error occurred during email verification.')
			}
		} catch (error) {
			setError('An error occurred during email verification.')
		} finally {
			setIsSubmitting(false)
		}
	}

	if (isLoading) {
		return (
			<Card className="mx-auto w-[350px]">
				<CardHeader>
					<CardTitle className="text-center">Verifying...</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-center">Please wait while we verify your token.</p>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="mx-auto max-w-md">
				<CardHeader>
					<CardTitle className="text-center">Verify Your Email</CardTitle>
				</CardHeader>
				<CardContent>
					{isValidToken ? (
						<>
							<p className="mb-4 text-center">
								Please enter the 6-digit verification code sent to your email.
							</p>
							<div className="mb-4 flex justify-center space-x-2">
								{verificationCode.map((digit, index) => (
									<input
										key={index}
										ref={(el) => (inputRefs.current[index] = el)}
										type="text"
										maxLength={1}
										className="h-12 w-12 rounded-md border text-center text-2xl"
										value={digit}
										onChange={(e) => handleChange(index, e.target.value)}
										onPaste={handlePaste}
										onKeyDown={(e) => {
											if (e.key === 'Backspace' && digit === '' && index > 0) {
												inputRefs.current[index - 1]?.focus()
											}
										}}
										disabled={isSubmitting}
									/>
								))}
							</div>
							<ButtonPrimary
								onClick={handleSubmit}
								className="w-full"
								disabled={
									verificationCode.some((digit) => digit === '') || isSubmitting
								}
								loading={isSubmitting}
							>
								{isSubmitting ? 'Verifying...' : 'Verify Email'}
							</ButtonPrimary>
						</>
					) : (
						<p className="text-center text-red-600">
							{error ||
								'Invalid or expired token. Please request a new verification email.'}
						</p>
					)}
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
				</CardContent>
			</Card>
		</div>
	)
}

export default EmailVerificationForm
