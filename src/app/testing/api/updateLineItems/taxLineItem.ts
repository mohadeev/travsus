import taxCalculator from './taxCalculator'

type BedType = 'SINGLE' | 'TWIN' | 'COUPLE'
type AccommodationType = 'Standard' | 'Luxury'

interface GuestCount {
	adult: number
	child: number
}

interface BedOption {
	bedType: BedType
	maxOccupancy: number
	basePrice: number
	currency: string
}

interface Accommodation {
	name: AccommodationType
	bedOptions: BedOption[]
}

interface LineItem {
	description: string
	unitPrice: number
	totalPrice: number
	totalGuests: number
	serviceQuantity: number
	includeInTotal: boolean
	currency: string
}

function taxLineItem(lineItems: any): LineItem {
	const filteredLineItems = lineItems?.filter(
		({ includeInTotal }: any) => includeInTotal === true,
	)
	const totalAmount = filteredLineItems.reduce((total: any, item: any) => {
		return total + item.totalPrice
	}, 0)
	const tax = taxCalculator(totalAmount)
	return {
		description: 'tax',
		unitPrice: tax,
		totalPrice: tax,
		totalGuests: 1,
		serviceQuantity: 1,
		includeInTotal: true,
		currency: 'EUR',
	}
}

export default taxLineItem
