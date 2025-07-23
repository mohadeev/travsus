'use client'

import { useLanguage } from './language-provider'
import Image from 'next/image'
import { CheckCircle } from 'lucide-react'

export default function TourHighlights() {
	const { t } = useLanguage()

	const keyFeatures = [
		'Professional knowledgeable guides',
		'Comfortable 4x4 air-conditioned transportation',
		'Overnight in a desert camp with private bathroom',
		'Camel trekking through the Sahara dunes',
		'Visit to UNESCO World Heritage sites',
		'Traditional Moroccan breakfasts and dinners',
		'Scenic stops for photo opportunities',
		'Small groups for personalized attention',
	]

	return (
		<section className="py-16 md:py-24">
			<div className="container px-4 md:px-6">
				<div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
					<div className="space-y-4">
						<h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
							Why Choose Our Marrakech to Merzouga Tour
						</h2>

						<p className="text-muted-foreground mb-8 text-lg">
							Our 3-day tour offers an authentic Moroccan experience that
							combines adventure, culture, and comfort. Here's what makes our
							tour special:
						</p>

						<ul className="space-y-3">
							{keyFeatures.map((feature, index) => (
								<li key={index} className="flex items-start">
									<CheckCircle className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-black" />
									<span>{feature}</span>
								</li>
							))}
						</ul>
					</div>

					<div className="relative h-[500px] overflow-hidden rounded-xl">
						<Image
							src="https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg"
							alt="Highlights of the Morocco desert tour"
							fill
							className="object-cover"
						/>
					</div>
				</div>
			</div>
		</section>
	)
}
