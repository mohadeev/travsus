import prisma from '@/lib/prisma'

type BedType = 'SINGLE' | 'TWIN' | 'COUPLE'

interface BedOption {
	bedType: BedType
	maxOccupancy: number
	basePrice: number
	currency: string
}

interface AccommodationPricingTier {
	name: string
	minSeats: number
	maxSeats: number
	bedOptions: BedOption[]
}

interface Accommodation {
	name: string
	description: string
	pricingTiers: AccommodationPricingTier[]
}

async function updateTourAccommodations(): Promise<void> {
	try {
		// Fetch all tours
		const tours = await prisma.tour.findMany()

		for (const tour of tours) {
			// Luxury prices
			const luxuryPrices: Record<BedType, number> = {
				TWIN: 100,
				SINGLE: 50,
				COUPLE: 100,
			}

			// Calculate standard prices (70% of luxury prices)
			const standardPrices: Record<BedType, number> = Object.fromEntries(
				Object.entries(luxuryPrices).map(([key, value]) => [
					key,
					Math.round(value * 0.7),
				]),
			) as Record<BedType, number>

			// Create accommodation options
			const accommodations: Accommodation[] = [
				{
					name: 'Luxury',
					description: 'Experience ultimate comfort and elegance',
					pricingTiers: [
						{
							name: 'Luxury',
							minSeats: 1,
							maxSeats: 4,
							bedOptions: Object.entries(luxuryPrices).map(
								([bedType, price]) => ({
									bedType: bedType as BedType,
									maxOccupancy: bedType === 'SINGLE' ? 1 : 2,
									basePrice: price,
									currency: 'EUR',
								}),
							),
						},
					],
				},
				{
					name: 'Standard',
					description: 'Comfortable and affordable accommodation',
					pricingTiers: [
						{
							name: 'Standard',
							minSeats: 1,
							maxSeats: 4,
							bedOptions: Object.entries(standardPrices).map(
								([bedType, price]) => ({
									bedType: bedType as BedType,
									maxOccupancy: bedType === 'SINGLE' ? 1 : 2,
									basePrice: price,
									currency: 'EUR',
								}),
							),
						},
					],
				},
			]

			// Update the tour with new accommodation information
			await prisma.tour.update({
				where: { id: tour.id },
				data: { accommodations: accommodations as any }, // Type assertion needed due to Prisma's typing
			})

			console.log(`Updated accommodations for tour: ${tour.name || tour.id}`)
		}

		console.log('All tours have been updated with accommodation information.')
	} catch (error) {
		console.error('Error updating tour accommodations:', error)
	} finally {
		await prisma.$disconnect()
	}
}

export default updateTourAccommodations
