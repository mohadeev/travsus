'use client'

import type React from 'react'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Trash, Star, AlertCircle } from 'lucide-react'

interface TourImage {
	public_id: string
	url: string
	alt?: string
	isFeatured?: boolean
}

interface TourImagesProps {
	tourData: {
		images?: TourImage[]
	}
	updateTourData: (data: Partial<TourImagesProps['tourData']>) => void
}

export default function TourImages({
	tourData,
	updateTourData,
}: TourImagesProps) {
	const [isUploading, setIsUploading] = useState(false)

	// This is a mock function - in a real app, you'd implement actual image upload
	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files || files.length === 0) return

		setIsUploading(true)

		try {
			// Mock upload - in a real app, you'd send these to your server or a service like Cloudinary
			const newImages: TourImage[] = Array.from(files).map((file, index) => ({
				public_id: `mock-${Date.now()}-${index}`,
				url: URL.createObjectURL(file),
				alt: file.name,
				isFeatured: (tourData.images?.length ?? 0) === 0 && index === 0, // First image is featured by default
			}))

			updateTourData({
				images: [...(tourData.images ?? []), ...newImages],
			})
		} catch (error) {
			console.error('Error uploading images:', error)
			alert('Failed to upload images. Please try again.')
		} finally {
			setIsUploading(false)
		}
	}

	const handleRemoveImage = (index: number) => {
		const updatedImages = (tourData.images ?? []).filter((_, i) => i !== index)
		updateTourData({ images: updatedImages })
	}

	const handleSetFeatured = (index: number) => {
		const updatedImages = (tourData.images ?? []).map((img, i) => ({
			...img,
			isFeatured: i === index,
		}))
		updateTourData({ images: updatedImages })
	}

	const handleAltChange = (index: number, alt: string) => {
		const updatedImages = (tourData.images ?? []).map((img, i) =>
			i === index ? { ...img, alt } : img,
		)
		updateTourData({ images: updatedImages })
	}

	const hasImages = tourData.images && tourData.images.length > 0

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="flex items-center text-xl font-bold">
						Tour Images <span className="ml-1 text-red-500">*</span>
					</h2>
					<p className="text-muted-foreground text-sm">
						Upload images to showcase your tour. The first image will be the
						featured image.
					</p>
				</div>
				<div className="relative">
					<Input
						id="image-upload"
						type="file"
						multiple
						accept="image/*"
						onChange={handleImageUpload}
						disabled={isUploading}
						className="absolute inset-0 cursor-pointer opacity-0"
					/>
					<Button variant="outline" disabled={isUploading}>
						<Upload className="mr-2 h-4 w-4" />
						{isUploading ? 'Uploading...' : 'Upload Images'}
					</Button>
				</div>
			</div>

			{!hasImages && (
				<div className="rounded-md border border-dashed border-red-300 bg-red-50 p-8 text-center">
					<AlertCircle className="mx-auto mb-2 h-6 w-6 text-red-500" />
					<p className="text-sm text-red-500">
						At least one image is required. Click the "Upload Images" button to
						add tour photos.
					</p>
				</div>
			)}

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{(tourData.images ?? []).map((image, index) => (
					<Card key={image.public_id} className="overflow-hidden">
						<div className="aspect-video relative">
							<img
								src={image.url || '/placeholder.svg'}
								alt={image.alt || `Tour image ${index + 1}`}
								className="h-full w-full object-cover"
							/>
							{image.isFeatured && (
								<div className="text-primary-foreground absolute left-2 top-2 flex items-center rounded-md bg-primary px-2 py-1 text-xs">
									<Star className="mr-1 h-3 w-3" />
									Featured
								</div>
							)}
						</div>
						<CardContent className="space-y-2 p-3">
							<Input
								value={image.alt || ''}
								onChange={(e) => handleAltChange(index, e.target.value)}
								placeholder="Image description"
								className="text-sm"
							/>
							<div className="flex items-center justify-between">
								{!image.isFeatured && (
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => handleSetFeatured(index)}
										className="h-8 text-xs"
									>
										<Star className="mr-1 h-3.5 w-3.5" />
										Set as Featured
									</Button>
								)}
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => handleRemoveImage(index)}
									className="text-destructive ml-auto h-8 text-xs"
								>
									<Trash className="mr-1 h-3.5 w-3.5" />
									Remove
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}
