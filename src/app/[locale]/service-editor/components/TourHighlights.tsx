'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TourHighlightsProps {
	tourData: {
		highlights?: { name: string }[]
	}
	updateTourData: (data: Partial<TourHighlightsProps['tourData']>) => void
}

export default function TourHighlights({
	tourData,
	updateTourData,
}: TourHighlightsProps) {
	const handleAddHighlight = () => {
		const newHighlights = [...(tourData.highlights ?? []), { name: '' }]
		updateTourData({ highlights: newHighlights })
	}

	const handleRemoveHighlight = (index: number) => {
		const newHighlights = (tourData.highlights ?? []).filter(
			(_, i) => i !== index,
		)
		updateTourData({ highlights: newHighlights })
	}

	const handleHighlightChange = (index: number, value: string) => {
		const newHighlights = (tourData.highlights ?? []).map((highlight, i) =>
			i === index ? { ...highlight, name: value } : highlight,
		)
		updateTourData({ highlights: newHighlights })
	}

	return (
		<form className="space-y-4">
			<h2 className="text-xl font-bold">Tour Highlights</h2>
			{(tourData.highlights ?? []).map((highlight, index) => (
				<div key={index} className="space-y-2">
					<Label htmlFor={`highlight-${index}`} className="text-sm font-medium">
						Highlight {index + 1}
					</Label>
					<div className="flex items-center space-x-2">
						<Input
							type="text"
							id={`highlight-${index}`}
							value={highlight.name}
							onChange={(e) => handleHighlightChange(index, e.target.value)}
							className="flex-grow border-gray-200 bg-white/70 text-sm backdrop-blur-sm"
							placeholder="Enter highlight"
							required
						/>
						<Button
							type="button"
							onClick={() => handleRemoveHighlight(index)}
							variant="destructive"
							size="sm"
						>
							Remove
						</Button>
					</div>
				</div>
			))}
			<Button
				type="button"
				onClick={handleAddHighlight}
				variant="secondary"
				className="mt-4"
			>
				Add Highlight
			</Button>
		</form>
	)
}
