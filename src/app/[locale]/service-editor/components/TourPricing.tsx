'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface PricingTier {
	minSeats: number
	maxSeats: number
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
	const handleAddTier = () => {
		const newTiers = [
			...(tourData.pricingTiers ?? []),
			{
				minSeats: 1,
				maxSeats: 1,
				pricing: {
					pricePerDay: 0,
					totalPrice: 0,
					currency: 'USD',
				},
			},
		]
		updateTourData({ pricingTiers: newTiers })
	}

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
			if (field === 'minSeats' || field === 'maxSeats') {
				return { ...tier, [field]: Number(value) }
			} else if (field === 'pricePerDay' || field === 'totalPrice') {
				return {
					...tier,
					pricing: { ...tier.pricing, [field]: Number(value) },
				}
			} else if (field === 'currency') {
				return {
					...tier,
					pricing: { ...tier.pricing, currency: value as string },
				}
			}
			return tier
		})
		updateTourData({ pricingTiers: newTiers })
	}

	return (
		<form className="space-y-6">
			<h2 className="mb-4 text-2xl font-bold">Tour Pricing</h2>
			{(tourData.pricingTiers ?? []).map((tier, index) => (
				<div key={index} className="rounded-lg bg-gray-50 p-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label
								htmlFor={`minSeats-${index}`}
								className="text-sm font-medium"
							>
								Min Seats
							</Label>
							<Input
								type="number"
								id={`minSeats-${index}`}
								value={tier.minSeats}
								onChange={(e) =>
									handleTierChange(index, 'minSeats', e.target.value)
								}
								className="w-full border-gray-200 bg-white/70 text-sm backdrop-blur-sm"
								min="1"
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor={`maxSeats-${index}`}
								className="text-sm font-medium"
							>
								Max Seats
							</Label>
							<Input
								type="number"
								id={`maxSeats-${index}`}
								value={tier.maxSeats}
								onChange={(e) =>
									handleTierChange(index, 'maxSeats', e.target.value)
								}
								className="w-full border-gray-200 bg-white/70 text-sm backdrop-blur-sm"
								min="1"
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor={`pricePerDay-${index}`}
								className="text-sm font-medium"
							>
								Price Per Day
							</Label>
							<Input
								type="number"
								id={`pricePerDay-${index}`}
								value={tier.pricing.pricePerDay}
								onChange={(e) =>
									handleTierChange(index, 'pricePerDay', e.target.value)
								}
								className="w-full border-gray-200 bg-white/70 text-sm backdrop-blur-sm"
								min="0"
								step="0.01"
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor={`totalPrice-${index}`}
								className="text-sm font-medium"
							>
								Total Price
							</Label>
							<Input
								type="number"
								id={`totalPrice-${index}`}
								value={tier.pricing.totalPrice}
								onChange={(e) =>
									handleTierChange(index, 'totalPrice', e.target.value)
								}
								className="w-full border-gray-200 bg-white/70 text-sm backdrop-blur-sm"
								min="0"
								step="0.01"
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor={`currency-${index}`}
								className="text-sm font-medium"
							>
								Currency
							</Label>
							<Select
								value={tier.pricing.currency}
								onValueChange={(value) =>
									handleTierChange(index, 'currency', value)
								}
							>
								<SelectTrigger className="w-full border-gray-200 bg-white/70 text-sm backdrop-blur-sm">
									<SelectValue placeholder="Select currency" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="USD">USD</SelectItem>
									<SelectItem value="EUR">EUR</SelectItem>
									<SelectItem value="GBP">GBP</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<Button
						type="button"
						onClick={() => handleRemoveTier(index)}
						variant="destructive"
						size="sm"
						className="mt-2"
					>
						Remove Tier
					</Button>
				</div>
			))}
			<Button
				type="button"
				onClick={handleAddTier}
				variant="secondary"
				className="mt-4"
			>
				Add Pricing Tier
			</Button>
		</form>
	)
}
