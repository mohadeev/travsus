'use client'

import type React from 'react'

import { useState } from 'react'

// Message map from your existing component
const messageMap = {
	EMAIL_REQUIRED:
		"📭 Oops! It looks like you forgot to enter an email address. Let's try that again!",
	INVALID_EMAIL:
		"🤔 Hmm, that email doesn't look quite right. Remember, it should be no more than 60 characters long. Double-check and give it another go!",
	SUBSCRIPTION_SUCCESS:
		"🎉 Woohoo! You're officially part of our travel-loving community. Get ready for some incredible adventures in your inbox!",
	SERVER_ERROR:
		'😱 Uh-oh! Something went wrong on our end. Our team is working on it. Please try again later!',
}

interface NewsletterSimpleProps {
	className?: string
}

export default function NewsletterSimple({
	className = '',
}: NewsletterSimpleProps) {
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [message, setMessage] = useState('')
	const [isError, setIsError] = useState(false)

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
			const response = await fetch('/api/user/post/newsletter', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					types: ['deals', 'tips', 'reviews', 'inspiration'],
				}),
			})

			const data = await response.json()

			if (response.ok) {
				setMessage(messageMap.SUBSCRIPTION_SUCCESS)
				setIsError(false)
				setEmail('')
			} else {
				setMessage(messageMap.SERVER_ERROR)
				setIsError(true)
			}
		} catch (error) {
			setMessage(messageMap.SERVER_ERROR)
			setIsError(true)
		}

		setIsLoading(false)
	}

	return (
		<section className={`py-12 ${className}`}>
			<div className="w-full px-4">
				<div
					className="w-full rounded-xl p-8 shadow-sm"
					style={{ backgroundColor: '#F5F5F7' }}
				>
					<div className="text-center">
						<h2 className="text-3xl font-bold text-black">
							Join Our Newsletter
						</h2>
						<p className="mt-3 text-gray-600">
							Stay updated with our latest offers, travel tips, and exclusive
							deals. Sign up today and be the first to know about our special
							promotions.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="mt-6">
						<div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
							<div className="relative w-full sm:w-64 md:w-80">
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
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="Enter your email"
									className="w-full rounded-md border border-gray-300 bg-white py-3 pl-10 pr-3 focus:border-gray-500 focus:outline-none"
									maxLength={60}
									disabled={isLoading}
								/>
							</div>
							<button
								type="submit"
								className="rounded-md bg-black px-6 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
								disabled={isLoading}
							>
								{isLoading ? 'Subscribing...' : 'SIGN UP'}
							</button>
						</div>

						{message && (
							<div
								className={`mt-4 rounded-md p-3 ${isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}
							>
								<p className="text-sm">{message}</p>
							</div>
						)}

						<p className="mt-4 text-center text-sm text-gray-500">
							We respect your privacy and will never share your information.
						</p>
					</form>
				</div>
			</div>
		</section>
	)
}
