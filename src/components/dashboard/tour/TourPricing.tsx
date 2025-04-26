'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Trash } from 'lucide-react'

// Default transport types with descriptions
const transportTypes = [
	{
		name: 'SUV (prado)',
		image: '/images/transports/prado.png',
		minPeople: 1,
		maxPeople: 5,
		description: 'Comfortable SUV for small groups and families',
	},
	{
		name: 'Mercedes Vito',
		image: '/images/transports/vito.png',
		minPeople: 6,
		maxPeople: 8,
		description: 'Luxury van perfect for medium-sized groups',
	},
	{
		name: 'Mercedes Minivan',
		image: '/images/transports/mercedes-minivan.png',
		minPeople: 9,
		maxPeople: 19,
		description: 'Spacious minivan for larger groups with extra luggage',
	},
	{
		name: 'Big Bus',
		image: '/images/transports/bus.png',
		minPeople: 20,
		maxPeople: 40,
		description: 'Full-sized coach for large groups and extended tours',
	},
]

// Default pricing tiers data structure
const defaultPricingTiers = [
	{
		minSeats: 1,
		maxSeats: 5,
		transportType: 'SUV (prado)',
		transportImage: '/images/transports/prado.png',
		pricing: {
			pricePerDay: 100,
			totalPrice: 500,
			currency: 'EUR',
		},
	},
	{
		minSeats: 6,
		maxSeats: 8,
		transportType: 'Mercedes Vito',
		transportImage: '/images/transports/vito.png',
		pricing: {
			pricePerDay: 100,
			totalPrice: 500,
			currency: 'EUR',
		},
	},
	{
		minSeats: 9,
		maxSeats: 19,
		transportType: 'Mercedes Minivan',
		transportImage: '/images/transports/mercedes-minivan.png',
		pricing: {
			pricePerDay: 100,
			totalPrice: 500,
			currency: 'EUR',
		},
	},
	{
		minSeats: 20,
		maxSeats: 40,
		transportType: 'Big Bus',
		transportImage: '/images/transports/bus.png',
		pricing: {
			pricePerDay: 100,
			totalPrice: 500,
			currency: 'EUR',
		},
	},
]

interface PricingTier {
	minSeats: number
	maxSeats: number
	transportType: string
	transportImage?: string
	pricing: {
		pricePerDay: number
		totalPrice: number
		currency: string
	}
}

interface TourPricingProps {
	tourData: {
		pricingTiers?: PricingTier[]
	}
	updateTourData: (data: Partial<TourPricingProps['tourData']>) => void
}

export default function TourPricing({
	tourData,
	updateTourData,
}: TourPricingProps) {
	const [hasAttemptedNavigation, setHasAttemptedNavigation] = useState(false)

	// Find the appropriate transport type based on min and max seats
	const findTransportTypeByCapacity = (minSeats: number, maxSeats: number) => {
		// Try to find an exact match first
		let transport = transportTypes.find(
			(t) => t.minPeople === minSeats && t.maxPeople === maxSeats,
		)

		// If no exact match, find the closest match based on capacity range
		if (!transport) {
			transport = transportTypes.find(
				(t) => minSeats >= t.minPeople && maxSeats <= t.maxPeople,
			)
		}

		// If still no match, find the transport with the closest max capacity
		if (!transport) {
			// Sort by how close the max capacity is to our max seats
			const sorted = [...transportTypes].sort((a, b) => {
				return (
					Math.abs(a.maxPeople - maxSeats) - Math.abs(b.maxPeople - maxSeats)
				)
			})
			transport = sorted[0]
		}

		return transport || transportTypes[0] // Fallback to first transport if nothing matches
	}

	// Initialize pricing tiers with default data only if empty
	useEffect(() => {
		if (!tourData.pricingTiers || tourData.pricingTiers.length === 0) {
			console.log('Initializing default pricing tiers')
			updateTourData({ pricingTiers: defaultPricingTiers })
		} else {
			console.log('Using existing pricing tiers:', tourData.pricingTiers)
			// Ensure all pricing tiers have images and correct transport types by matching seat capacity
			const updatedTiers = tourData.pricingTiers.map((tier) => {
				// Find the appropriate transport type based on capacity
				const transport = findTransportTypeByCapacity(
					tier.minSeats,
					tier.maxSeats,
				)

				return {
					...tier,
					transportType: tier.transportType || transport.name,
					transportImage: tier.transportImage || transport.image,
				}
			})

			// Only update if we had to add images or transport types
			if (
				JSON.stringify(updatedTiers) !== JSON.stringify(tourData.pricingTiers)
			) {
				updateTourData({ pricingTiers: updatedTiers })
			}
		}
	}, [])

	// Reset the interaction flag when the component mounts
	useEffect(() => {
		setHasAttemptedNavigation(false)
	}, [])

	const handleRemoveTier = (index: number) => {
		const newTiers = (tourData.pricingTiers ?? []).filter((_, i) => i !== index)
		updateTourData({ pricingTiers: newTiers })
	}

	const handleTierChange = (
		index: number,
		field: string,
		value: string | number,
	) => {
		const newTiers = (tourData.pricingTiers ?? []).map((tier, i) => {
			if (i !== index) return tier

			let updatedTier = { ...tier }

			if (field === 'minSeats' || field === 'maxSeats') {
				// Update the seat capacity
				updatedTier = { ...updatedTier, [field]: Number(value) }

				// If both min and max seats are set, update the transport type and image
				if (field === 'maxSeats' && updatedTier.minSeats) {
					const transport = findTransportTypeByCapacity(
						updatedTier.minSeats,
						Number(value),
					)
					updatedTier.transportType = transport.name
					updatedTier.transportImage = transport.image
				} else if (field === 'minSeats' && updatedTier.maxSeats) {
					const transport = findTransportTypeByCapacity(
						Number(value),
						updatedTier.maxSeats,
					)
					updatedTier.transportType = transport.name
					updatedTier.transportImage = transport.image
				}
			} else if (field === 'pricePerDay' || field === 'totalPrice') {
				updatedTier = {
					...updatedTier,
					pricing: { ...updatedTier.pricing, [field]: Number(value) },
				}
			}

			return updatedTier
		})

		updateTourData({ pricingTiers: newTiers })
	}

	// Listen for navigation attempts from parent component
	useEffect(() => {
		const handleBeforeNavigate = () => {
			setHasAttemptedNavigation(true)
			return true
		}

		window.addEventListener('validatePricing', handleBeforeNavigate)
		return () => {
			window.removeEventListener('validatePricing', handleBeforeNavigate)
		}
	}, [])

	const hasTiers = tourData.pricingTiers && tourData.pricingTiers.length > 0
	const hasValidationErrors = !hasTiers

	// Find the description for each transport type
	const getTransportDescription = (transportName: string) => {
		const transport = transportTypes.find((t) => t.name === transportName)
		return transport?.description || ''
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="flex items-center text-xl font-bold">
					Tour Pricing <span className="ml-1 text-red-500">*</span>
				</h2>
				<p className="text-muted-foreground text-sm">
					Set pricing for each transport option.
				</p>
			</div>

			{/* Validation Error */}
			{hasValidationErrors && hasAttemptedNavigation && (
				<div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3">
					<p className="flex items-center text-sm text-red-500">
						<AlertCircle className="mr-2 h-4 w-4" />
						At least one pricing tier is required
					</p>
				</div>
			)}

			{/* Transport Types Column */}
			<div className="space-y-4">
				{(tourData.pricingTiers ?? []).map((tier, index) => {
					const description = getTransportDescription(tier.transportType)

					// Find transport image based on capacity if not already set
					const transportImage =
						tier.transportImage ||
						findTransportTypeByCapacity(tier.minSeats, tier.maxSeats).image ||
						'/placeholder.svg?height=100&width=100'

					return (
						<Card key={index} className="overflow-hidden">
							<CardContent className="p-0">
								<div className="flex flex-col md:flex-row">
									{/* Transport Image and Info - Left Column */}
									<div className="flex flex-col items-center justify-center bg-slate-50 p-4 text-center md:w-1/3">
										<div className="relative mb-2 h-24 w-24">
											<Image
												src={transportImage || '/placeholder.svg'}
												alt={tier.transportType}
												fill
												className="object-contain"
											/>
										</div>
										<h3 className="text-md font-bold text-slate-800">
											{tier.transportType}
										</h3>
										<p className="mt-1 text-xs text-slate-600">
											{tier.minSeats}-{tier.maxSeats} people
										</p>
										{description && (
											<p className="mt-2 text-xs italic text-slate-500">
												{description}
											</p>
										)}
									</div>

									{/* Pricing Fields - Right Column */}
									<div className="border-t border-slate-100 p-4 md:w-2/3 md:border-l md:border-t-0">
										<div className="mb-3 flex items-start justify-between">
											<h4 className="text-sm font-semibold text-slate-700">
												Pricing Details
											</h4>
											<button
												type="button"
												onClick={() => handleRemoveTier(index)}
												className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
											>
												<span className="sr-only">Remove</span>
												<Trash className="h-3 w-3" />
											</button>
										</div>

										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-2">
												<Label
													htmlFor={`minSeats-${index}`}
													className="text-xs font-medium"
												>
													Min Capacity
												</Label>
												<Input
													type="number"
													id={`minSeats-${index}`}
													value={tier.minSeats}
													onChange={(e) =>
														handleTierChange(index, 'minSeats', e.target.value)
													}
													className="h-8 text-sm"
													min="1"
												/>
											</div>

											<div className="space-y-2">
												<Label
													htmlFor={`maxSeats-${index}`}
													className="text-xs font-medium"
												>
													Max Capacity
												</Label>
												<Input
													type="number"
													id={`maxSeats-${index}`}
													value={tier.maxSeats}
													onChange={(e) =>
														handleTierChange(index, 'maxSeats', e.target.value)
													}
													className="h-8 text-sm"
													min={tier.minSeats}
												/>
											</div>
										</div>

										<div className="mt-4 space-y-2">
											<Label
												htmlFor={`totalPrice-${index}`}
												className="text-xs font-medium"
											>
												Total Price
											</Label>
											<div className="relative">
												<span className="absolute left-3 top-2">€</span>
												<Input
													type="number"
													id={`totalPrice-${index}`}
													value={tier.pricing.totalPrice}
													onChange={(e) =>
														handleTierChange(
															index,
															'totalPrice',
															e.target.value,
														)
													}
													className="h-8 pl-7 text-sm"
													min="0"
													step="0.01"
												/>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					)
				})}
			</div>
		</div>
	)
}
