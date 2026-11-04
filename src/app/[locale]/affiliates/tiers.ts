// Affiliate commission tiers (by number of bookings). Edit here to change
// the rates shown on the page and used by the calculator.
export const TIERS = [
	{ rate: 10, from: 1, to: 10 },
	{ rate: 12, from: 11, to: 50 },
	{ rate: 15, from: 51, to: null },
] as const

export const rateFor = (bookings: number) =>
	[...TIERS].reverse().find((tier) => bookings >= tier.from)?.rate ?? TIERS[0].rate

/** Booking value used in the examples and as the calculator's starting value (euros) */
export const EXAMPLE_BOOKING_VALUE = 500

/** Commission shown in the "New booking" examples: booking value × starting rate (€500 × 10% = €50) */
export const EXAMPLE_COMMISSION = (EXAMPLE_BOOKING_VALUE * TIERS[0].rate) / 100
