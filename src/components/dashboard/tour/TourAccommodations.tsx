'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
	AlertCircle,
	Trash,
	PlusCircle,
	Hotel,
	Star,
	Edit,
	Plus,
	Building,
} from 'lucide-react'

// Define the bed types
const BED_TYPES = [
	{ value: 'SINGLE', label: 'Single Bed', maxOccupancy: 1 },
	{ value: 'TWIN', label: 'Twin Beds', maxOccupancy: 2 },
	{ value: 'DOUBLE', label: 'Double Bed', maxOccupancy: 2 },
	{ value: 'QUEEN', label: 'Queen Bed', maxOccupancy: 2 },
	{ value: 'KING', label: 'King Bed', maxOccupancy: 2 },
	{ value: 'COUPLE', label: 'Couple', maxOccupancy: 2 },
	{ value: 'BUNK', label: 'Bunk Bed', maxOccupancy: 2 },
]

// Define the interfaces for the new data structure
interface BedOption {
	bedType: string
	maxOccupancy: number
	basePrice: number
	currency: string
}

interface PricingTier {
	name: string
	minSeats: number
	maxSeats: number
	bedOptions: BedOption[]
}

interface Accommodation {
	name: string
	description: string
	pricingTiers: PricingTier[]
}

interface TourAccommodationsProps {
	tourData: any
	updateTourData: (data: any) => void
}

export default function TourAccommodations({
	tourData,
	updateTourData,
}: TourAccommodationsProps) {
	// Initialize with default accommodations if none exist
	const defaultAccommodations: Accommodation[] = [
		{
			name: 'Luxury',
			description: 'Experience ultimate comfort and elegance',
			pricingTiers: [
				{
					name: 'Luxury',
					minSeats: 1,
					maxSeats: 4,
					bedOptions: [
						{
							bedType: 'TWIN',
							maxOccupancy: 2,
							basePrice: 100,
							currency: 'EUR',
						},
						{
							bedType: 'SINGLE',
							maxOccupancy: 1,
							basePrice: 50,
							currency: 'EUR',
						},
						{
							bedType: 'COUPLE',
							maxOccupancy: 2,
							basePrice: 100,
							currency: 'EUR',
						},
					],
				},
			],
		},
		{
			name: 'Standard',
			description: 'Comfortable and affordable accommodation',
			pricingTiers: [
				{
					name: 'Standard',
					minSeats: 1,
					maxSeats: 4,
					bedOptions: [
						{
							bedType: 'TWIN',
							maxOccupancy: 2,
							basePrice: 70,
							currency: 'EUR',
						},
						{
							bedType: 'SINGLE',
							maxOccupancy: 1,
							basePrice: 35,
							currency: 'EUR',
						},
						{
							bedType: 'COUPLE',
							maxOccupancy: 2,
							basePrice: 70,
							currency: 'EUR',
						},
					],
				},
			],
		},
	]

	const [accommodations, setAccommodations] = useState<Accommodation[]>(
		tourData.accommodations && tourData.accommodations.length > 0
			? tourData.accommodations
			: [],
	)
	const [hasAttemptedNavigation, setHasAttemptedNavigation] = useState(false)
	const [editingBedOption, setEditingBedOption] = useState<{
		accIndex: number
		tierIndex: number
		optionIndex: number
	} | null>(null)

	// Initialize with default accommodations if none exist
	useEffect(() => {
		if (!tourData.accommodations || tourData.accommodations.length === 0) {
			setAccommodations(defaultAccommodations)
			updateTourData({ accommodations: defaultAccommodations })
		}
	}, [])

	// Reset the interaction flag when the component mounts
	useEffect(() => {
		setHasAttemptedNavigation(false)
	}, [])

	// Listen for navigation attempts from parent component
	useEffect(() => {
		const handleBeforeNavigate = () => {
			setHasAttemptedNavigation(true)
			return true
		}

		window.addEventListener('validateAccommodations', handleBeforeNavigate)
		return () => {
			window.removeEventListener('validateAccommodations', handleBeforeNavigate)
		}
	}, [])

	const addAccommodation = () => {
		const newAccommodation: Accommodation = {
			name: 'New Accommodation',
			description: 'Description of the accommodation',
			pricingTiers: [
				{
					name: 'Standard',
					minSeats: 1,
					maxSeats: 4,
					bedOptions: [
						{
							bedType: 'TWIN',
							maxOccupancy: 2,
							basePrice: 70,
							currency: 'EUR',
						},
						{
							bedType: 'SINGLE',
							maxOccupancy: 1,
							basePrice: 35,
							currency: 'EUR',
						},
					],
				},
			],
		}

		const updatedAccommodations = [...accommodations, newAccommodation]
		setAccommodations(updatedAccommodations)
		updateTourData({ accommodations: updatedAccommodations })
	}

	const removeAccommodation = (index: number) => {
		const updatedAccommodations = accommodations.filter((_, i) => i !== index)
		setAccommodations(updatedAccommodations)
		updateTourData({ accommodations: updatedAccommodations })
	}

	const updateAccommodation = (index: number, data: Partial<Accommodation>) => {
		const updatedAccommodations = accommodations.map((acc, i) => {
			if (i === index) {
				return { ...acc, ...data }
			}
			return acc
		})

		setAccommodations(updatedAccommodations)
		updateTourData({ accommodations: updatedAccommodations })
	}

	const updatePricingTier = (
		accIndex: number,
		tierIndex: number,
		data: Partial<PricingTier>,
	) => {
		const updatedAccommodations = [...accommodations]
		updatedAccommodations[accIndex].pricingTiers[tierIndex] = {
			...updatedAccommodations[accIndex].pricingTiers[tierIndex],
			...data,
		}

		setAccommodations(updatedAccommodations)
		updateTourData({ accommodations: updatedAccommodations })
	}

	const updateBedOption = (
		accIndex: number,
		tierIndex: number,
		optionIndex: number,
		data: Partial<BedOption>,
	) => {
		const updatedAccommodations = [...accommodations]
		updatedAccommodations[accIndex].pricingTiers[tierIndex].bedOptions[
			optionIndex
		] = {
			...updatedAccommodations[accIndex].pricingTiers[tierIndex].bedOptions[
				optionIndex
			],
			...data,
		}

		setAccommodations(updatedAccommodations)
		updateTourData({ accommodations: updatedAccommodations })
	}

	const addBedOption = (accIndex: number, tierIndex: number) => {
		const updatedAccommodations = [...accommodations]

		// Find a bed type that's not already in use
		const existingBedTypes = updatedAccommodations[accIndex].pricingTiers[
			tierIndex
		].bedOptions.map((opt) => opt.bedType)
		const availableBedType = BED_TYPES.find(
			(type) => !existingBedTypes.includes(type.value),
		)

		const newBedOption: BedOption = {
			bedType: availableBedType ? availableBedType.value : 'SINGLE',
			maxOccupancy: availableBedType ? availableBedType.maxOccupancy : 1,
			basePrice: 50,
			currency: 'EUR',
		}

		updatedAccommodations[accIndex].pricingTiers[tierIndex].bedOptions.push(
			newBedOption,
		)

		setAccommodations(updatedAccommodations)
		updateTourData({ accommodations: updatedAccommodations })
	}

	const removeBedOption = (
		accIndex: number,
		tierIndex: number,
		optionIndex: number,
	) => {
		const updatedAccommodations = [...accommodations]
		updatedAccommodations[accIndex].pricingTiers[tierIndex].bedOptions.splice(
			optionIndex,
			1,
		)

		setAccommodations(updatedAccommodations)
		updateTourData({ accommodations: updatedAccommodations })
	}

	const getBedTypeLabel = (bedType: string) => {
		return BED_TYPES.find((type) => type.value === bedType)?.label || bedType
	}

	const hasAccommodations = accommodations && accommodations.length > 0
	const hasValidationErrors = !hasAccommodations

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="flex items-center text-xl font-bold">
						Accommodations <span className="ml-1 text-red-500">*</span>
					</h2>
					<p className="text-muted-foreground text-sm">
						Add accommodation options and pricing for your tour.
					</p>
				</div>
				<Button onClick={addAccommodation}>
					<PlusCircle className="mr-2 h-4 w-4" />
					Add Accommodation
				</Button>
			</div>

			{/* Validation Error */}
			{hasValidationErrors && hasAttemptedNavigation && (
				<div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3">
					<p className="flex items-center text-sm text-red-500">
						<AlertCircle className="mr-2 h-4 w-4" />
						At least one accommodation is required
					</p>
				</div>
			)}

			{accommodations.length === 0 ? (
				<div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
					<Hotel className="text-muted-foreground h-10 w-10" />
					<h3 className="mt-4 text-lg font-semibold">
						No accommodations added
					</h3>
					<p className="text-muted-foreground mt-2 text-sm">
						Add accommodations to your tour to provide options for where guests
						will stay.
					</p>
					<Button onClick={addAccommodation} className="mt-4">
						<PlusCircle className="mr-2 h-4 w-4" />
						Add Accommodation
					</Button>
				</div>
			) : (
				<div className="space-y-6">
					{accommodations.map((accommodation, accIndex) => (
						<Card key={accIndex} className="overflow-hidden">
							<CardContent className="p-0">
								{/* Accommodation Header */}
								<div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
									<div className="flex items-center">
										<Building className="mr-3 h-6 w-6 text-slate-700" />
										<div>
											<h3 className="text-lg font-bold text-slate-800">
												{accommodation.name}
											</h3>
											<p className="text-sm text-slate-600">
												{accommodation.description}
											</p>
										</div>
									</div>
									<div className="text-sm font-medium text-slate-700">
										{accommodation.pricingTiers[0] && (
											<span>
												Capacity: {accommodation.pricingTiers[0].minSeats}-
												{accommodation.pricingTiers[0].maxSeats} people
											</span>
										)}
									</div>
								</div>

								{/* Accommodation Details */}
								<div className="p-5">
									<div className="mb-4 flex items-center justify-between">
										<h4 className="text-base font-semibold text-slate-700">
											{accommodation.name} Details
										</h4>
										<button
											type="button"
											onClick={() => removeAccommodation(accIndex)}
											className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
										>
											<span className="sr-only">Remove</span>
											<Trash className="h-3 w-3" />
										</button>
									</div>

									<div className="mb-5 grid grid-cols-2 gap-5">
										<div>
											<Label
												htmlFor={`acc-name-${accIndex}`}
												className="mb-1.5 block text-sm font-medium"
											>
												Accommodation Name
											</Label>
											<Input
												id={`acc-name-${accIndex}`}
												value={accommodation.name}
												onChange={(e) =>
													updateAccommodation(accIndex, {
														name: e.target.value,
													})
												}
												className="h-9"
											/>
										</div>
										<div>
											<Label
												htmlFor={`acc-desc-${accIndex}`}
												className="mb-1.5 block text-sm font-medium"
											>
												Description
											</Label>
											<Input
												id={`acc-desc-${accIndex}`}
												value={accommodation.description}
												onChange={(e) =>
													updateAccommodation(accIndex, {
														description: e.target.value,
													})
												}
												className="h-9"
											/>
										</div>
									</div>

									{/* Pricing Tiers */}
									{accommodation.pricingTiers.map((tier, tierIndex) => (
										<div key={tierIndex} className="mt-6">
											<div className="mb-3 flex items-center">
												<Star className="mr-1.5 h-4 w-4 text-amber-500" />
												<h5 className="text-base font-semibold">
													Pricing Details
												</h5>
											</div>

											<div className="mb-5 grid grid-cols-3 gap-5">
												<div>
													<Label
														htmlFor={`tier-name-${accIndex}-${tierIndex}`}
														className="mb-1.5 block text-sm font-medium"
													>
														Tier Name
													</Label>
													<Input
														id={`tier-name-${accIndex}-${tierIndex}`}
														value={tier.name}
														onChange={(e) =>
															updatePricingTier(accIndex, tierIndex, {
																name: e.target.value,
															})
														}
														className="h-9"
													/>
												</div>
												<div>
													<Label
														htmlFor={`min-seats-${accIndex}-${tierIndex}`}
														className="mb-1.5 block text-sm font-medium"
													>
														Min Capacity
													</Label>
													<Input
														id={`min-seats-${accIndex}-${tierIndex}`}
														type="number"
														value={tier.minSeats}
														onChange={(e) =>
															updatePricingTier(accIndex, tierIndex, {
																minSeats: Number.parseInt(e.target.value),
															})
														}
														className="h-9"
														min="1"
													/>
												</div>
												<div>
													<Label
														htmlFor={`max-seats-${accIndex}-${tierIndex}`}
														className="mb-1.5 block text-sm font-medium"
													>
														Max Capacity
													</Label>
													<Input
														id={`max-seats-${accIndex}-${tierIndex}`}
														type="number"
														value={tier.maxSeats}
														onChange={(e) =>
															updatePricingTier(accIndex, tierIndex, {
																maxSeats: Number.parseInt(e.target.value),
															})
														}
														className="h-9"
														min={tier.minSeats}
													/>
												</div>
											</div>

											{/* Bed Options */}
											<div className="rounded-md bg-slate-50 p-4">
												<div className="mb-3 flex items-center justify-between">
													<h6 className="text-sm font-medium text-slate-700">
														Bed Options
													</h6>
													<Button
														variant="outline"
														size="sm"
														onClick={() => addBedOption(accIndex, tierIndex)}
														className="h-8 px-3 text-xs"
													>
														<Plus className="mr-1 h-3 w-3" />
														Add Bed Option
													</Button>
												</div>

												<div className="space-y-3">
													{tier.bedOptions.map((option, optionIndex) => (
														<div
															key={optionIndex}
															className="rounded border border-slate-200 bg-white p-3"
														>
															<div className="mb-2 flex items-center justify-between">
																<div className="flex items-center">
																	<span className="text-sm font-medium">
																		{getBedTypeLabel(option.bedType)}
																	</span>
																	<span className="ml-2 text-xs text-slate-500">
																		(Max: {option.maxOccupancy}{' '}
																		{option.maxOccupancy === 1
																			? 'person'
																			: 'people'}
																		)
																	</span>
																</div>
																<div className="flex items-center space-x-1">
																	<button
																		type="button"
																		onClick={() =>
																			setEditingBedOption({
																				accIndex,
																				tierIndex,
																				optionIndex,
																			})
																		}
																		className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
																	>
																		<Edit className="h-3 w-3" />
																		<span className="sr-only">Edit</span>
																	</button>
																	<button
																		type="button"
																		onClick={() =>
																			removeBedOption(
																				accIndex,
																				tierIndex,
																				optionIndex,
																			)
																		}
																		className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
																	>
																		<Trash className="h-3 w-3" />
																		<span className="sr-only">Remove</span>
																	</button>
																</div>
															</div>

															{editingBedOption &&
															editingBedOption.accIndex === accIndex &&
															editingBedOption.tierIndex === tierIndex &&
															editingBedOption.optionIndex === optionIndex ? (
																<div className="mt-2 grid grid-cols-3 gap-2">
																	<div>
																		<Label
																			htmlFor={`bed-type-${accIndex}-${tierIndex}-${optionIndex}`}
																			className="mb-1 block text-xs font-medium"
																		>
																			Bed Type
																		</Label>
																		<select
																			id={`bed-type-${accIndex}-${tierIndex}-${optionIndex}`}
																			value={option.bedType}
																			onChange={(e) =>
																				updateBedOption(
																					accIndex,
																					tierIndex,
																					optionIndex,
																					{
																						bedType: e.target.value,
																						maxOccupancy:
																							BED_TYPES.find(
																								(type) =>
																									type.value === e.target.value,
																							)?.maxOccupancy || 1,
																					},
																				)
																			}
																			className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
																		>
																			{BED_TYPES.map((type) => (
																				<option
																					key={type.value}
																					value={type.value}
																				>
																					{type.label}
																				</option>
																			))}
																		</select>
																	</div>
																	<div>
																		<Label
																			htmlFor={`base-price-${accIndex}-${tierIndex}-${optionIndex}`}
																			className="mb-1 block text-xs font-medium"
																		>
																			Base Price
																		</Label>
																		<div className="relative">
																			<span className="absolute left-3 top-2 text-sm">
																				€
																			</span>
																			<Input
																				id={`base-price-${accIndex}-${tierIndex}-${optionIndex}`}
																				type="number"
																				value={option.basePrice}
																				onChange={(e) =>
																					updateBedOption(
																						accIndex,
																						tierIndex,
																						optionIndex,
																						{
																							basePrice: Number.parseInt(
																								e.target.value,
																							),
																						},
																					)
																				}
																				className="h-9 pl-7 text-sm"
																				min="0"
																			/>
																		</div>
																	</div>
																	<div className="flex items-end">
																		<Button
																			size="sm"
																			onClick={() => setEditingBedOption(null)}
																			className="h-9 text-xs"
																		>
																			Save
																		</Button>
																	</div>
																</div>
															) : (
																<div className="text-sm">
																	<span className="font-medium">
																		€{option.basePrice}
																	</span>
																	<span className="ml-1 text-xs text-slate-500">
																		per night
																	</span>
																</div>
															)}
														</div>
													))}

													{tier.bedOptions.length === 0 && (
														<div className="py-3 text-center text-sm text-slate-500">
															No bed options added. Click "Add Bed Option" to
															add one.
														</div>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}
