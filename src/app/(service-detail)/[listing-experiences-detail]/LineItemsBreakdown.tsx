import { formatCurrency } from '@/utils/formatCurrency'
import React from 'react'

// Define the type for each line item
interface LineItem {
	description: string
	unitPrice: number
	totalPrice: number
	quantity: number
	totalGuests: number
	serviceQuantity: number
	includeInTotal: boolean
}

// Define props type
interface LineItemsBreakdownProps {
	lineItems: LineItem[]
}

const LineItemsBreakdown: React.FC<LineItemsBreakdownProps> = ({
	lineItems,
}) => {
	// Calculate the total amount for all line items

	const filteredLineItems = lineItems?.filter(
		({ includeInTotal }) => includeInTotal === true,
	)
	const totalAmount = filteredLineItems.reduce((total, item) => {
		return total + item.totalPrice
	}, 0)

	return (
		<div className="flex w-full justify-start">
			<div className="p-x-6 w-full rounded-lg">
				<h2 className="mb-6 text-2xl font-bold text-gray-800">
					Booking Breakdown
				</h2>
				{/* Table Header */}
				<div className="grid grid-cols-10 gap-4 border-b pb-3 font-semibold text-gray-600">
					<div className="col-span-4">Description</div>
					<div className="col-span-1 text-center">Qty</div>
					<div className="col-span-2 text-center">Unit</div>
					<div className="col-span-3 text-center">Total</div>
				</div>
				{filteredLineItems.map((item, index) => (
					<div
						key={index}
						className={`grid grid-cols-10 gap-4 py-3 text-gray-700 ${
							index !== filteredLineItems.length - 1 ? 'border-b' : ''
						}`}
					>
						<div className="col-span-4 capitalize">{item.description}</div>
						<div className="col-span-1 text-center">{item.totalGuests}</div>
						<div className="col-span-2 text-center">
							{formatCurrency(item.unitPrice)}
						</div>
						<div className="col-span-3 text-center">
							{formatCurrency(item.totalPrice)}
						</div>
					</div>
				))}

				{/* Grand Total */}
				<div className="mt-4 grid grid-cols-10 gap-4 border-t pt-4 font-bold text-gray-900">
					<div className="col-span-4">Grand Total</div>
					<div className="col-span-1"></div>
					<div className="col-span-2"></div>
					<div className="col-span-3 text-center">
						{formatCurrency(totalAmount)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default LineItemsBreakdown
