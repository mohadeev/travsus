export default function taxCalculator(amount: number, taxRate = 21) {
	return (amount * taxRate) / 100
}
