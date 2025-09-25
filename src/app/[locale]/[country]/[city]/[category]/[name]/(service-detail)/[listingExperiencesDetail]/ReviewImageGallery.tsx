'use client'

import type React from 'react'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useTranslations } from '@/lib/i18n'

interface ReviewImageGalleryProps {
	images: string[]
}

const ReviewImageGallery: React.FC<ReviewImageGalleryProps> = ({ images }) => {
	const t = useTranslations(
		'newServicedetailListingExperiencesDetailReviewImageGallery',
	)
	const [selectedImage, setSelectedImage] = useState<string | null>(null)

	if (!images || images.length === 0) {
		return null
	}

	return (
		<>
			<div className="mt-3 flex flex-wrap gap-2">
				{images.map((img, idx) => (
					<div
						key={idx}
						className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-md"
						onClick={() => setSelectedImage(img)}
					>
						<Image
							src={img || '/placeholder.svg'}
							alt={t('Review_Photo_Alt')}
							width={120}
							height={120}
							className="h-full w-full object-cover transition-transform hover:scale-110"
						/>
					</div>
				))}
			</div>

			{/* Lightbox */}
			{selectedImage && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
					onClick={() => setSelectedImage(null)}
				>
					<div className="relative max-h-[90vh] w-full max-w-4xl">
						<button
							className="absolute right-2 top-2 rounded-full bg-black bg-opacity-50 p-2 text-white"
							onClick={(e) => {
								e.stopPropagation()
								setSelectedImage(null)
							}}
						>
							<X size={24} />
						</button>
						<Image
							src={selectedImage || '/placeholder.svg'}
							alt={t('Review_Photo_Alt')}
							width={1200}
							height={800}
							className="h-full w-full object-contain"
						/>
					</div>
				</div>
			)}
		</>
	)
}

export default ReviewImageGallery
