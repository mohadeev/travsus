'use client'

import { useLanguage } from './language-provider'
import { Card, CardContent } from '@/components/ui/card'
import {
	Mountain,
	Tent,
	Camera,
	CaravanIcon as Camel,
	MapPin,
	UtensilsCrossed,
	Users,
} from 'lucide-react'

export default function TourOverview() {
	const { t } = useLanguage()

	const highlights = [
		{
			icon: <Mountain className="h-8 w-8 text-black" />,
			title: 'High Atlas Mountains',
			description: "Cross the spectacular Tizi n'Tichka pass at 2260m",
		},
		{
			icon: <MapPin className="h-8 w-8 text-black" />,
			title: 'Ait Ben Haddou',
			description: 'Visit the UNESCO World Heritage kasbah',
		},
		{
			icon: <Camera className="h-8 w-8 text-black" />,
			title: 'Ouarzazate',
			description: "Explore the 'Hollywood of Morocco'",
		},
		{
			icon: <Camel className="h-8 w-8 text-black" />,
			title: 'Camel Trekking',
			description: 'Ride through the golden dunes of Erg Chebbi',
		},
		{
			icon: <Tent className="h-8 w-8 text-black" />,
			title: 'Desert Camp',
			description: 'Sleep under the stars in a traditional Berber tent',
		},
		{
			icon: <UtensilsCrossed className="h-8 w-8 text-black" />,
			title: 'Authentic Cuisine',
			description: 'Enjoy traditional Moroccan dishes throughout the tour',
		},
	]

	return (
		<section id="overview" className="bg-gray-50 py-16 md:py-24">
			<div className="container px-4 md:px-6">
				<div className="mx-auto mb-12 max-w-3xl text-center">
					<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
						{t('overview.title')}
					</h2>
					<p className="text-muted-foreground text-lg">
						{t('overview.description')}
					</p>
				</div>

				<div className="mx-auto max-w-5xl">
					<h3 className="mb-8 text-center text-2xl font-bold">
						{t('overview.highlights')}
					</h3>

					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{highlights.map((highlight, index) => (
							<Card key={index} className="border-none shadow-md">
								<CardContent className="flex flex-col items-center p-6 text-center">
									<div className="mb-4 rounded-full bg-gray-100 p-3">
										{highlight.icon}
									</div>
									<h4 className="mb-2 text-xl font-medium">
										{highlight.title}
									</h4>
									<p className="text-muted-foreground">
										{highlight.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>

					<div className="mt-12 flex justify-center">
						<div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-black">
							<Users className="h-5 w-5" />
							<span className="text-sm font-medium">
								Small groups for a personalized experience
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
