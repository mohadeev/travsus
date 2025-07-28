'use client'

import type React from 'react'

import { Label } from '@/components/ui/label'
import Textarea from '@/shared/Textarea'

interface TourOverviewProps {
	tourData: {
		overview?: string
	}
	updateTourData: (data: Partial<TourOverviewProps['tourData']>) => void
}

export default function TourOverview({
	tourData,
	updateTourData,
}: TourOverviewProps) {
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		updateTourData({ overview: e.target.value })
	}

	const isOverviewValid = tourData.overview && tourData.overview.length >= 50

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label
					htmlFor="overview"
					className="flex items-center text-sm font-medium"
				>
					Tour Overview <span className="ml-1 text-red-500">*</span>
				</Label>
				<Textarea
					id="overview"
					value={tourData.overview ?? ''}
					onChange={handleChange}
					className={`h-64 w-full ${!isOverviewValid ? 'border-red-300' : ''}`}
					placeholder="Provide a detailed description of your tour. What makes it special? What can travelers expect?"
					required
				/>
				{!tourData.overview && (
					<p className="mt-1 text-sm text-red-500">Tour overview is required</p>
				)}
				{tourData.overview && tourData.overview.length < 50 && (
					<p className="mt-1 text-sm text-red-500">
						Overview should be at least 50 characters long
					</p>
				)}
			</div>
		</div>
	)
}
