// Affiliate commission tiers (by number of bookings). Edit here to change
// the rates shown on the page and used by the calculator.
export const TIERS = [
	{ rate: 10, from: 1, to: 10 },
	{ rate: 12, from: 11, to: 50 },
	{ rate: 15, from: 51, to: null },
] as const

export const rateFor = (bookings: number) =>
	[...TIERS].reverse().find((tier) => bookings >= tier.from)?.rate ?? TIERS[0].rate
