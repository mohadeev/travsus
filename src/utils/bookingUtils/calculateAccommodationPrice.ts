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

function calculateAccommodationPrice(
	guests: Record<AccommodationType, Record<BedType, number | GuestCount>>,
	pricing: Accommodation[],
	includeInTotal: boolean,
): LineItem {
	function calculateTotalPeople(data: any) {
		let totalPeople = 0

		for (const category in data) {
			for (const type in data[category]) {
				const { adult, child } = data[category][type]
				if (type === 'single') {
					// For single, each adult or child represents 1 person
					totalPeople += adult + child
				} else if (type === 'twin' || type === 'couple') {
					// For twin and couple, each adult or child represents 2 people
					totalPeople += 2 * (adult + child)
				}
			}
		}

		return totalPeople
	}

	function calculateTotalCost(data: any, pricing: any) {
		let totalCost = 0

		for (const category in data) {
			const categoryData = data[category]
			const pricingInfo = pricing.find((p: any) => p.name === category)
			if (!pricingInfo) continue

			for (const bedType in categoryData) {
				const bedData = categoryData[bedType]
				const bedPricing = pricingInfo.pricingTiers[0].bedOptions.find(
					(option: any) =>
						option.bedType.toUpperCase() === bedType.toUpperCase(),
				)

				if (bedPricing) {
					const numBeds = bedData.adult + bedData.child
					totalCost += numBeds * bedPricing.basePrice
				}
			}
		}

		return totalCost
	}

	const totalCost = calculateTotalCost(guests, pricing)
	const result = calculateTotalPeople(guests)

	return {
		description: 'accommodation',
		unitPrice: totalCost / result,
		totalPrice: totalCost,
		totalGuests: result,
		serviceQuantity: 1,
		includeInTotal,
		currency: 'EUR',
	}
}

export default calculateAccommodationPrice
