const totalAmount = (lineItems: any): number => {
	// Ensure lineItems is an array, defaulting to an empty array if it's undefined or null
	const filteredLineItems =
		lineItems?.filter(({ includeInTotal }: any) => includeInTotal === true) ||
		[]

	// If there are no valid items, return 0
	if (filteredLineItems.length === 0) {
		return 0
	}

	// Use reduce to calculate the total, ensuring a fallback to 0
	const totalAmount = filteredLineItems.reduce((total: number, item: any) => {
		// Safely add item.totalPrice or default to 0 if totalPrice is undefined
		return total + (item?.totalPrice || 0)
	}, 0)

	return totalAmount
}

export default totalAmount
