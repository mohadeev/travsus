'use client'

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

	return (
		<form className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="overview" className="text-sm font-medium">
					Tour Overview
				</Label>
				<Textarea
					id="overview"
					value={tourData.overview ?? ''}
					onChange={handleChange}
					className="h-64 w-full border-gray-200 bg-white/70 text-sm backdrop-blur-sm"
					required
				/>
			</div>
		</form>
	)
}
