import React from 'react'
import { TourCard } from './TourCard'

// This would typically come from your API
const mockTours = [
	{
		id: '1',
		name: 'Marrakech to Merzouga Adventure',
		subtitle: 'Experience the magic of the Sahara',
		images: [{ url: '/placeholder.svg?height=200&width=300' }],
		start: { date: '2023-07-01' },
		end: { date: '2023-07-07' },
		pricingTiers: [
			{
				minSeats: 5,
				maxSeats: 10,
				pricing: {
					pricePerDay: 100,
					totalPrice: 700,
					currency: 'USD',
				},
			},
		],
	},
	// Add more mock tours here...
]

export function GroupToursList() {
	return (
		<div className="container mx-auto py-8">
			<h1 className="mb-6 text-3xl font-bold">Hot Group Tours</h1>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{mockTours.map((tour) => (
					<TourCard
						key={tour.id}
						tour={tour}
						bookedSeats={Math.floor(Math.random() * 10) + 1}
					/>
				))}
			</div>
		</div>
	)
}
