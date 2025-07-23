'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TourBasicInfoProps {
	tourData: {
		name?: string
		subtitle?: string
		region?: { region?: string; country?: string }
		start?: { name?: string }
		end?: { name?: string }
		lang?: string
		tags?: string[]
		dateOfIncident?: string
	}
	updateTourData: (data: Partial<TourBasicInfoProps['tourData']>) => void
}

export default function TourBasicInfo({
	tourData,
	updateTourData,
}: TourBasicInfoProps) {
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target
		if (name === 'region' || name === 'country') {
			updateTourData({ region: { ...tourData.region, [name]: value } })
		} else if (name === 'start' || name === 'end') {
			updateTourData({ [name]: { name: value } })
		} else if (name === 'tags') {
			updateTourData({ tags: value.split(',').map((tag) => tag.trim()) })
		} else {
			updateTourData({ [name]: value })
		}
	}

	const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const tags = e.target.value.split(',').map((tag) => tag.trim())
		updateTourData({ tags })
	}

	return (
		<form className="space-y-4">
			<div>
				<label htmlFor="name" className="mb-2 block">
					Tour Name
				</label>
				<input
					type="text"
					id="name"
					name="name"
					value={tourData.name ?? ''}
					onChange={handleChange}
					className="w-full rounded border px-3 py-2"
					required
				/>
			</div>
			<div>
				<label htmlFor="subtitle" className="mb-2 block">
					Subtitle
				</label>
				<input
					type="text"
					id="subtitle"
					name="subtitle"
					value={tourData.subtitle ?? ''}
					onChange={handleChange}
					className="w-full rounded border px-3 py-2"
					required
				/>
			</div>
			<div className="flex space-x-4">
				<div className="flex-1">
					<label htmlFor="region" className="mb-2 block">
						Region
					</label>
					<input
						type="text"
						id="region"
						name="region"
						value={tourData.region?.region ?? ''}
						onChange={handleChange}
						className="w-full rounded border px-3 py-2"
						required
					/>
				</div>
				<div className="flex-1">
					<label htmlFor="country" className="mb-2 block">
						Country
					</label>
					<input
						type="text"
						id="country"
						name="country"
						value={tourData.region?.country ?? ''}
						onChange={handleChange}
						className="w-full rounded border px-3 py-2"
						required
					/>
				</div>
			</div>
			<div className="flex space-x-4">
				<div className="flex-1">
					<label htmlFor="start" className="mb-2 block">
						Start Location
					</label>
					<input
						type="text"
						id="start"
						name="start"
						value={tourData.start?.name ?? ''}
						onChange={handleChange}
						className="w-full rounded border px-3 py-2"
						required
					/>
				</div>
				<div className="flex-1">
					<label htmlFor="end" className="mb-2 block">
						End Location
					</label>
					<input
						type="text"
						id="end"
						name="end"
						value={tourData.end?.name ?? ''}
						onChange={handleChange}
						className="w-full rounded border px-3 py-2"
						required
					/>
				</div>
			</div>
			<div className="space-y-2">
				<Label htmlFor="dateOfIncident" className="text-sm font-medium">
					Date of Incident
				</Label>
				<Input
					type="date"
					id="dateOfIncident"
					name="dateOfIncident"
					value={tourData.dateOfIncident ?? ''}
					onChange={handleChange}
					className="w-full border-gray-200 bg-white/70 text-sm backdrop-blur-sm"
				/>
			</div>
			<div>
				<label htmlFor="lang" className="mb-2 block">
					Language
				</label>
				<select
					id="lang"
					name="lang"
					value={tourData.lang ?? 'EN'}
					onChange={handleChange}
					className="w-full rounded border px-3 py-2"
					required
				>
					<option value="EN">English</option>
					<option value="ES">Spanish</option>
					<option value="FR">French</option>
				</select>
			</div>
			<div>
				<label htmlFor="tags" className="mb-2 block">
					Tags (comma-separated)
				</label>
				<input
					type="text"
					id="tags"
					name="tags"
					value={tourData.tags?.join(', ') ?? ''}
					onChange={handleTagsChange}
					className="w-full rounded border px-3 py-2"
				/>
			</div>
		</form>
	)
}
