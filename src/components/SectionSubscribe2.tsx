'use client'

import React, { FC, useState, useRef, useEffect } from 'react'
import ButtonCircle from '@/shared/ButtonCircle'
import rightImg from '@/images/SVG-subcribe2.png'
import Badge from '@/shared/Badge'
import Input from '@/shared/Input'
import Image from 'next/image'
import { Motion, spring } from 'react-motion'
import Button from '@/shared/Button'

export interface SectionSubscribe2Props {
	className?: string
}

const newsletterTypes = [
	{ id: 'deals', label: '🏷️ Exclusive Deals' },
	{ id: 'tips', label: '💡 Travel Tips' },
	{ id: 'reviews', label: '⭐ Destination Reviews' },
	{ id: 'inspiration', label: '✈️ Travel Inspiration' },
]

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

const SectionSubscribe2: FC<SectionSubscribe2Props> = ({ className = '' }) => {
	const [email, setEmail] = useState('')
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [selectedTypes, setSelectedTypes] = useState<string[]>(
		newsletterTypes.map((type) => type.id),
	)
	const [isLoading, setIsLoading] = useState(false)
	const [message, setMessage] = useState('')
	const [isError, setIsError] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen)
	}

	const handleTypeChange = (typeId: string) => {
		setSelectedTypes((prev) =>
			prev.includes(typeId)
				? prev.filter((id) => id !== typeId)
				: [...prev, typeId],
		)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
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
				setMessage(messageMap[data.code as keyof typeof messageMap])
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

	return (
		<div
			className={`nc-SectionSubscribe2 relative flex flex-col lg:flex-row lg:items-center ${className}`}
			data-nc-id="SectionSubscribe2"
		>
			<div className="mb-10 flex-shrink-0 lg:mb-0 lg:mr-10 lg:w-2/5">
				<h2 className="text-4xl font-semibold">Join our newsletter 🎉</h2>
				<span className="mt-5 block text-neutral-500 dark:text-neutral-400">
					Read and share new perspectives on just about any topic. Everyone's
					welcome! 🌍✨
				</span>
				<ul className="mt-10 space-y-4">
					<li className="flex items-center space-x-4">
						<Badge name="01" />
						<span className="font-medium text-neutral-700 dark:text-neutral-300">
							Get more discounts 💰
						</span>
					</li>
					<li className="flex items-center space-x-4">
						<Badge color="red" name="02" />
						<span className="font-medium text-neutral-700 dark:text-neutral-300">
							Get premium magazines 📚
						</span>
					</li>
				</ul>
				<form className="relative mt-10 max-w-sm" onSubmit={handleSubmit}>
					<div className="relative">
						<Input
							required
							aria-required
							placeholder="Enter your email (max 60 characters)"
							type="email"
							rounded="rounded-full"
							sizeClass="h-12 px-5 py-3"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={isLoading}
							maxLength={60}
						/>
						<ButtonCircle
							type="button"
							className="absolute right-1.5 top-1/2 -translate-y-1/2 transform"
							size="w-10 h-10"
							disabled={isLoading}
							onClick={toggleDropdown}
						>
							<i className="las la-arrow-down text-xl"></i>
						</ButtonCircle>
					</div>
					<div className="relative" ref={dropdownRef}>
						<Motion
							style={{
								opacity: spring(isDropdownOpen ? 1 : 0),
								scale: spring(isDropdownOpen ? 1 : 0.95),
							}}
						>
							{(interpolatedStyle) => (
								<div
									className={`absolute right-0 z-10 mt-2 w-56 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${isDropdownOpen ? '' : 'hidden'}`}
									style={{
										opacity: interpolatedStyle.opacity,
										transform: `scale(${interpolatedStyle.scale})`,
										transformOrigin: 'top right',
									}}
								>
									{isDropdownOpen && (
										<>
											<div className="py-1">
												{newsletterTypes.map((type) => (
													<label
														key={type.id}
														className="flex cursor-pointer items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
													>
														<input
															type="checkbox"
															className="form-checkbox h-5 w-5 text-indigo-600"
															checked={selectedTypes.includes(type.id)}
															onChange={() => handleTypeChange(type.id)}
														/>
														<span className="ml-2">{type.label}</span>
													</label>
												))}
											</div>
											<div className="py-1">
												<Button
													loading={isLoading}
													type="submit"
													className="font- w-full rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2"
													disabled={isLoading}
												>
													{isLoading ? 'Subscribing... 🕒' : 'Subscribe 🚀'}
												</Button>
											</div>
										</>
									)}
								</div>
							)}
						</Motion>
					</div>
				</form>
				{message && (
					<p
						className={`mt-3 text-sm ${isError ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'} rounded-lg bg-opacity-20 p-3`}
					>
						{message}
					</p>
				)}
			</div>
			<div className="flex-grow">
				<Image alt="" src={rightImg} />
			</div>
		</div>
	)
}

export default SectionSubscribe2
