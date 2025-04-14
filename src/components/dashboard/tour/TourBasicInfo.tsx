'use client'

import type React from 'react'

import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'

interface TourBasicInfoProps {
	tourData: {
		name?: string
		subtitle?: string
		lang?: string
		tags?: string[]
	}
	updateTourData: (data: Partial<TourBasicInfoProps['tourData']>) => void
}

export default function TourBasicInfo({
	tourData,
	updateTourData,
}: TourBasicInfoProps) {
	const [newTag, setNewTag] = useState('')

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		const { name, value } = e.target
		updateTourData({ [name]: value })
	}

	const handleAddTag = () => {
		if (!newTag.trim()) return

		const currentTags = tourData.tags || []
		// Check if tag already exists (case insensitive)
		if (
			!currentTags.some((tag) => tag.toLowerCase() === newTag.toLowerCase())
		) {
			updateTourData({ tags: [...currentTags, newTag.trim()] })
		}
		setNewTag('')
	}

	const handleRemoveTag = (tagToRemove: string) => {
		const updatedTags = (tourData.tags || []).filter(
			(tag) => tag !== tagToRemove,
		)
		updateTourData({ tags: updatedTags })
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleAddTag()
		}
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

				{/* Tags Section */}
				<div className="mt-4 space-y-2">
					<Label htmlFor="tags">Tags</Label>
					<p className="text-muted-foreground text-sm">
						Add tags to help categorize your tour and make it easier to find.
					</p>

					<div className="mb-3 flex flex-wrap gap-2">
						{(tourData.tags || []).map((tag, index) => (
							<Badge
								key={index}
								variant="secondary"
								className="px-3 py-1 text-sm"
							>
								{tag}
								<button
									type="button"
									onClick={() => handleRemoveTag(tag)}
									className="text-muted-foreground hover:text-foreground ml-2"
								>
									<X className="h-3 w-3" />
								</button>
							</Badge>
						))}
					</div>

					<div className="flex items-center space-x-2">
						<Input
							id="tags"
							value={newTag}
							onChange={(e) => setNewTag(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Add a tag (e.g., adventure, family-friendly)"
							className="w-full"
						/>
						<button
							type="button"
							onClick={handleAddTag}
							className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-black hover:bg-gray-50"
						>
							<Plus className="h-5 w-5" />
						</button>
					</div>
					<p className="text-muted-foreground mt-1 text-xs">
						Press Enter or click the plus button to add a tag
					</p>
				</div>
			</div>
		</div>
	)
}
