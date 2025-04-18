'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '@/shared/Logo'

// Newsletter types from your existing component
const newsletterTypes = [
	{ id: 'deals', label: '🏷️ Exclusive Deals' },
	{ id: 'tips', label: '💡 Travel Tips' },
	{ id: 'reviews', label: '⭐ Destination Reviews' },
	{ id: 'inspiration', label: '✈️ Travel Inspiration' },
]

// Message map from your existing component
const messageMap = {
	EMAIL_REQUIRED:
		"📭 Oops! It looks like you forgot to enter an email address. Let's try that again!",
	INVALID_EMAIL:
		"🤔 Hmm, that email doesn't look quite right. Remember, it should be no more than 60 characters long. Double-check and give it another go!",
	TYPES_REQUIRED:
		"🎯 Almost there! Don't forget to pick at least one exciting newsletter type!",
	ALREADY_SUBSCRIBED:
		"🌟 Great news! You're already part of our awesome newsletter family. Stay tuned for more amazing content!",
	SUBSCRIPTION_SUCCESS:
		"🎉 Woohoo! You're officially part of our travel-loving community. Get ready for some incredible adventures in your inbox!",
	SERVER_ERROR:
		'😱 Uh-oh! Something went wrong on our end. Our team of travel gnomes is working on it. Please try again later!',
	RATE_LIMIT_EXCEEDED:
		"🚫 Whoa there, eager traveler! You've reached the request limit. Take a breather and try again in a bit.",
}

export default function NewsletterModal() {
	const { userData } = useSelector((state: any) => state.userReducer)
	const [isOpen, setIsOpen] = useState(!userData)
	const [email, setEmail] = useState('')
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [selectedTypes, setSelectedTypes] = useState<string[]>(
		newsletterTypes.map((type) => type.id),
	)
	const [isLoading, setIsLoading] = useState(false)
	const [message, setMessage] = useState('')
	const [isError, setIsError] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Check if user logs in while modal is open
	useEffect(() => {
		if (userData) {
			setIsOpen(false)
		}
	}, [userData])

	// Toggle newsletter types dropdown
	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen)
	}

	// Handle newsletter type selection
	const handleTypeChange = (typeId: string) => {
		setSelectedTypes((prev) =>
			prev.includes(typeId)
				? prev.filter((id) => id !== typeId)
				: [...prev, typeId],
		)
	}

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

		if (selectedTypes.length === 0) {
			setMessage(messageMap.TYPES_REQUIRED)
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
				body: JSON.stringify({ email, types: selectedTypes }),
			})

			const data = await response.json()

			if (response.ok) {
				setMessage(
					messageMap[data.code as keyof typeof messageMap] ||
						messageMap.SUBSCRIPTION_SUCCESS,
				)
				setIsError(false)
				setEmail('')
				setSelectedTypes(newsletterTypes.map((type) => type.id))
			} else if (response.status === 429) {
				setMessage(messageMap.RATE_LIMIT_EXCEEDED)
				setIsError(true)
			} else {
				setMessage(
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
		setIsDropdownOpen(false)
	}

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

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
			<div className="relative flex h-auto max-h-[90vh] w-[90%] max-w-4xl overflow-hidden rounded-lg bg-white">
				{/* Close button */}
				<button
					onClick={() => setIsOpen(false)}
					className="absolute right-4 top-4 z-10 text-black"
				>
					<X className="h-6 w-6" />
				</button>

				{/* Left side - Image */}
				<div className="relative hidden w-1/2 md:block">
					<div className="absolute inset-0 bg-gradient-to-b from-gray-100/10 to-gray-800/30" />
					<Image
						src="https://res.cloudinary.com/travsus/image/upload/v1744996477/ChatGPT_Image_Apr_16_2025_09_15_13_PM_redfxm.png"
						alt="Desert sand dunes under blue sky"
						width={600}
						height={800}
						className="h-full w-full object-cover"
					/>
				</div>

				{/* Right side - Content */}
				<div className="flex w-full flex-col md:w-1/2">
					{/* Logo aligned with close button - Fixed at top */}
					<div className="px-8 pt-4">
						<Logo className="h-[40px] w-[100px]" />
					</div>

					{/* Scrollable content area with fixed height */}
					<div className="flex h-[500px] max-h-[calc(90vh-140px)] flex-col justify-between">
						{/* Main content with scrolling - Always show scrollbar */}
						<div
							className="custom-scrollbar flex-grow overflow-y-scroll px-8 py-6"
							style={{
								scrollbarWidth: 'thin',
								scrollbarColor: '#888 #f1f1f1',
							}}
						>
							<div className="min-h-[400px]">
								<h1 className="text-4xl font-extrabold text-black sm:text-5xl">
									SIGN UP TODAY
								</h1>
								<div className="mt-2 text-xl sm:text-2xl">
									IT'S <span className="font-bold text-black">EASY</span> AND{' '}
									<span className="font-bold text-black">FREE</span>
								</div>

								<form
									id="newsletter-form"
									onSubmit={handleSubmit}
									className="mt-8"
								>
									{/* Email input first */}
									<label htmlFor="email" className="mb-2 block font-medium">
										Email Address
									</label>
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
											placeholder="Enter your email address (max 60 characters)"
											className="w-full rounded border border-gray-300 py-3 pl-10 pr-3 focus:border-gray-500 focus:outline-none"
											maxLength={60}
											disabled={isLoading}
										/>
									</div>

									{/* Newsletter types dropdown right after email input */}
									<div className="relative mt-4" ref={dropdownRef}>
										<button
											type="button"
											onClick={toggleDropdown}
											className="flex w-full items-center justify-between rounded border border-gray-300 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
											disabled={isLoading}
										>
											<span>
												Select newsletter types ({selectedTypes.length}{' '}
												selected)
											</span>
											<svg
												className="h-5 w-5 text-gray-400"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												aria-hidden="true"
											>
												<path
													fillRule="evenodd"
													d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</button>

										{isDropdownOpen && (
											<div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
												<div className="py-1">
													{newsletterTypes.map((type) => (
														<label
															key={type.id}
															className="flex cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
														>
															<input
																type="checkbox"
																className="mr-2 h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
																checked={selectedTypes.includes(type.id)}
																onChange={() => handleTypeChange(type.id)}
															/>
															<span>{type.label}</span>
														</label>
													))}
												</div>
											</div>
										)}
									</div>

									{/* Text right before bullet points */}
									<p className="mt-6 text-gray-700">
										Just a few reasons to sign up to our newsletter ...
									</p>

									{/* Bullet points after the text */}
									<div className="mt-3 grid gap-3">
										<div className="flex items-center gap-2">
											<div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="3"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<polyline points="20 6 9 17 4 12"></polyline>
												</svg>
											</div>
											<span className="font-medium">
												Exclusive newsletter offers
											</span>
										</div>

										<div className="flex items-center gap-2">
											<div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="3"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<polyline points="20 6 9 17 4 12"></polyline>
												</svg>
											</div>
											<span className="font-medium">
												Discounts & promotions
											</span>
										</div>

										<div className="flex items-center gap-2">
											<div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="3"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<polyline points="20 6 9 17 4 12"></polyline>
												</svg>
											</div>
											<span className="font-medium">
												Bi-weekly & monthly prizes
											</span>
										</div>

										<div className="flex items-center gap-2">
											<div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													className="h-4 w-4"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="3"
													strokeLinecap="round"
													strokeLinejoin="round"
												>
													<polyline points="20 6 9 17 4 12"></polyline>
												</svg>
											</div>
											<span className="font-medium">
												Latest product releases
											</span>
										</div>
									</div>

									{message && (
										<div
											className={`mt-4 rounded-md p-3 ${isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}
										>
											<p className="text-sm">{message}</p>
										</div>
									)}
								</form>
							</div>
						</div>

						{/* Fixed footer with button and terms */}
						<div className="border-t border-gray-200 bg-white px-8 py-4">
							<button
								type="submit"
								form="newsletter-form"
								className="w-full rounded bg-black py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
								disabled={isLoading}
								onClick={handleSubmit}
							>
								{isLoading ? 'Subscribing...' : 'SIGN UP'}
							</button>

							<p className="mt-4 text-xs text-gray-500">
								By signing up I agree to the{' '}
								<Link href="#" className="text-gray-700 hover:underline">
									Terms & Conditions
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
