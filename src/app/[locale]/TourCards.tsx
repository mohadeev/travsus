// components/YouTubeStyleCards.tsx
'use client'

import { useState } from 'react'

interface TourCard {
	id: number
	title: string
	description: string
	duration: string
	price: string
	image: string
}

const YouTubeStyleCards = () => {
	const [clickedCard, setClickedCard] = useState<number | null>(null)

	const tourData: TourCard[] = [
		{
			id: 1,
			title: 'Mountain Adventure',
			description:
				'Experience the thrill of mountain trekking with expert guides.',
			duration: '3 days',
			price: '$299',
			image:
				'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
		},
		{
			id: 2,
			title: 'Beach Paradise',
			description: 'Relax on pristine beaches and enjoy crystal clear waters.',
			duration: '5 days',
			price: '$499',
			image:
				'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
		},
		{
			id: 3,
			title: 'City Exploration',
			description: 'Discover the hidden gems of bustling metropolitan areas.',
			duration: '2 days',
			price: '$199',
			image:
				'https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
		},
		{
			id: 4,
			title: 'Forest Retreat',
			description: 'Immerse yourself in nature with guided forest walks.',
			duration: '4 days',
			price: '$399',
			image:
				'https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
		},
	]

	const handleCardClick = (id: number) => {
		// Set the clicked card to show the animations
		setClickedCard(id)

		// Reset after 1 second to allow the animations to complete
		setTimeout(() => {
			setClickedCard(null)
		}, 1000)
	}

	return (
		<div className="min-h-screen bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-12 text-center">
					<h1 className="mb-4 text-4xl font-bold text-gray-800">
						Explore Our Tours
					</h1>
					<p className="mx-auto max-w-3xl text-lg text-gray-600">
						Click on any card to see the YouTube-style background and border
						animation.
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{tourData.map((tour) => (
						<div
							key={tour.id}
							className="group relative cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300"
							onClick={() => handleCardClick(tour.id)}
						>
							{/* Background animation */}
							<div
								className={`absolute inset-0 rounded-lg bg-gray-200 ${
									clickedCard === tour.id ? 'opacity-100' : 'opacity-0'
								} transition-opacity duration-300`}
							></div>

							{/* YouTube-style gray border animation with delay */}
							<div
								className={`absolute inset-0 rounded-lg border-2 ${
									clickedCard === tour.id
										? 'border-gray-400 opacity-100'
										: 'border-transparent opacity-0'
								} transition-all delay-150 duration-300`}
							></div>

							{/* Card content */}
							<div className="relative">
								<div className="relative h-48 overflow-hidden">
									<img
										src={tour.image}
										alt={tour.title}
										className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
									<div className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 shadow-md">
										<span className="text-sm font-semibold text-green-600">
											{tour.price}
										</span>
									</div>
								</div>

								<div className="p-5">
									<h3 className="mb-2 line-clamp-1 text-xl font-bold text-gray-800">
										{tour.title}
									</h3>
									<p className="mb-4 line-clamp-2 text-gray-600">
										{tour.description}
									</p>
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-500">
											<i className="far fa-clock mr-1"></i> {tour.duration}
										</span>
										<span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
											Select
										</span>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>

				<div className="mt-12 text-center">
					<p className="text-gray-600">
						Click on any card to see the YouTube-style background and border
						animation.
					</p>
				</div>
			</div>
		</div>
	)
}

export default YouTubeStyleCards
