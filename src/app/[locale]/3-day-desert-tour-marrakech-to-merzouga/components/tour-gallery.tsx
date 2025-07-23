'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useLanguage } from './language-provider'

export default function TourGallery() {
	const { t } = useLanguage()
	const [selectedImage, setSelectedImage] = useState<number | null>(null)

	const galleryImages = [
		{
			src: 'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg',
			alt: 'Ait Ben Haddou ancient kasbah',
		},
		{
			src: 'https://images.pexels.com/photos/4344260/pexels-photo-4344260.jpeg',
			alt: 'Todra Gorge with high cliff walls',
		},
		{
			src: 'https://images.pexels.com/photos/1001435/pexels-photo-1001435.jpeg',
			alt: 'Camel caravan in Merzouga desert',
		},
		{
			src: 'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg',
			alt: 'Desert camp at sunset',
		},
		{
			src: 'https://images.pexels.com/photos/4356144/pexels-photo-4356144.jpeg',
			alt: 'High Atlas Mountain landscapes',
		},
		{
			src: 'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg',
			alt: 'Traditional Berber camp',
		},
	]

	return (
		<section className="py-16 md:py-24">
			<div className="container px-4 md:px-6">
				<div className="mx-auto mb-12 max-w-3xl text-center">
					<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
						{t('gallery.title')}
					</h2>
					<p className="text-muted-foreground text-lg">
						{t('gallery.subtitle')}
					</p>
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
					{galleryImages.map((image, index) => (
						<div
							key={index}
							className="relative h-64 cursor-pointer overflow-hidden rounded-lg"
							onClick={() => setSelectedImage(index)}
						>
							<Image
								src={image.src || '/placeholder.svg'}
								alt={image.alt}
								fill
								className="object-cover transition-transform hover:scale-105"
							/>
						</div>
					))}
				</div>
			</div>

			<Dialog
				open={selectedImage !== null}
				onOpenChange={() => setSelectedImage(null)}
			>
				<DialogContent className="max-w-4xl overflow-hidden p-0">
					{selectedImage !== null && (
						<div className="relative h-[80vh] w-full">
							<Image
								src={galleryImages[selectedImage].src || '/placeholder.svg'}
								alt={galleryImages[selectedImage].alt}
								fill
								className="object-contain"
							/>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</section>
	)
}
