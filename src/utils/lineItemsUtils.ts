const filteredLineItems = (lineItems: any): any[] => {
	return lineItems.filter(({ includeInTotal }: any) => includeInTotal === true)
}

const lineItemsWithoutTax = (lineItems: any): any[] => {
	return lineItems.filter((item: any) => item.description !== 'tax')
}

const getTaxLineItem = (lineItems: any): LineItem => {
	return lineItems.find((item: any) => item.description === 'tax')
}

const totalAmountFiltredLineItems = (lineItems: any): number => {
	return filteredLineItems(lineItems).reduce((total: any, item: any) => {
		return total + item.totalPrice
	}, 0)
}
export {
	getTaxLineItem,
	lineItemsWithoutTax,
	filteredLineItems,
	totalAmountFiltredLineItems,
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
