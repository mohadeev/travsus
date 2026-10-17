// Travsus price list, the same for every tour in every city.
//
// Transport (price per vehicle, per day):
//   - 1 hour up to 1 day: 150 € a day, any vehicle
//   - 2 to 3 days:        170 € a day, any vehicle
//   - 4 days or more:     120 € a day for the 4x4 and the minivan, 150 € for the minibus
// Hotels (per person, per night): Standard 50 €, Luxury 90 €.
//
// Stored the way the booking price code reads it: a vehicle's totalPrice is for
// the whole trip, and a room's basePrice is for the whole stay.

export const STAY_PRICE_PER_NIGHT = { Standard: 50, Luxury: 90 } as const

export const VEHICLES = [
	{ name: 'SUV (prado)', image: 'https://res.cloudinary.com/travsus/image/upload/v1745698557/prado_nhgpvq.png', min: 1, max: 5 },
	{ name: 'Mercedes Vito', image: 'https://res.cloudinary.com/travsus/image/upload/v1745698557/vito_et5qqd.png', min: 6, max: 8 },
	{ name: 'Mini Bus', image: 'https://res.cloudinary.com/travsus/image/upload/v1745698557/mini-bus_gwoprr.png', min: 9, max: 19 },
] as const

/** Price of one vehicle for one day, for a trip of this many days. */
export function transportPerDay(vehicle: string, days: number) {
	const d = Math.max(1, Math.round(days))
	if (d <= 1) return 150
	if (d <= 3) return 170
	return vehicle === 'Mini Bus' ? 150 : 120
}

/** The vehicle price tiers of a trip of this many days. */
export function transportTiers(days: number) {
	const d = Math.max(1, Math.round(days))
	return VEHICLES.map((v) => {
		const perDay = transportPerDay(v.name, d)
		return {
			transportType: v.name,
			transportImage: v.image,
			minSeats: v.min,
			maxSeats: v.max,
			pricing: { currency: 'EUR', totalPrice: perDay * d, pricePerDay: perDay },
		}
	})
}

/** Standard and Luxury hotels for a trip with this many nights (none: no hotels). */
export function stayOptions(nights: number) {
	const n = Math.max(0, Math.round(nights))
	if (!n) return []
	const hotel = (name: 'Standard' | 'Luxury', description: string) => {
		const perPerson = STAY_PRICE_PER_NIGHT[name] * n
		return {
			name,
			description,
			pricingTiers: [
				{
					name,
					minSeats: 1,
					maxSeats: 4,
					bedOptions: [
						{ bedType: 'TWIN', maxOccupancy: 2, basePrice: perPerson * 2, currency: 'EUR' },
						{ bedType: 'SINGLE', maxOccupancy: 1, basePrice: perPerson, currency: 'EUR' },
						{ bedType: 'COUPLE', maxOccupancy: 2, basePrice: perPerson * 2, currency: 'EUR' },
					],
				},
			],
		}
	}
	return [hotel('Standard', 'Comfortable and affordable accommodation'), hotel('Luxury', 'Experience ultimate comfort and elegance')]
}

/** Does this tour have hotel nights to choose from? */
export function hasStays(accommodations: any[] | null | undefined) {
	return (accommodations ?? []).some((a) => a?.pricingTiers?.some((t: any) => t?.bedOptions?.length) || a?.bedOptions?.length)
}
