'use client'

import React, { useState, useEffect } from 'react'
import { X, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Logo from '@/shared/Logo'
import ButtonSecondary from '@/shared/ButtonSecondary'

type ConsentOption = {
	id: string
	title: string
	description: string
	required?: boolean
	subcategories?: {
		id: string
		title: string
		description?: string
	}[]
}

const consentOptions: ConsentOption[] = [
	{
		id: 'necessary',
		title: 'Strictly Necessary Cookies',
		description:
			'These cookies are necessary for the website to function and cannot be switched off. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work. These cookies do not store any personally identifiable information.',
		required: true,
	},
	{
		id: 'advertising',
		title: 'Advertisement Personalisation',
		description:
			'Necessary to offer you relevant and personalised ads based on your activity and profile.',
		subcategories: [
			{
				id: 'geo-ads',
				title:
					'Storage and access to geolocation information for targeted advertising purposes',
			},
			{
				id: 'ad-profiles',
				title: 'Create profiles for personalised advertising',
			},
			{
				id: 'select-ads',
				title: 'Use profiles to select personalised advertising',
			},
			{ id: 'limited-ads', title: 'Use limited data to select advertising' },
		],
	},
	{
		id: 'content',
		title: 'Content customisation',
		description:
			'Necessary to offer you personalised content and improve products, based on your activity.',
		subcategories: [
			{
				id: 'select-content',
				title: 'Use profiles to select personalised content',
			},
			{ id: 'improve-services', title: 'Develop and improve services' },
			{
				id: 'content-profiles',
				title: 'Create profiles to personalise content',
			},
			{
				id: 'device-storage',
				title: 'Store and/or access information on a device',
			},
			{
				id: 'device-scan',
				title: 'Actively scan device characteristics for identification',
			},
		],
	},
	{
		id: 'measurement',
		title: 'Measurement',
		description:
			'Necessary to measure the performance of content and advertisements and conduct market research in order to improve the services we offer.',
		subcategories: [
			{
				id: 'geo-studies',
				title:
					'Storage and access to geolocation information to carry out marketing studies',
			},
			{
				id: 'audience-insights',
				title:
					'Understand audiences through statistics or combinations of data from different sources',
			},
			{ id: 'content-performance', title: 'Measure content performance' },
			{ id: 'ad-performance', title: 'Measure advertising performance' },
			{ id: 'precise-geo', title: 'Use precise geolocation data' },
		],
	},
	{
		id: 'limited-content',
		title: 'Use limited data to select content',
		description:
			'Content presented to you on this service can be based on limited data, such as the website or app you are using, your non-precise location, your device type, or which content you are (or have been) interacting with (for example, to limit the number of times a video or an article is presented to you).',
		subcategories: [
			{ id: 'consent', title: 'Consent' },
			{ id: 'legitimate-interest', title: 'Legitimate interest' },
		],
	},
]

export function CombinedCookieConsent() {
	const [showInitialPrompt, setShowInitialPrompt] = useState(false)
	const [showDetailedConsent, setShowDetailedConsent] = useState(false)
	const [expanded, setExpanded] = useState<string[]>([])
	const [selectedOptions, setSelectedOptions] = useState<string[]>([
		'necessary',
	])
	const [isLoadingInitial, setIsLoadingInitial] = useState(true)
	const [isLoadingDetailed, setIsLoadingDetailed] = useState(true)
	const [showComponent, setShowComponent] = useState(false)

	const hasUserMadeDecision = () => {
		const savedPreferences = localStorage.getItem('userConsentPreferences')
		return savedPreferences !== null
	}

	useEffect(() => {
		const skeletonTimer = setTimeout(() => {
			setShowComponent(true)
			setIsLoadingInitial(true)
		}, 4000)

		const contentTimer = setTimeout(() => {
			setIsLoadingInitial(false)
			if (!hasUserMadeDecision()) {
				setShowInitialPrompt(true)
			} else {
				loadUserPreferences()
			}
		}, 4500)

		return () => {
			clearTimeout(skeletonTimer)
			clearTimeout(contentTimer)
		}
	}, [])

	const saveUserPreferences = (options: string[]) => {
		localStorage.setItem('userConsentPreferences', JSON.stringify(options))
	}

	const loadUserPreferences = () => {
		const savedPreferences = localStorage.getItem('userConsentPreferences')
		if (savedPreferences) {
			const parsedPreferences = JSON.parse(savedPreferences)
			setSelectedOptions(parsedPreferences)
			setShowInitialPrompt(false)
		}
	}

	const toggleExpand = (id: string) => {
		setExpanded((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		)
	}

	const toggleOption = (id: string) => {
		if (id === 'necessary') return // Can't toggle always active options
		setSelectedOptions((prev) => {
			return prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
		})
	}

	const handleAgreeAll = () => {
		const allOptions = consentOptions.map((o) => o.id)
		setSelectedOptions(allOptions)
		saveUserPreferences(allOptions)
		setShowComponent(false)
	}

	const handleRejectAll = () => {
		const necessaryOnly = ['necessary']
		setSelectedOptions(necessaryOnly)
		saveUserPreferences(necessaryOnly)
		setShowComponent(false)
	}

	const handleShowPurposes = () => {
		setShowInitialPrompt(false)
		setIsLoadingDetailed(true)
		setShowDetailedConsent(true)
		setTimeout(() => setIsLoadingDetailed(false), 500)
	}

	const handleSave = () => {
		saveUserPreferences(selectedOptions)
		setShowDetailedConsent(false)
	}

	const SkeletonLoaderDetailedConsent = () => (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
				<div className="p-6">
					<div className="mb-6 flex items-center justify-between">
						<Skeleton className="h-10 w-40 bg-gray-200" />
						<Skeleton className="h-6 w-6 rounded-full bg-gray-200" />
					</div>
					<Skeleton className="mb-4 h-8 w-3/4 bg-gray-200" />
					<Skeleton className="mb-6 h-20 w-full bg-gray-200" />
					<Skeleton className="mb-4 h-4 w-1/2 bg-gray-200" />
					<Skeleton className="mb-2 h-6 w-1/4 bg-gray-200" />
					<div className="mb-6 space-y-4">
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="border-b border-gray-200 pb-4">
								<div className="mb-2 flex items-center justify-between">
									<Skeleton className="h-6 w-3/4 bg-gray-200" />
									<Skeleton className="h-6 w-16 bg-gray-200" />
								</div>
								<Skeleton className="h-4 w-full bg-gray-200" />
								<Skeleton className="mt-1 h-4 w-5/6 bg-gray-200" />
							</div>
						))}
					</div>
					<Skeleton className="mb-6 h-20 w-full bg-gray-200" />
					<div className="flex justify-between">
						<Skeleton className="h-10 w-32 bg-gray-200" />
						<Skeleton className="h-10 w-32 bg-gray-200" />
					</div>
				</div>
			</div>
		</div>
	)

	const SkeletonLoaderInitialPrompt = () => (
		<div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 shadow-lg">
			<div className="container mx-auto max-w-4xl">
				<Skeleton className="mb-2 h-8 w-1/3 bg-gray-200" />
				<Skeleton className="mb-2 h-4 w-full bg-gray-200" />
				<Skeleton className="mb-2 h-4 w-11/12 bg-gray-200" />
				<Skeleton className="mb-2 h-4 w-full bg-gray-200" />
				<Skeleton className="mb-4 h-4 w-10/12 bg-gray-200" />
				<Skeleton className="mb-2 h-6 w-1/4 bg-gray-200" />
				<div className="mb-4 ml-6">
					<Skeleton className="mb-1 h-4 w-11/12 bg-gray-200" />
					<Skeleton className="mb-1 h-4 w-10/12 bg-gray-200" />
					<Skeleton className="mb-1 h-4 w-11/12 bg-gray-200" />
					<Skeleton className="mb-1 h-4 w-9/12 bg-gray-200" />
				</div>
				<div className="flex flex-col justify-end gap-2 sm:flex-row">
					<Skeleton className="h-10 w-24 bg-gray-200" />
					<Skeleton className="h-10 w-32 bg-gray-200" />
					<Skeleton className="h-10 w-24 bg-gray-200" />
				</div>
			</div>
		</div>
	)

	const InitialPrompt = () => (
		<div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white p-4 shadow-lg">
			<div className="container mx-auto max-w-4xl">
				<h2 className="mb-2 text-lg font-semibold">Your Privacy Matters</h2>
				<p className="mb-4 text-sm text-gray-600">
					At TRAVSUS, we value your privacy and aim to provide a personalized
					travel experience. We and our partners may collect and process certain
					data to enhance your browsing experience and offer tailored services.
					By selecting "I Accept," you agree to the use of cookies and similar
					technologies as described in our Cookie Policy. Choosing "Reject All"
					will limit data collection to essential website functionality. You can
					modify your preferences at any time through the Manage Preferences
					link at the bottom of our website. For comprehensive information on
					how we handle your data, please refer to our{' '}
					<Link
						href="/privacy-policy"
						className="text-blue-600 hover:underline"
					>
						Privacy Policy
					</Link>
					.
				</p>

				<div className="mb-4 text-sm text-gray-600">
					<strong>We and our partners may process data to:</strong>
					<ul className="ml-6 mt-2 list-disc">
						<li>Enhance website functionality and performance</li>
						<li>Provide personalized travel recommendations</li>
						<li>Analyze user behavior to improve our services</li>
						<li>Deliver relevant advertising based on your interests</li>
					</ul>
				</div>

				<div className="flex flex-col justify-end gap-2 sm:flex-row">
					<ButtonSecondary
						variant="outline"
						onClick={handleRejectAll}
						className="sm:order-1"
					>
						Reject All
					</ButtonSecondary>
					<ButtonSecondary
						variant="outline"
						onClick={handleShowPurposes}
						className=":order-2"
					>
						Show Purposes
					</ButtonSecondary>
					<Button onClick={handleAgreeAll} className="sm:order-3">
						I Accept
					</Button>
				</div>
			</div>
		</div>
	)

	const DetailedConsent = () => (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
			<div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl">
				<div className="p-6">
					{/* Header */}
					<div className="mb-6 flex items-center justify-between">
						{/* <Image
							src="/placeholder.svg?height=40&width=150"
							alt="TRAVSUS"
							width={150}
							height={40}
							className="h-10 w-auto"
						/> */}
						<Logo className="h-[40px] w-[100px]" />
						<button
							onClick={handleSave}
							className="text-gray-400 hover:text-gray-500"
						>
							<X className="h-6 w-6" />
						</button>
					</div>
					<h2 className="mb-4 text-xl font-semibold">
						Welcome to TRAVSUS Consent Management
					</h2>
					<p className="mb-6 text-sm text-gray-600">
						We and our partners place cookies, access and use non-sensitive
						information from your device to improve our products and personalize
						ads and other contents throughout this website. You may accept all
						or part of these operations. To learn more about cookies, partners,
						and how we use your data, to review your options or these operations
						for each partner, visit our{' '}
						<Link
							href="/cookie-policy"
							className="text-blue-600 hover:underline"
						>
							Cookies Policy
						</Link>
						.
					</p>

					<div className="mb-4">
						<Link
							href="#agree-all"
							className="text-sm text-blue-600 hover:underline"
						>
							Skip to "Agree to all"
						</Link>
					</div>

					<h3 className="mb-2 font-semibold">You allow</h3>

					{/* Options */}
					<div className="mb-6 space-y-4">
						{consentOptions.map((option) => (
							<div key={option.id} className="border-b border-gray-200 pb-4">
								<div className="flex items-center justify-between">
									<button
										onClick={() => toggleExpand(option.id)}
										className="flex w-full items-center text-left"
									>
										{expanded.includes(option.id) ? (
											<ChevronUp className="mr-2 h-4 w-4" />
										) : (
											<ChevronDown className="mr-2 h-4 w-4" />
										)}
										<span className="text-sm font-medium">{option.title}</span>
									</button>
									<div className="ml-4 flex items-center">
										{option.required ? (
											<span className="text-sm text-blue-600">Required</span>
										) : (
											<div className="flex items-center space-x-2">
												<Switch
													id={option.id}
													checked={selectedOptions.includes(option.id)}
													onCheckedChange={() => toggleOption(option.id)}
												/>
												<Label htmlFor={option.id} className="text-sm">
													{selectedOptions.includes(option.id)
														? 'Enabled'
														: 'Disabled'}
												</Label>
											</div>
										)}
									</div>
								</div>
								{expanded.includes(option.id) && (
									<div className="ml-6 mt-2">
										<p className="mb-2 text-sm text-gray-600">
											{option.description}
										</p>
										{option.subcategories && (
											<div className="space-y-2">
												{option.subcategories.map((sub) => (
													<div
														key={sub.id}
														className="flex items-center justify-between"
													>
														<span className="text-sm">{sub.title}</span>
														<div className="flex items-center space-x-2">
															<Switch
																id={sub.id}
																checked={selectedOptions.includes(sub.id)}
																onCheckedChange={() => toggleOption(sub.id)}
															/>
															<Label htmlFor={sub.id} className="text-sm">
																{selectedOptions.includes(sub.id)
																	? 'Enabled'
																	: 'Disabled'}
															</Label>
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								)}
							</div>
						))}
					</div>

					<p className="mb-6 text-sm text-gray-600">
						By giving consent to the purposes above, you also allow this website
						and its partners to operate the following data processing: Deliver
						and present advertising and content, Ensure security, prevent and
						detect fraud, and fix errors, Identify devices based on information
						transmitted automatically, Link different devices, Match and combine
						data from other data sources, and Save and communicate privacy
						choices.
					</p>

					{/* Footer */}
					<div className="flex justify-between">
						<button
							onClick={handleRejectAll}
							className="rounded-full border border-gray-300 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Disagree to all
						</button>
						<button
							id="agree-all"
							onClick={handleAgreeAll}
							className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-gray-800"
						>
							Agree to all
						</button>
					</div>
				</div>
			</div>
		</div>
	)

	return (
		<>
			{showComponent && (
				<>
					{!hasUserMadeDecision() && (
						<>
							{isLoadingInitial && <SkeletonLoaderInitialPrompt />}
							{!isLoadingInitial && showInitialPrompt && <InitialPrompt />}
							{isLoadingDetailed && showDetailedConsent && (
								<SkeletonLoaderDetailedConsent />
							)}
							{!isLoadingDetailed && showDetailedConsent && <DetailedConsent />}
						</>
					)}
				</>
			)}
		</>
	)
}
