'use client'

import { useState } from 'react'
import { useLanguage } from './language-provider'
import Image from 'next/image'
import { Clock, Map, Compass, Utensils, Hotel, Tent } from 'lucide-react'

export default function TourItinerary() {
	const { t } = useLanguage()
	const [activeTab, setActiveTab] = useState('day1')

	const itineraryData = [
		{
			id: 'day1',
			title: t('itinerary.day1.title'),
			description: t('itinerary.day1.description'),
			image:
				'https://images.pexels.com/photos/4356144/pexels-photo-4356144.jpeg',
			highlights: [
				{
					icon: <Clock className="h-5 w-5 text-black" />,
					text: '7:30 AM departure from Marrakech',
				},
				{
					icon: <Map className="h-5 w-5 text-black" />,
					text: "Tizi n'Tichka pass (2260m)",
				},
				{
					icon: <Compass className="h-5 w-5 text-black" />,
					text: 'Ait Ben Haddou UNESCO site',
				},
				{
					icon: <Utensils className="h-5 w-5 text-black" />,
					text: 'Lunch in Ouarzazate (not included)',
				},
				{
					icon: <Compass className="h-5 w-5 text-black" />,
					text: 'Valley of Roses & Dades Valley',
				},
				{
					icon: <Hotel className="h-5 w-5 text-black" />,
					text: 'Overnight in Dades Valley hotel',
				},
			],
		},
		{
			id: 'day2',
			title: t('itinerary.day2.title'),
			description: t('itinerary.day2.description'),
			image:
				'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg',
			highlights: [
				{
					icon: <Clock className="h-5 w-5 text-black" />,
					text: '8:00 AM breakfast and departure',
				},
				{
					icon: <Compass className="h-5 w-5 text-black" />,
					text: 'Todra Gorge exploration',
				},
				{
					icon: <Map className="h-5 w-5 text-black" />,
					text: 'Drive through Erfoud',
				},
				{
					icon: <Utensils className="h-5 w-5 text-black" />,
					text: 'Lunch in Rissani (not included)',
				},
				{
					icon: <Compass className="h-5 w-5 text-black" />,
					text: 'Camel trek through Erg Chebbi dunes',
				},
				{
					icon: <Tent className="h-5 w-5 text-black" />,
					text: 'Desert camp with dinner and music',
				},
			],
		},
		{
			id: 'day3',
			title: t('itinerary.day3.title'),
			description: t('itinerary.day3.description'),
			image:
				'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg',
			highlights: [
				{
					icon: <Clock className="h-5 w-5 text-black" />,
					text: 'Early morning sunrise viewing',
				},
				{
					icon: <Compass className="h-5 w-5 text-black" />,
					text: 'Camel trek back to Merzouga',
				},
				{
					icon: <Utensils className="h-5 w-5 text-black" />,
					text: 'Breakfast at Merzouga hotel',
				},
				{
					icon: <Map className="h-5 w-5 text-black" />,
					text: 'Return journey through Draa Valley',
				},
				{
					icon: <Utensils className="h-5 w-5 text-black" />,
					text: 'Lunch in Ouarzazate (not included)',
				},
				{
					icon: <Clock className="h-5 w-5 text-black" />,
					text: 'Arrive in Marrakech by evening',
				},
			],
		},
	]

	// Custom styling for the tabs
	const getTabStyle = (day) => {
		if (day === activeTab) {
			return 'bg-black text-white'
		}
		return 'bg-white text-black hover:bg-gray-100'
	}

	return (
		<section id="itinerary" className="bg-gray-50 py-16 md:py-24">
			<div className="container px-4 md:px-6">
				<div className="mx-auto mb-12 max-w-3xl text-center">
					<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
						{t('itinerary.title')}
					</h2>
					<p className="text-muted-foreground text-lg">
						An exciting journey through Morocco's diverse landscapes, from
						mountains to desert
					</p>
				</div>

				<div className="mx-auto max-w-5xl">
					<div className="mb-8 grid grid-cols-3 gap-2">
						{itineraryData.map((day) => (
							<button
								key={day.id}
								onClick={() => setActiveTab(day.id)}
								className={`rounded-md px-4 py-2 font-medium transition-colors ${getTabStyle(day.id)}`}
							>
								{day.id === 'day1'
									? 'Day 1'
									: day.id === 'day2'
										? 'Day 2'
										: 'Day 3'}
							</button>
						))}
					</div>

					{itineraryData.map((day) => (
						<div
							key={day.id}
							className={`mt-8 ${day.id === activeTab ? 'block' : 'hidden'}`}
						>
							<div className="grid gap-8 lg:grid-cols-2">
								<div className="space-y-4">
									<h3 className="text-2xl font-bold">{day.title}</h3>
									<p className="text-muted-foreground">{day.description}</p>

									<div className="mt-6 space-y-3">
										{day.highlights.map((highlight, index) => (
											<div key={index} className="flex items-start">
												<div className="mr-3">{highlight.icon}</div>
												<span>{highlight.text}</span>
											</div>
										))}
									</div>
								</div>

								<div className="relative h-[300px] overflow-hidden rounded-xl sm:h-[400px]">
									<Image
										src={day.image || '/placeholder.svg'}
										alt={day.title}
										fill
										className="object-cover"
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
