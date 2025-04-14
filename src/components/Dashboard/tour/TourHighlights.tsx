'use client'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Plus, Trash, AlertCircle } from 'lucide-react'

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
	const [newHighlight, setNewHighlight] = useState('')
	const [showEmptyError, setShowEmptyError] = useState(false)

	const handleAddHighlight = () => {
		if (!newHighlight.trim()) {
			setShowEmptyError(true)
			return
		}

		const newHighlights = [
			...(tourData.highlights ?? []),
			{ name: newHighlight },
		]
		updateTourData({ highlights: newHighlights })
		setNewHighlight('')
		setShowEmptyError(false)
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

	const hasHighlights =
		Array.isArray(tourData.highlights) && tourData.highlights.length > 0
	const hasEmptyHighlights =
		hasHighlights &&
		tourData.highlights.some((h) => !h.name || h.name.trim() === '')

	return (
		<div className="space-y-4">
			<h2 className="flex items-center text-xl font-bold">
				Tour Highlights <span className="ml-1 text-red-500">*</span>
			</h2>
			<p className="text-muted-foreground text-sm">
				Add key highlights or features that make your tour special. These will
				be prominently displayed to potential customers.
			</p>

			{!hasHighlights && (
				<div className="rounded-md border border-dashed border-red-300 bg-red-50 p-8 text-center">
					<AlertCircle className="mx-auto mb-2 h-6 w-6 text-red-500" />
					<p className="text-sm text-red-500">
						At least one highlight is required. Use the field below to add your
						first highlight.
					</p>
				</div>
			)}

			{hasHighlights && hasEmptyHighlights && (
				<div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3">
					<p className="flex items-center text-sm text-red-500">
						<AlertCircle className="mr-2 h-4 w-4" />
						All highlights must have a name
					</p>
				</div>
			)}

			{/* Existing highlights */}
			<div className="space-y-3">
				{(tourData.highlights ?? []).map((highlight, index) => (
					<div key={index} className="flex items-center space-x-2">
						<div className="flex-grow">
							<Label
								htmlFor={`highlight-${index}`}
								className="mb-1 block text-sm font-medium"
							>
								Highlight {index + 1}
							</Label>
							<Input
								type="text"
								id={`highlight-${index}`}
								value={highlight.name}
								onChange={(e) => handleHighlightChange(index, e.target.value)}
								className={`w-full ${!highlight.name ? 'border-red-300' : ''}`}
								placeholder="Enter highlight"
							/>
						</div>
						<button
							type="button"
							onClick={() => handleRemoveHighlight(index)}
							className="mt-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800"
						>
							<Trash className="h-4 w-4" />
						</button>
					</div>
				))}
			</div>

			{/* Add new highlight */}
			<div className="mt-6 flex items-center space-x-2">
				<div className="flex-grow">
					<Input
						type="text"
						value={newHighlight}
						onChange={(e) => {
							setNewHighlight(e.target.value)
							if (e.target.value.trim()) {
								setShowEmptyError(false)
							}
						}}
						placeholder="Enter new highlight"
						className={`w-full ${showEmptyError ? 'border-red-300' : ''}`}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault()
								handleAddHighlight()
							}
						}}
					/>
					{showEmptyError && (
						<p className="mt-1 text-sm text-red-500">
							Please enter a highlight before adding
						</p>
					)}
				</div>
				<button
					type="button"
					onClick={handleAddHighlight}
					className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-black hover:bg-gray-50"
				>
					<Plus className="h-5 w-5" />
				</button>
			</div>
		</div>
	)
}
