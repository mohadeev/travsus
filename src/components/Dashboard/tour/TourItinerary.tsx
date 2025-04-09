'use client'
import { Input } from '@/components/ui/input'
import Textarea from '@/shared/Textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Plus, Trash, AlertCircle } from 'lucide-react'

interface Day {
	name: string
	description: string
}

interface TourItineraryProps {
	tourData: {
		days?: Day[]
	}
	updateTourData: (data: Partial<TourItineraryProps['tourData']>) => void
}

export default function TourItinerary({
	tourData,
	updateTourData,
}: TourItineraryProps) {
	const handleAddDay = () => {
		const newDays = [
			...(tourData.days ?? []),
			{ name: `Day ${(tourData.days?.length ?? 0) + 1}`, description: '' },
		]
		updateTourData({ days: newDays })
	}

	const handleRemoveDay = (index: number) => {
		const newDays = (tourData.days ?? []).filter((_, i) => i !== index)
		updateTourData({ days: newDays })
	}

	const handleDayChange = (index: number, field: keyof Day, value: string) => {
		const newDays = (tourData.days ?? []).map((day, i) =>
			i === index ? { ...day, [field]: value } : day,
		)
		updateTourData({ days: newDays })
	}

	const hasDays = tourData.days && tourData.days.length > 0
	const hasEmptyDays =
		hasDays &&
		tourData.days.some((d) => !d.description || d.description.trim() === '')

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="flex items-center text-xl font-bold">
						Tour Itinerary <span className="ml-1 text-red-500">*</span>
					</h2>
					<p className="text-muted-foreground text-sm">
						Create a day-by-day schedule for your tour.
					</p>
				</div>
				<Button type="button" onClick={handleAddDay} variant="outline">
					<Plus className="mr-2 h-4 w-4" />
					Add Day
				</Button>
			</div>

			{!hasDays && (
				<div className="rounded-md border border-dashed border-red-300 bg-red-50 p-8 text-center">
					<AlertCircle className="mx-auto mb-2 h-6 w-6 text-red-500" />
					<p className="text-sm text-red-500">
						At least one day is required. Click the "Add Day" button to create
						your itinerary.
					</p>
				</div>
			)}

			{hasEmptyDays && (
				<div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3">
					<p className="flex items-center text-sm text-red-500">
						<AlertCircle className="mr-2 h-4 w-4" />
						All days must have a description
					</p>
				</div>
			)}

			{(tourData.days ?? []).map((day, index) => (
				<Card key={index}>
					<CardHeader className="flex flex-row items-center justify-between py-3">
						<Input
							type="text"
							value={day.name}
							onChange={(e) => handleDayChange(index, 'name', e.target.value)}
							className="border-0 p-0 text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
							placeholder={`Day ${index + 1}`}
						/>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => handleRemoveDay(index)}
							className="h-8 w-8 p-0"
						>
							<Trash className="h-4 w-4" />
						</Button>
					</CardHeader>
					<CardContent>
						<Textarea
							value={day.description}
							onChange={(e) =>
								handleDayChange(index, 'description', e.target.value)
							}
							className={`min-h-[120px] w-full ${!day.description ? 'border-red-300' : ''}`}
							placeholder="Describe the day's activities, sights, meals, and accommodations..."
							required
						/>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
