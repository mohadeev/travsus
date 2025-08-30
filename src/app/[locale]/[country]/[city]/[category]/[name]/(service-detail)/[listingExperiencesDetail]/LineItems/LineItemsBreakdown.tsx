import { formatCurrency } from '@/utils/formatCurrency'
import type React from 'react'
import { useTranslations } from '@/lib/i18n'

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
	const t = useTranslations('RenderLineItemsBreakdown')

	// Calculate the total amount for all line items
	const filteredLineItems = lineItems?.filter(
		({ includeInTotal }) => includeInTotal === true,
	)
	const totalAmount = filteredLineItems.reduce((total, item) => {
		return total + item.totalPrice
	}, 0)

	return (
		<div className="w-full">
			{/* Line Items - No heading, no borders, just description and price */}
			<div className="space-y-2">
				{filteredLineItems.map((item, index) => (
					<div key={index} className="flex justify-between py-1">
						<div className="capitalize">{t(item.description)}</div>
						<div>{formatCurrency(item.totalPrice)}</div>
					</div>
				))}
			</div>

			{/* Separator line before total */}
			<div className="my-3 h-px w-full bg-gray-200"></div>

			{/* Grand Total */}
			<div className="flex justify-between py-1 font-bold">
				<div>{t('RenderLineItemsBreakdown_Grand_Total')}</div>
				<div>{formatCurrency(totalAmount)}</div>
			</div>
		</div>
	)
}

export default LineItemsBreakdown
