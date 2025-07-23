'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Textarea from '@/shared/Textarea'
import { Button } from '@/components/ui/button'

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

	return (
		<form className="space-y-6">
			<h2 className="mb-4 text-2xl font-bold">Tour Itinerary</h2>
			{(tourData.days ?? []).map((day, index) => (
				<div key={index} className="rounded-lg bg-gray-50 p-4">
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<Input
								type="text"
								value={day.name}
								onChange={(e) => handleDayChange(index, 'name', e.target.value)}
								className="border-b border-gray-300 bg-transparent text-lg font-semibold focus:border-black focus:outline-none"
								placeholder={`Day ${index + 1}`}
							/>
							<Button
								type="button"
								onClick={() => handleRemoveDay(index)}
								variant="destructive"
								size="sm"
							>
								Remove Day
							</Button>
						</div>
						<Textarea
							value={day.description}
							onChange={(e) =>
								handleDayChange(index, 'description', e.target.value)
							}
							className="h-32 w-full border-gray-200 bg-white/70 text-sm backdrop-blur-sm"
							placeholder="Describe the day's activities..."
						/>
					</div>
				</div>
			))}
			<Button
				type="button"
				onClick={handleAddDay}
				variant="secondary"
				className="mt-4"
			>
				Add Day
			</Button>
		</form>
	)
}
