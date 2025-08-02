'use client'

import type React from 'react'
import { useTranslations } from 'use-intl'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Textarea from '@/shared/Textarea'
import { Plus, Trash } from 'lucide-react'

interface TourOverviewHighlightsProps {
	tourData: {
		overview?: string
		highlights?: { name: string }[]
	}
	updateTourData: (
		data: Partial<TourOverviewHighlightsProps['tourData']>,
	) => void
}

export default function TourOverviewHighlights({
	tourData,
	updateTourData,
}: TourOverviewHighlightsProps) {
	const t = useTranslations("dashboard_tour_TourOverviewHighlights")
	const [newHighlight, setNewHighlight] = useState('')

	// Overview handlers
	const handleOverviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		updateTourData({ overview: e.target.value })
	}

	// Highlights handlers
	const handleAddHighlight = () => {
		if (!newHighlight.trim()) {
			return
		}

		const newHighlights = [
			...(tourData.highlights ?? []),
			{ name: newHighlight },
		]
		updateTourData({ highlights: newHighlights })
		setNewHighlight('')
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
		<div className="space-y-8">
			{/* Overview Section */}
			<div className="space-y-4">
				<h2 className="text-xl font-bold">
					{t('dashboard_tour_TourOverviewHighlights_Tour_Overview')}
				</h2>
				<div className="space-y-2">
					<Label
						htmlFor="overview"
						className="flex items-center text-sm font-medium"
					>
						{t('dashboard_tour_TourOverviewHighlights_Tour_Overview')}
					</Label>
					<Textarea
						id="overview"
						value={tourData.overview ?? ''}
						onChange={handleOverviewChange}
						className="h-64 w-full"
						placeholder={t(
							'dashboard_tour_TourOverviewHighlights_Provide_A_Detailed_Description',
						)}
					/>
				</div>
			</div>

			{/* Highlights Section */}
			<div className="space-y-4">
				<h2 className="text-xl font-bold">
					{t('dashboard_tour_TourOverviewHighlights_Tour_Highlights')}
				</h2>
				<p className="text-muted-foreground text-sm">
					{t('dashboard_tour_TourOverviewHighlights_Add_Key_Highlights')}
				</p>

				{/* Existing highlights */}
				<div className="space-y-3">
					{(tourData.highlights ?? []).map((highlight, index) => (
						<div key={index} className="flex items-center space-x-2">
							<div className="flex-grow">
								<Label
									htmlFor={`highlight-${index}`}
									className="mb-1 block text-sm font-medium"
								>
									{t('dashboard_tour_TourOverviewHighlights_Highlight')}{' '}
									{index + 1}
								</Label>
								<Input
									type="text"
									id={`highlight-${index}`}
									value={highlight.name}
									onChange={(e) => handleHighlightChange(index, e.target.value)}
									className="w-full"
									placeholder={t(
										'dashboard_tour_TourOverviewHighlights_Enter_Highlight',
									)}
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
							onChange={(e) => setNewHighlight(e.target.value)}
							placeholder={t(
								'dashboard_tour_TourOverviewHighlights_Enter_New_Highlight',
							)}
							className="w-full"
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault()
									handleAddHighlight()
								}
							}}
						/>
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
		</div>
	)
}
