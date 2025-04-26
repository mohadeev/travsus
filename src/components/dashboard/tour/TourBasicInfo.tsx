'use client'

import type React from 'react'

import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
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
import {
	FormField,
	FormItem,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import type { TourFormValues } from '../tour-builder'

export default function TourBasicInfo() {
	const [newTag, setNewTag] = useState('')
	const { control, watch, setValue } = useFormContext<TourFormValues>()

	// Get current tags from form
	const tags = watch('tags') || []

	const handleAddTag = () => {
		if (!newTag.trim()) return

		// Check if tag already exists (case insensitive)
		if (!tags.some((tag) => tag.toLowerCase() === newTag.toLowerCase())) {
			setValue('tags', [...tags, newTag.trim()], { shouldValidate: true })
		}
		setNewTag('')
	}

	const handleRemoveTag = (tagToRemove: string) => {
		const updatedTags = tags.filter((tag) => tag !== tagToRemove)
		setValue('tags', updatedTags, { shouldValidate: true })
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
				{/* Tour Name Field */}
				<FormField
					control={control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<Label htmlFor="name" className="flex items-center">
								Tour Name <span className="ml-1 text-red-500">*</span>
							</Label>
							<FormControl>
								<Input id="name" placeholder="Enter tour name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Subtitle Field */}
				<FormField
					control={control}
					name="subtitle"
					render={({ field }) => (
						<FormItem>
							<Label htmlFor="subtitle">Subtitle</Label>
							<FormControl>
								<Input
									id="subtitle"
									placeholder="Enter a catchy subtitle"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Language Field */}
				<FormField
					control={control}
					name="lang"
					render={({ field }) => (
						<FormItem>
							<Label htmlFor="lang">Language</Label>
							<Select onValueChange={field.onChange} value={field.value}>
								<FormControl>
									<SelectTrigger id="lang">
										<SelectValue placeholder="Select language" />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="EN">English</SelectItem>
									<SelectItem value="ES">Spanish</SelectItem>
									<SelectItem value="FR">French</SelectItem>
									<SelectItem value="DE">German</SelectItem>
									<SelectItem value="IT">Italian</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Tags Section */}
				<div className="mt-4 space-y-2">
					<Label htmlFor="tags">Tags</Label>
					<p className="text-muted-foreground text-sm">
						Add tags to help categorize your tour and make it easier to find.
					</p>

					<div className="mb-3 flex flex-wrap gap-2">
						{tags.map((tag, index) => (
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
							// No required attribute
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
