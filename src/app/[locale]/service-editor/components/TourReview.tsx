'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface TourReviewProps {
	tourData: {
		name: string
		subtitle: string
		overview: string
		highlights: { name: string }[]
		days: { name: string; description: string }[]
		pricingTiers: {
			minSeats: number
			maxSeats: number
			pricing: {
				pricePerDay: number
				totalPrice: number
				currency: string
			}
		}[]
		accommodations: {
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
		images: { public_id: string; url: string }[]
		region: { region: string; country: string }
		start: { name: string }
		end: { name: string }
		lang: string
		tags: string[]
	}
}

export default function TourReview({ tourData }: TourReviewProps) {
	const [expandedSections, setExpandedSections] = useState<{
		[key: string]: boolean
	}>({})

	const toggleSection = (section: string) => {
		setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
	}

	const renderSection = (title: string, content: React.ReactNode) => (
		<div className="border-b border-gray-200 py-4">
			<Button
				className="flex w-full items-center justify-between text-left"
				onClick={() => toggleSection(title)}
				variant="ghost"
			>
				<h3 className="text-lg font-semibold">{title}</h3>
				<span>{expandedSections[title] ? '▲' : '▼'}</span>
			</Button>
			{expandedSections[title] && <div className="mt-2">{content}</div>}
		</div>
	)

	return (
		<div className="space-y-6">
			<h2 className="mb-4 text-2xl font-bold">Tour Review</h2>

			{renderSection(
				'Basic Info',
				<div className="space-y-2">
					<p>
						<strong>Name:</strong> {tourData?.name || 'N/A'}
					</p>
					<p>
						<strong>Subtitle:</strong> {tourData?.subtitle || 'N/A'}
					</p>
					<p>
						<strong>Region:</strong> {tourData?.region?.region || 'N/A'}
					</p>
					<p>
						<strong>Country:</strong> {tourData?.region?.country || 'N/A'}
					</p>
					<p>
						<strong>Start:</strong> {tourData?.start?.name || 'N/A'}
					</p>
					<p>
						<strong>End:</strong> {tourData?.end?.name || 'N/A'}
					</p>
					<p>
						<strong>Language:</strong> {tourData?.lang || 'N/A'}
					</p>
					<p>
						<strong>Tags:</strong> {tourData?.tags?.join(', ') || 'N/A'}
					</p>
				</div>,
			)}

			{renderSection('Overview', <p>{tourData?.overview || 'N/A'}</p>)}

			{renderSection(
				'Highlights',
				<ul className="list-disc pl-5">
					{tourData?.highlights?.map((highlight, index) => (
						<li key={index}>{highlight.name}</li>
					)) || <li>N/A</li>}
				</ul>,
			)}

			{renderSection(
				'Itinerary',
				<div className="space-y-4">
					{tourData?.days?.map((day, index) => (
						<div key={index}>
							<h4 className="font-semibold">{day.name}</h4>
							<p>{day.description}</p>
						</div>
					)) || <p>N/A</p>}
				</div>,
			)}

			{renderSection(
				'Pricing',
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
								Seats
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
								Price Per Day
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
								Total Price
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{tourData?.pricingTiers?.map((tier, index) => (
							<tr key={index}>
								<td className="whitespace-nowrap px-6 py-4">
									{tier.minSeats} - {tier.maxSeats}
								</td>
								<td className="whitespace-nowrap px-6 py-4">
									{tier.pricing.pricePerDay} {tier.pricing.currency}
								</td>
								<td className="whitespace-nowrap px-6 py-4">
									{tier.pricing.totalPrice} {tier.pricing.currency}
								</td>
							</tr>
						)) || (
							<tr>
								<td colSpan={3}>N/A</td>
							</tr>
						)}
					</tbody>
				</table>,
			)}

			{renderSection(
				'Accommodations',
				<div className="space-y-4">
					{tourData?.accommodations?.map((accommodation, index) => (
						<div key={index} className="border-t pt-4">
							<h4 className="font-semibold">{accommodation.name}</h4>
							<p>{accommodation.description}</p>
							<h5 className="mt-2 font-medium">Pricing Tiers:</h5>
							{accommodation?.pricingTiers?.map((tier, tierIndex) => (
								<div key={tierIndex} className="ml-4">
									<p>
										<strong>{tier.name}</strong> (Seats: {tier.minSeats} -{' '}
										{tier.maxSeats})
									</p>
									<ul className="list-disc pl-5">
										{tier?.bedOptions?.map((option, optionIndex) => (
											<li key={optionIndex}>
												{option.bedType} (Max Occupancy: {option.maxOccupancy})
												- {option.basePrice} {option.currency}
											</li>
										)) || <li>N/A</li>}
									</ul>
								</div>
							)) || <p>N/A</p>}
						</div>
					)) || <p>N/A</p>}
				</div>,
			)}

			{renderSection(
				'Images',
				<div className="grid grid-cols-3 gap-4">
					{tourData?.images?.map((image, index) => (
						<img
							key={image.public_id}
							src={image.url}
							alt={`Tour image ${index + 1}`}
							className="h-40 w-full rounded-lg object-cover"
						/>
					)) || <p>N/A</p>}
				</div>,
			)}
		</div>
	)
}
