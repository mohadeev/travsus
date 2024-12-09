export const formatCurrency = (amount: number): string => {
	return new Intl.NumberFormat('es', {
		style: 'currency',
		currency: 'EUR',
	}).format(amount)
}
