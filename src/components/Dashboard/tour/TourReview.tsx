'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronDown, ChevronUp, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface TourReviewProps {
	tourData: {
		name?: string
		subtitle?: string
		overview?: string
		highlights?: { name: string }[]
		days?: { name: string; description: string }[]
		pricingTiers?: {
			minSeats: number
			maxSeats: number
			transportType?: string
			transportImage?: string
			pricing: {
				pricePerDay: number
				totalPrice: number
				currency: string
			}
		}[]
		accommodations?: {
			name: string
			description: string
			pricingTiers: {
				name: string
				minSeats: number
				maxSeats: number
				bedOptions: {
					bedType: string
					maxOccupancy: number
					basePrice: number
					currency: string
				}[]
			}[]
		}[]
		images?: {
			public_id: string
			url: string
			alt?: string
			isFeatured?: boolean
		}[]
		region?: { region?: string; country?: string }
		start?: { name?: string }
		end?: { name?: string }
		lang?: string
		tags?: string[]
	}
}

export default function TourReview({ tourData }: TourReviewProps) {
	const [expandedSections, setExpandedSections] = useState<{
		[key: string]: boolean
	}>({
		'basic-info': true,
		overview: true,
		highlights: true,
		itinerary: true,
		pricing: true,
		accommodations: true,
		images: true,
	})

	const toggleSection = (section: string) => {
		setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
	}

	// Function to format currency
	const formatCurrency = (amount: number, currency = 'EUR') => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency,
			minimumFractionDigits: 0,
		}).format(amount)
	}

	// Get the featured image
	const featuredImage =
		tourData.images?.find((img) => img.isFeatured)?.url ||
		tourData.images?.[0]?.url ||
		'/placeholder.svg?height=300&width=500'

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
				<div>
					<h2 className="text-xl font-bold">Tour Review</h2>
					<p className="text-muted-foreground text-sm">
						Review all the information for your tour before publishing.
					</p>
				</div>

				{/* Tags */}
				{tourData.tags && tourData.tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{tourData.tags.map((tag, index) => (
							<Badge key={index} variant="secondary" className="px-3 py-1">
								{tag}
							</Badge>
						))}
					</div>
				)}
			</div>

			{/* Featured Image */}
			<div className="relative mb-6 overflow-hidden rounded-lg">
				<div className="relative aspect-[21/9] w-full">
					<Image
						src={featuredImage || '/placeholder.svg'}
						alt={tourData.name || 'Tour featured image'}
						fill
						className="object-cover"
					/>
				</div>
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
				<div className="absolute bottom-0 left-0 p-4 text-white">
					<h1 className="text-2xl font-bold">{tourData.name}</h1>
					{tourData.subtitle && (
						<p className="text-sm opacity-90">{tourData.subtitle}</p>
					)}
				</div>
			</div>

			{/* Basic Information */}
			<Card className="mb-4 overflow-hidden">
				<CardHeader className="flex flex-row items-center justify-between bg-slate-50 py-3">
					<CardTitle className="text-lg">Basic Information</CardTitle>
					<button
						type="button"
						onClick={() => toggleSection('basic-info')}
						className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
					>
						<span className="sr-only">Toggle section</span>
						{expandedSections['basic-info'] ? (
							<ChevronUp className="h-3 w-3" />
						) : (
							<ChevronDown className="h-3 w-3" />
						)}
					</button>
				</CardHeader>
				{expandedSections['basic-info'] && (
					<CardContent className="p-4">
						<dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div className="rounded-md bg-slate-50 p-3">
								<dt className="text-xs font-medium text-slate-500">
									Tour Name
								</dt>
								<dd className="mt-1 text-sm font-medium">
									{tourData.name || 'Not specified'}
								</dd>
							</div>
							<div className="rounded-md bg-slate-50 p-3">
								<dt className="text-xs font-medium text-slate-500">Subtitle</dt>
								<dd className="mt-1 text-sm">
									{tourData.subtitle || 'Not specified'}
								</dd>
							</div>
							<div className="rounded-md bg-slate-50 p-3">
								<dt className="text-xs font-medium text-slate-500">Region</dt>
								<dd className="mt-1 text-sm">
									{tourData.region?.region || 'Not specified'}
								</dd>
							</div>
							<div className="rounded-md bg-slate-50 p-3">
								<dt className="text-xs font-medium text-slate-500">Country</dt>
								<dd className="mt-1 text-sm">
									{tourData.region?.country || 'Not specified'}
								</dd>
							</div>
							<div className="rounded-md bg-slate-50 p-3">
								<dt className="text-xs font-medium text-slate-500">
									Start Location
								</dt>
								<dd className="mt-1 text-sm">
									{tourData.start?.name || 'Not specified'}
								</dd>
							</div>
							<div className="rounded-md bg-slate-50 p-3">
								<dt className="text-xs font-medium text-slate-500">
									End Location
								</dt>
								<dd className="mt-1 text-sm">
									{tourData.end?.name || 'Not specified'}
								</dd>
							</div>
							<div className="rounded-md bg-slate-50 p-3">
								<dt className="text-xs font-medium text-slate-500">Language</dt>
								<dd className="mt-1 text-sm">
									{tourData.lang || 'Not specified'}
								</dd>
							</div>
						</dl>
					</CardContent>
				)}
			</Card>

			{/* Overview */}
			<Card className="mb-4 overflow-hidden">
				<CardHeader className="flex flex-row items-center justify-between bg-slate-50 py-3">
					<CardTitle className="text-lg">Overview</CardTitle>
					<button
						type="button"
						onClick={() => toggleSection('overview')}
						className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
					>
						<span className="sr-only">Toggle section</span>
						{expandedSections['overview'] ? (
							<ChevronUp className="h-3 w-3" />
						) : (
							<ChevronDown className="h-3 w-3" />
						)}
					</button>
				</CardHeader>
				{expandedSections['overview'] && (
					<CardContent className="p-4">
						<div className="rounded-md bg-slate-50 p-4">
							<p className="whitespace-pre-line text-sm">
								{tourData.overview || 'No overview provided.'}
							</p>
						</div>
					</CardContent>
				)}
			</Card>

			{/* Highlights */}
			<Card className="mb-4 overflow-hidden">
				<CardHeader className="flex flex-row items-center justify-between bg-slate-50 py-3">
					<CardTitle className="text-lg">Highlights</CardTitle>
					<button
						type="button"
						onClick={() => toggleSection('highlights')}
						className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
					>
						<span className="sr-only">Toggle section</span>
						{expandedSections['highlights'] ? (
							<ChevronUp className="h-3 w-3" />
						) : (
							<ChevronDown className="h-3 w-3" />
						)}
					</button>
				</CardHeader>
				{expandedSections['highlights'] && (
					<CardContent className="p-4">
						{tourData.highlights && tourData.highlights.length > 0 ? (
							<div className="grid gap-3 sm:grid-cols-2">
								{tourData.highlights.map((highlight, index) => (
									<div
										key={index}
										className="flex items-start gap-3 rounded-md bg-slate-50 p-3"
									>
										<div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-medium text-white">
											{index + 1}
										</div>
										<div className="text-sm">{highlight.name}</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-sm text-slate-500">No highlights added.</p>
						)}
					</CardContent>
				)}
			</Card>

			{/* Itinerary */}
			<Card className="mb-4 overflow-hidden">
				<CardHeader className="flex flex-row items-center justify-between bg-slate-50 py-3">
					<CardTitle className="text-lg">Itinerary</CardTitle>
					<button
						type="button"
						onClick={() => toggleSection('itinerary')}
						className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
					>
						<span className="sr-only">Toggle section</span>
						{expandedSections['itinerary'] ? (
							<ChevronUp className="h-3 w-3" />
						) : (
							<ChevronDown className="h-3 w-3" />
						)}
					</button>
				</CardHeader>
				{expandedSections['itinerary'] && (
					<CardContent className="p-4">
						{tourData.days && tourData.days.length > 0 ? (
							<div className="space-y-4">
								{tourData.days.map((day, index) => (
									<div key={index} className="rounded-md bg-slate-50 p-4">
										<div className="mb-2 flex items-center gap-2">
											<div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-medium text-white">
												{index + 1}
											</div>
											<h4 className="font-medium">{day.name}</h4>
										</div>
										<p className="whitespace-pre-line text-sm">
											{day.description}
										</p>
									</div>
								))}
							</div>
						) : (
							<p className="text-sm text-slate-500">No itinerary days added.</p>
						)}
					</CardContent>
				)}
			</Card>

			{/* Pricing */}
			<Card className="mb-4 overflow-hidden">
				<CardHeader className="flex flex-row items-center justify-between bg-slate-50 py-3">
					<CardTitle className="text-lg">Pricing & Transportation</CardTitle>
					<button
						type="button"
						onClick={() => toggleSection('pricing')}
						className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
					>
						<span className="sr-only">Toggle section</span>
						{expandedSections['pricing'] ? (
							<ChevronUp className="h-3 w-3" />
						) : (
							<ChevronDown className="h-3 w-3" />
						)}
					</button>
				</CardHeader>
				{expandedSections['pricing'] && (
					<CardContent className="p-4">
						{tourData.pricingTiers && tourData.pricingTiers.length > 0 ? (
							<div className="grid gap-4 md:grid-cols-2">
								{tourData.pricingTiers.map((tier, index) => (
									<div
										key={index}
										className="overflow-hidden rounded-md border border-slate-200"
									>
										<div className="bg-slate-50 p-3">
											<div className="flex items-center justify-between">
												<h4 className="font-medium">
													{tier.transportType || `Option ${index + 1}`}
												</h4>
												<span className="rounded-full bg-slate-200 px-2 py-1 text-xs">
													{tier.minSeats}-{tier.maxSeats} people
												</span>
											</div>
										</div>
										<div className="p-3">
											<div className="mb-2 grid grid-cols-2 gap-2">
												<div>
													<p className="text-xs text-slate-500">
														Price Per Day
													</p>
													<p className="font-medium">
														{formatCurrency(
															tier.pricing.pricePerDay,
															tier.pricing.currency,
														)}
													</p>
												</div>
												<div>
													<p className="text-xs text-slate-500">Total Price</p>
													<p className="font-medium">
														{formatCurrency(
															tier.pricing.totalPrice,
															tier.pricing.currency,
														)}
													</p>
												</div>
											</div>
											{tier.transportImage && (
												<div className="mt-3 flex justify-center">
													<div className="relative h-16 w-32">
														<Image
															src={tier.transportImage || '/placeholder.svg'}
															alt={tier.transportType || 'Transport'}
															fill
															className="object-contain"
														/>
													</div>
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-sm text-slate-500">No pricing tiers added.</p>
						)}
					</CardContent>
				)}
			</Card>

			{/* Accommodations */}
			{tourData.accommodations && tourData.accommodations.length > 0 && (
				<Card className="mb-4 overflow-hidden">
					<CardHeader className="flex flex-row items-center justify-between bg-slate-50 py-3">
						<CardTitle className="text-lg">Accommodations</CardTitle>
						<button
							type="button"
							onClick={() => toggleSection('accommodations')}
							className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
						>
							<span className="sr-only">Toggle section</span>
							{expandedSections['accommodations'] ? (
								<ChevronUp className="h-3 w-3" />
							) : (
								<ChevronDown className="h-3 w-3" />
							)}
						</button>
					</CardHeader>
					{expandedSections['accommodations'] && (
						<CardContent className="p-4">
							<div className="space-y-6">
								{tourData.accommodations.map((accommodation, index) => (
									<div
										key={index}
										className="overflow-hidden rounded-md border border-slate-200"
									>
										<div className="bg-slate-50 p-3">
											<h4 className="font-medium">{accommodation.name}</h4>
											<p className="text-sm text-slate-600">
												{accommodation.description}
											</p>
										</div>
										<div className="p-3">
											{accommodation.pricingTiers.map((tier, tierIndex) => (
												<div key={tierIndex} className="mb-4 last:mb-0">
													<h5 className="mb-2 text-sm font-medium">
														{tier.name} ({tier.minSeats}-{tier.maxSeats} people)
													</h5>
													<div className="overflow-x-auto">
														<table className="min-w-full divide-y divide-gray-200 rounded-md border border-slate-200">
															<thead className="bg-slate-50">
																<tr>
																	<th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
																		Bed Type
																	</th>
																	<th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
																		Max Occupancy
																	</th>
																	<th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
																		Price
																	</th>
																</tr>
															</thead>
															<tbody className="divide-y divide-gray-200 bg-white">
																{tier.bedOptions.map((option, optionIndex) => (
																	<tr key={optionIndex}>
																		<td className="whitespace-nowrap px-3 py-2 text-sm">
																			{option.bedType}
																		</td>
																		<td className="whitespace-nowrap px-3 py-2 text-sm">
																			{option.maxOccupancy}
																		</td>
																		<td className="whitespace-nowrap px-3 py-2 text-sm">
																			{formatCurrency(
																				option.basePrice,
																				option.currency,
																			)}
																		</td>
																	</tr>
																))}
															</tbody>
														</table>
													</div>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					)}
				</Card>
			)}

			{/* Images */}
			<Card className="mb-4 overflow-hidden">
				<CardHeader className="flex flex-row items-center justify-between bg-slate-50 py-3">
					<CardTitle className="text-lg">Images</CardTitle>
					<button
						type="button"
						onClick={() => toggleSection('images')}
						className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
					>
						<span className="sr-only">Toggle section</span>
						{expandedSections['images'] ? (
							<ChevronUp className="h-3 w-3" />
						) : (
							<ChevronDown className="h-3 w-3" />
						)}
					</button>
				</CardHeader>
				{expandedSections['images'] && (
					<CardContent className="p-4">
						{tourData.images && tourData.images.length > 0 ? (
							<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
								{tourData.images.map((image, index) => (
									<div
										key={image.public_id || index}
										className="group relative overflow-hidden rounded-md"
									>
										<div className="aspect-square relative w-full">
											<Image
												src={image.url || '/placeholder.svg'}
												alt={image.alt || `Tour image ${index + 1}`}
												fill
												className="object-cover transition-transform duration-200 group-hover:scale-105"
											/>
										</div>
										{image.isFeatured && (
											<div className="absolute right-2 top-2 rounded-full bg-amber-500 p-1 text-white">
												<Star className="h-3 w-3 fill-current" />
											</div>
										)}
									</div>
								))}
							</div>
						) : (
							<p className="text-sm text-slate-500">No images added.</p>
						)}
					</CardContent>
				)}
			</Card>
		</div>
	)
}
