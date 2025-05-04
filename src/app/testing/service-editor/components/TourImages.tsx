'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface TourImage {
	public_id: string
	url: string
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

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files
		if (!files) return

		setIsUploading(true)
		const formData = new FormData()
		for (let i = 0; i < files.length; i++) {
			formData.append('file', files[i])
		}

		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			})

			if (response.ok) {
				const newImages = await response.json()
				updateTourData({ images: [...(tourData.images ?? []), ...newImages] })
			} else {
				throw new Error('Failed to upload images')
			}
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

	return (
		<div className="space-y-6">
			<h2 className="mb-4 text-2xl font-bold">Tour Images</h2>
			<div className="grid grid-cols-3 gap-4">
				{(tourData.images ?? []).map((image, index) => (
					<div key={image.public_id} className="relative">
						<Image
							src={image.url}
							alt={`Tour image ${index + 1}`}
							width={300}
							height={200}
							className="rounded-lg object-cover"
						/>
						<Button
							onClick={() => handleRemoveImage(index)}
							variant="destructive"
							size="icon"
							className="absolute right-2 top-2"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								/>
							</svg>
						</Button>
					</div>
				))}
			</div>
			<div className="space-y-2">
				<Label htmlFor="image-upload" className="text-sm font-medium">
					Upload Images
				</Label>
				<Input
					id="image-upload"
					type="file"
					multiple
					accept="image/*"
					onChange={handleImageUpload}
					disabled={isUploading}
					className="w-full border-gray-200 bg-white/70 text-sm backdrop-blur-sm"
				/>
			</div>
			{isUploading && <p>Uploading images...</p>}
		</div>
	)
}
