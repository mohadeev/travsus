'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Textarea from '@/shared/Textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

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
	tourData: {
		accommodations?: Accommodation[]
	}
	updateTourData: (data: Partial<TourAccommodationsProps['tourData']>) => void
}

export default function TourAccommodations({
	tourData,
	updateTourData,
}: TourAccommodationsProps) {
	const handleAddAccommodation = () => {
		const newAccommodations = [
			...(tourData.accommodations ?? []),
			{
				name: '',
				description: '',
				pricingTiers: [
					{
						name: 'Standard',
						minSeats: 1,
						maxSeats: 2,
						bedOptions: [
							{
								bedType: 'SINGLE',
								maxOccupancy: 1,
								basePrice: 0,
								currency: 'USD',
							},
						],
					},
				],
			},
		]
		updateTourData({ accommodations: newAccommodations })
	}

	const handleRemoveAccommodation = (index: number) => {
		const newAccommodations = (tourData.accommodations ?? []).filter(
			(_, i) => i !== index,
		)
		updateTourData({ accommodations: newAccommodations })
	}

	const handleAccommodationChange = (
		index: number,
		field: keyof Accommodation,
		value: string,
	) => {
		const newAccommodations = (tourData.accommodations ?? []).map((acc, i) =>
			i === index ? { ...acc, [field]: value } : acc,
		)
		updateTourData({ accommodations: newAccommodations })
	}

	const handleAddPricingTier = (accommodationIndex: number) => {
		const newAccommodations = (tourData.accommodations ?? []).map((acc, i) => {
			if (i !== accommodationIndex) return acc
			return {
				...acc,
				pricingTiers: [
					...acc.pricingTiers,
					{
						name: '',
						minSeats: 1,
						maxSeats: 2,
						bedOptions: [
							{
								bedType: 'SINGLE',
								maxOccupancy: 1,
								basePrice: 0,
								currency: 'USD',
							},
						],
					},
				],
			}
		})
		updateTourData({ accommodations: newAccommodations })
	}

	const handleRemovePricingTier = (
		accommodationIndex: number,
		tierIndex: number,
	) => {
		const newAccommodations = (tourData.accommodations ?? []).map((acc, i) => {
			if (i !== accommodationIndex) return acc
			return {
				...acc,
				pricingTiers: acc.pricingTiers.filter((_, j) => j !== tierIndex),
			}
		})
		updateTourData({ accommodations: newAccommodations })
	}

	const handlePricingTierChange = (
		accommodationIndex: number,
		tierIndex: number,
		field: keyof PricingTier,
		value: string | number,
	) => {
		const newAccommodations = (tourData.accommodations ?? []).map((acc, i) => {
			if (i !== accommodationIndex) return acc
			return {
				...acc,
				pricingTiers: acc.pricingTiers.map((tier, j) =>
					j === tierIndex
						? { ...tier, [field]: field === 'name' ? value : Number(value) }
						: tier,
				),
			}
		})
		updateTourData({ accommodations: newAccommodations })
	}

	const handleAddBedOption = (
		accommodationIndex: number,
		tierIndex: number,
	) => {
		const newAccommodations = (tourData.accommodations ?? []).map((acc, i) => {
			if (i !== accommodationIndex) return acc
			return {
				...acc,
				pricingTiers: acc.pricingTiers.map((tier, j) => {
					if (j !== tierIndex) return tier
					return {
						...tier,
						bedOptions: [
							...tier.bedOptions,
							{
								bedType: 'SINGLE',
								maxOccupancy: 1,
								basePrice: 0,
								currency: 'USD',
							},
						],
					}
				}),
			}
		})
		updateTourData({ accommodations: newAccommodations })
	}

	const handleRemoveBedOption = (
		accommodationIndex: number,
		tierIndex: number,
		optionIndex: number,
	) => {
		const newAccommodations = (tourData.accommodations ?? []).map((acc, i) => {
			if (i !== accommodationIndex) return acc
			return {
				...acc,
				pricingTiers: acc.pricingTiers.map((tier, j) => {
					if (j !== tierIndex) return tier
					return {
						...tier,
						bedOptions: tier.bedOptions.filter((_, k) => k !== optionIndex),
					}
				}),
			}
		})
		updateTourData({ accommodations: newAccommodations })
	}

	const handleBedOptionChange = (
		accommodationIndex: number,
		tierIndex: number,
		optionIndex: number,
		field: keyof BedOption,
		value: string | number,
	) => {
		const newAccommodations = (tourData.accommodations ?? []).map((acc, i) => {
			if (i !== accommodationIndex) return acc
			return {
				...acc,
				pricingTiers: acc.pricingTiers.map((tier, j) => {
					if (j !== tierIndex) return tier
					return {
						...tier,
						bedOptions: tier.bedOptions.map((option, k) =>
							k === optionIndex
								? {
										...option,
										[field]:
											field === 'bedType' || field === 'currency'
												? value
												: Number(value),
									}
								: option,
						),
					}
				}),
			}
		})
		updateTourData({ accommodations: newAccommodations })
	}

	return (
		<form className="space-y-8">
			<h2 className="mb-4 text-2xl font-bold">Tour Accommodations</h2>
			{(tourData.accommodations ?? []).map((accommodation, accIndex) => (
				<div key={accIndex} className="space-y-4 rounded-lg bg-gray-50 p-6">
					<div className="flex items-center justify-between">
						<Input
							type="text"
							value={accommodation.name}
							onChange={(e) =>
								handleAccommodationChange(accIndex, 'name', e.target.value)
							}
							className="border-b border-gray-300 bg-transparent text-xl font-semibold focus:border-black focus:outline-none"
							placeholder="Accommodation Name"
						/>
						<Button
							type="button"
							onClick={() => handleRemoveAccommodation(accIndex)}
							variant="destructive"
							size="sm"
						>
							Remove Accommodation
						</Button>
					</div>
					<Textarea
						value={accommodation.description}
						onChange={(e) =>
							handleAccommodationChange(accIndex, 'description', e.target.value)
						}
						className="h-24 w-full border-gray-200 bg-white/70 text-sm backdrop-blur-sm"
						placeholder="Accommodation Description"
					/>
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Pricing Tiers</h3>
						{accommodation.pricingTiers.map((tier, tierIndex) => (
							<div
								key={tierIndex}
								className="space-y-2 rounded-md bg-white p-4"
							>
								<div className="flex items-center justify-between">
									<Input
										type="text"
										value={tier.name}
										onChange={(e) =>
											handlePricingTierChange(
												accIndex,
												tierIndex,
												'name',
												e.target.value,
											)
										}
										className="border-b border-gray-300 bg-transparent text-lg font-medium focus:border-blue-500 focus:outline-none"
										placeholder="Tier Name"
									/>
									<Button
										type="button"
										onClick={() => handleRemovePricingTier(accIndex, tierIndex)}
										variant="destructive"
										size="sm"
									>
										Remove Tier
									</Button>
								</div>
								<div className="grid grid-cols-2 gap-2">
									<div>
										<Label htmlFor="minSeats">Min Seats</Label>
										<Input
											type="number"
											id="minSeats"
											value={tier.minSeats}
											onChange={(e) =>
												handlePricingTierChange(
													accIndex,
													tierIndex,
													'minSeats',
													e.target.value,
												)
											}
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
											min="1"
										/>
									</div>
									<div>
										<Label htmlFor="maxSeats">Max Seats</Label>
										<Input
											type="number"
											id="maxSeats"
											value={tier.maxSeats}
											onChange={(e) =>
												handlePricingTierChange(
													accIndex,
													tierIndex,
													'maxSeats',
													e.target.value,
												)
											}
											className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
											min="1"
										/>
									</div>
								</div>
								<div>
									<h4 className="text-md font-medium">Bed Options</h4>
									{tier.bedOptions.map((option, optionIndex) => (
										<div
											key={optionIndex}
											className="mt-2 grid grid-cols-4 gap-2"
										>
											<div>
												<Label htmlFor="bedType">Bed Type</Label>
												<Select
													value={option.bedType}
													onValueChange={(value) =>
														handleBedOptionChange(
															accIndex,
															tierIndex,
															optionIndex,
															'bedType',
															value,
														)
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select Bed Type" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="SINGLE">Single</SelectItem>
														<SelectItem value="DOUBLE">Double</SelectItem>
														<SelectItem value="TWIN">Twin</SelectItem>
														<SelectItem value="TRIPLE">Triple</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div>
												<Label htmlFor="maxOccupancy">Max Occupancy</Label>
												<Input
													type="number"
													id="maxOccupancy"
													value={option.maxOccupancy}
													onChange={(e) =>
														handleBedOptionChange(
															accIndex,
															tierIndex,
															optionIndex,
															'maxOccupancy',
															e.target.value,
														)
													}
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
													min="1"
												/>
											</div>
											<div>
												<Label htmlFor="basePrice">Base Price</Label>
												<Input
													type="number"
													id="basePrice"
													value={option.basePrice}
													onChange={(e) =>
														handleBedOptionChange(
															accIndex,
															tierIndex,
															optionIndex,
															'basePrice',
															e.target.value,
														)
													}
													className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
													min="0"
													step="0.01"
												/>
											</div>
											<div>
												<Label htmlFor="currency">Currency</Label>
												<Select
													value={option.currency}
													onValueChange={(value) =>
														handleBedOptionChange(
															accIndex,
															tierIndex,
															optionIndex,
															'currency',
															value,
														)
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select Currency" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="USD">USD</SelectItem>
														<SelectItem value="EUR">EUR</SelectItem>
														<SelectItem value="GBP">GBP</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<Button
												type="button"
												onClick={() =>
													handleRemoveBedOption(
														accIndex,
														tierIndex,
														optionIndex,
													)
												}
												variant="destructive"
												size="sm"
											>
												Remove Bed Option
											</Button>
										</div>
									))}
									<Button
										type="button"
										onClick={() => handleAddBedOption(accIndex, tierIndex)}
										variant="secondary"
										size="sm"
									>
										Add Bed Option
									</Button>
								</div>
							</div>
						))}
						<Button
							type="button"
							onClick={() => handleAddPricingTier(accIndex)}
							variant="secondary"
							size="sm"
						>
							Add Pricing Tier
						</Button>
					</div>
				</div>
			))}
			<Button
				type="button"
				onClick={handleAddAccommodation}
				variant="secondary"
				className="mt-4"
			>
				Add Accommodation
			</Button>
		</form>
	)
}
