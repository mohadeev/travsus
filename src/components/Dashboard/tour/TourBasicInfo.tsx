'use client'

import type React from 'react'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

interface TourBasicInfoProps {
	tourData: {
		name?: string
		subtitle?: string
		lang?: string
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
		updateTourData({ [name]: value })
	}

	return (
		<div className="space-y-6">
			<div className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="name" className="flex items-center">
						Tour Name <span className="ml-1 text-red-500">*</span>
					</Label>
					<Input
						id="name"
						name="name"
						value={tourData.name ?? ''}
						onChange={handleChange}
						placeholder="Enter tour name"
						className={`w-full ${!tourData.name ? 'border-red-300' : ''}`}
						required
					/>
					{!tourData.name && (
						<p className="mt-1 text-sm text-red-500">Tour name is required</p>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="subtitle">Subtitle</Label>
					<Input
						id="subtitle"
						name="subtitle"
						value={tourData.subtitle ?? ''}
						onChange={handleChange}
						placeholder="Enter a catchy subtitle"
						className="w-full"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="lang">Language</Label>
					<Select
						value={tourData.lang ?? 'EN'}
						onValueChange={(value) => updateTourData({ lang: value })}
					>
						<SelectTrigger id="lang">
							<SelectValue placeholder="Select language" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="EN">English</SelectItem>
							<SelectItem value="ES">Spanish</SelectItem>
							<SelectItem value="FR">French</SelectItem>
							<SelectItem value="DE">German</SelectItem>
							<SelectItem value="IT">Italian</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	)
}
