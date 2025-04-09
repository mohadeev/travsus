'use client'

import type React from 'react'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { AlertCircle } from 'lucide-react'

interface TourPricingProps {
	tourData: {
		price?: string
	}
	updateTourData: (data: Partial<TourPricingProps['tourData']>) => void
}

export default function TourPricing({
	tourData,
	updateTourData,
}: TourPricingProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		updateTourData({ price: e.target.value })
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="flex items-center text-xl font-bold">
					Tour Pricing <span className="ml-1 text-red-500">*</span>
				</h2>
				<p className="text-muted-foreground text-sm">
					Set the price for your tour package.
				</p>
			</div>

			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="price" className="flex items-center">
						Base Price <span className="ml-1 text-red-500">*</span>
					</Label>
					<div className="relative">
						<span className="absolute left-3 top-2.5">$</span>
						<Input
							id="price"
							name="price"
							type="text"
							value={tourData.price ?? ''}
							onChange={handleChange}
							className={`pl-7 ${!tourData.price ? 'border-red-300' : ''}`}
							placeholder="e.g. 1299.99"
							required
						/>
					</div>
					{!tourData.price && (
						<p className="mt-1 flex items-center text-sm text-red-500">
							<AlertCircle className="mr-1 h-4 w-4" />
							Price is required
						</p>
					)}
				</div>
			</div>
		</div>
	)
}
