'use client'

import type React from 'react'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, Star, Trash, Upload } from 'lucide-react'
import uploadAndSaveImage from '@/utils/clientUploadImage'

interface TourImage {
	url: string
	alt?: string
	featured?: boolean
	public_id?: string
}

interface TourImagesProps {
	tourData: {
		id?: string
		images?: TourImage[]
	}
	updateTourData: (data: Partial<TourImagesProps['tourData']>) => void
}

export default function TourImages({
	tourData,
	updateTourData,
}: TourImagesProps) {
	const [hasAttemptedNavigation, setHasAttemptedNavigation] = useState(false)
	const [uploadProgress, setUploadProgress] = useState(0)
	const [isUploading, setIsUploading] = useState(false)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	// Reset the interaction flag when the component mounts
	useEffect(() => {
		setHasAttemptedNavigation(false)
	}, [])

	// Listen for navigation attempts from parent component
	useEffect(() => {
		const handleBeforeNavigate = () => {
			setHasAttemptedNavigation(true)
			return true
		}

		window.addEventListener('validateImages', handleBeforeNavigate)
		return () => {
			window.removeEventListener('validateImages', handleBeforeNavigate)
		}
	}, [])

	const handleFileSelect = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const files = event.target.files
		if (!files || files.length === 0) return

		await uploadFiles(files)
	}

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsDragging(true)
	}

	const handleDragLeave = () => {
		setIsDragging(false)
	}

	const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsDragging(false)

		const files = event.dataTransfer.files
		if (!files || files.length === 0) return

		await uploadFiles(files)
	}

	const uploadFiles = async (files: FileList) => {
		if (!tourData.id) {
			setUploadError('Tour ID is required for uploading images')
			return
		}

		setIsUploading(true)
		setUploadError(null)

		try {
			for (let i = 0; i < files.length; i++) {
				const file = files[i]

				// Update progress
				setUploadProgress(Math.round((i / files.length) * 100))

				// Upload the image
				const result = await uploadAndSaveImage('tour', tourData.id, file)

				if (result) {
					// Add the new image to the tour data
					const newImage: TourImage = {
						url: result.url,
						public_id: result.public_id,
						alt: file.name,
						featured: (tourData.images?.length || 0) === 0, // Make first image featured
					}

					const updatedImages = [...(tourData.images || []), newImage]
					updateTourData({ images: updatedImages })
				}
			}

			// Complete the progress
			setUploadProgress(100)

			// Reset after a short delay
			setTimeout(() => {
				setUploadProgress(0)
				setIsUploading(false)
			}, 1000)
		} catch (error) {
			console.error('Error uploading images:', error)
			setUploadError('Failed to upload images. Please try again.')
			setIsUploading(false)
			setUploadProgress(0)
		}
	}

	const handleRemoveImage = (index: number) => {
		const updatedImages = [...(tourData.images || [])]

		// If removing the featured image, make the first remaining image featured
		const wasFeatureImage = updatedImages[index].featured
		updatedImages.splice(index, 1)

		if (wasFeatureImage && updatedImages.length > 0) {
			updatedImages[0].featured = true
		}

		updateTourData({ images: updatedImages })
	}

	const handleSetFeatured = (index: number) => {
		const updatedImages = (tourData.images || []).map((image, i) => ({
			...image,
			featured: i === index,
		}))

		updateTourData({ images: updatedImages })
	}

	const handleUpdateAlt = (index: number, alt: string) => {
		const updatedImages = [...(tourData.images || [])]
		updatedImages[index] = { ...updatedImages[index], alt }
		updateTourData({ images: updatedImages })
	}

	const triggerFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click()
		}
	}

	const hasImages = tourData.images && tourData.images.length > 0
	const hasValidationErrors = !hasImages

	return (
		<div className="space-y-6">
			<div>
				<h2 className="flex items-center text-xl font-bold">
					Tour Images <span className="ml-1 text-red-500">*</span>
				</h2>
				<p className="text-muted-foreground text-sm">
					Upload images for your tour. The first image will be used as the
					featured image.
				</p>
			</div>

			{/* Validation Error */}
			{hasValidationErrors && hasAttemptedNavigation && (
				<div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3">
					<p className="flex items-center text-sm text-red-500">
						<AlertCircle className="mr-2 h-4 w-4" />
						At least one image is required
					</p>
				</div>
			)}

			{/* Upload Area */}
			<div
				className={`relative mb-6 cursor-pointer rounded-lg border-2 border-dashed p-6 transition-all ${
					isDragging
						? 'border-blue-500 bg-blue-50'
						: 'border-gray-300 hover:border-gray-400'
				}`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				onClick={triggerFileInput}
			>
				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileSelect}
					className="hidden"
					accept="image/*"
					multiple
				/>

				<div className="flex flex-col items-center justify-center space-y-2 text-center">
					<Upload className="h-10 w-10 text-gray-400" />
					<h3 className="text-lg font-medium">
						Drag and drop or click to upload
					</h3>
					<p className="text-sm text-gray-500">
						Upload JPG, PNG or GIF images (max 5MB each)
					</p>

					{isUploading && (
						<div className="mt-4 w-full max-w-xs">
							<div className="mb-1 flex justify-between text-xs">
								<span>Uploading...</span>
								<span>{uploadProgress}%</span>
							</div>
							<div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
								<div
									className="h-full bg-blue-600 transition-all duration-300"
									style={{ width: `${uploadProgress}%` }}
								></div>
							</div>
						</div>
					)}

					{uploadError && (
						<p className="mt-2 text-sm text-red-500">{uploadError}</p>
					)}
				</div>
			</div>

			{/* Images Grid */}
			{hasImages ? (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{tourData.images?.map((image, index) => (
						<Card key={index} className="overflow-hidden shadow-md">
							<div className="relative">
								{/* Image */}
								<div className="relative h-48 w-full overflow-hidden bg-slate-100">
									<Image
										src={image.url || '/placeholder.svg'}
										alt={image.alt || `Tour image ${index + 1}`}
										width={400}
										height={200}
										className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
									/>
								</div>

								{/* Featured Badge */}
								{image.featured && (
									<div className="absolute left-2 top-2 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
										Featured
									</div>
								)}

								{/* Action Buttons */}
								<div className="absolute right-2 top-2 flex space-x-1">
									{/* Set as Featured Button */}
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation()
											handleSetFeatured(index)
										}}
										className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
										title={
											image.featured ? 'Featured Image' : 'Set as Featured'
										}
									>
										<Star
											className={`h-3 w-3 ${image.featured ? 'fill-amber-500 text-amber-500' : ''}`}
										/>
									</button>

									{/* Remove Button */}
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation()
											handleRemoveImage(index)
										}}
										className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
										title="Remove Image"
									>
										<Trash className="h-3 w-3" />
									</button>
								</div>
							</div>

							{/* Image Description */}
							<CardContent className="p-3">
								<Input
									type="text"
									value={image.alt || ''}
									onChange={(e) => handleUpdateAlt(index, e.target.value)}
									placeholder="Image description"
									className="h-8 text-sm"
									onClick={(e) => e.stopPropagation()}
								/>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
					<p className="text-gray-500">No images uploaded yet</p>
				</div>
			)}
		</div>
	)
}
