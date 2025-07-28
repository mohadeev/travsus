import React from 'react'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Users, MapPin, Calendar } from 'lucide-react'

interface TourCardProps {
	tour: {
		id: string
		name: string
		subtitle: string
		images: { url: string }[]
		start: { date: string }
		end: { date: string }
		pricingTiers: {
			minSeats: number
			maxSeats: number
			pricing: {
				pricePerDay: number
				totalPrice: number
				currency: string
			}
		}[]
	}
	bookedSeats: number
}

export function TourCard({ tour, bookedSeats }: TourCardProps) {
	const firstPricingTier = tour.pricingTiers[0]
	const maxSeats = firstPricingTier.maxSeats || 10 // Default to 10 if maxSeats is not set
	const progress = (bookedSeats / maxSeats) * 100

	return (
		<Card className="w-full max-w-sm">
			<CardHeader className="p-0">
				<img
					src={tour.images[0]?.url || '/placeholder.svg?height=200&width=300'}
					alt={tour.name}
					className="h-48 w-full rounded-t-lg object-cover"
				/>
			</CardHeader>
			<CardContent className="p-4">
				<CardTitle className="mb-2 text-xl">{tour.name}</CardTitle>
				<p className="text-muted-foreground mb-4 text-sm">{tour.subtitle}</p>
				<div className="mb-2 flex items-center">
					<MapPin className="mr-2 h-4 w-4" />
					<span className="text-sm">Marrakech to Merzouga</span>
				</div>
				<div className="mb-4 flex items-center">
					<Calendar className="mr-2 h-4 w-4" />
					<span className="text-sm">
						{new Date(tour.start.date).toLocaleDateString()} -{' '}
						{new Date(tour.end.date).toLocaleDateString()}
					</span>
				</div>
				<div className="mb-4">
					<div className="mb-2 flex items-center justify-between">
						<span className="text-sm font-medium">Group Progress</span>
						<span className="text-sm font-medium">
							{bookedSeats}/{maxSeats}
						</span>
					</div>
					<Progress value={progress} className="w-full" />
				</div>
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-medium">Price per person</p>
						<p className="text-lg font-bold">
							{firstPricingTier.pricing.currency}{' '}
							{(firstPricingTier.pricing.totalPrice / maxSeats).toFixed(2)}
						</p>
					</div>
					<div className="flex items-center">
						<Users className="mr-1 h-5 w-5" />
						<span className="text-sm font-medium">{bookedSeats} joined</span>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button className="w-full">Join Group</Button>
			</CardFooter>
		</Card>
	)
}
