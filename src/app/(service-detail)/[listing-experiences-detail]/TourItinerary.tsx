'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react'

interface Day {
	name: string
	description: string
}

interface TourItineraryProps {
	days: Day[] | null
	isLoading?: boolean
}

function TourItinerarySkeleton() {
	return (
		<div className="bg-background mx-auto max-w-4xl p-6">
			<div className="space-y-8">
				<div className="h-8 w-48 animate-pulse rounded-md bg-gray-200" />
				<div className="space-y-6">
					{[...Array(3)].map((_, index) => (
						<div key={index} className="relative">
							<div className="absolute bottom-0 left-4 top-0 flex flex-col items-center">
								<div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
								{index < 2 && (
									<div className="relative mt-2 w-0.5 flex-grow">
										<div className="absolute inset-0 flex flex-col items-center justify-between">
											{[...Array(30)].map((_, i) => (
												<div
													key={i}
													className="h-[3px] w-[3px] rounded-full bg-gray-200"
													style={{ margin: '2px 0' }}
												/>
											))}
										</div>
									</div>
								)}
							</div>
							<div className="ml-20 p-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
										<div className="h-6 w-48 animate-pulse rounded-md bg-gray-200" />
									</div>
									<div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default function TourItinerary({
	days,
	isLoading = false,
}: TourItineraryProps) {
	const [openDays, setOpenDays] = useState<boolean[]>(
		days ? [true, ...Array(days.length - 1).fill(false)] : [],
	)

	if (isLoading || !days) {
		return <TourItinerarySkeleton />
	}

	const toggleDay = (index: number) => {
		setOpenDays((prev) => {
			const newOpenDays = [...prev]
			newOpenDays[index] = !newOpenDays[index]
			return newOpenDays
		})
	}

	return (
		<section
			className="mx-auto max-w-[100%] py-6"
			aria-labelledby="tour-itinerary-heading"
		>
			<h2 id="tour-itinerary-heading" className="mb-8 text-2xl font-semibold">
				Tour Itinerary
			</h2>
			<ol className="space-y-6">
				{days.map((day, index) => (
					<li key={index} className="relative">
						<div className="absolute bottom-0 left-4 top-0 flex flex-col items-center">
							<div className="text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-white">
								{index + 1}
							</div>
							{index < days.length - 1 && (
								<div className="relative mt-2 w-0.5 flex-grow">
									<div className="absolute inset-0 flex flex-col items-center justify-between">
										{[...Array(30)].map((_, i) => (
											<div
												key={i}
												className="h-[3px] w-[3px] rounded-full bg-primary"
												style={{ margin: '2px 0' }}
											/>
										))}
									</div>
								</div>
							)}
						</div>
						<Card className="ml-20 p-6 transition-shadow hover:shadow-lg">
							<h3 className="mb-4 text-lg font-semibold">{day.name}</h3>
							<div
								className="flex cursor-pointer items-start justify-between"
								onClick={() => toggleDay(index)}
								aria-expanded={openDays[index]}
								aria-controls={`day-${index}-description`}
								role="button"
								tabIndex={0}
							>
								<div className="flex items-start gap-2">
									<MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
									<span className="font-medium">View Details</span>
								</div>
								{openDays[index] ? (
									<ChevronUp className="h-5 w-5 text-primary" />
								) : (
									<ChevronDown className="h-5 w-5 text-primary" />
								)}
							</div>
							<div
								id={`day-${index}-description`}
								className={`mt-4 leading-relaxed ${openDays[index] ? '' : 'sr-only'}`}
							>
								<p className="text-muted-foreground">{day.description}</p>
							</div>
						</Card>
					</li>
				))}
			</ol>
		</section>
	)
}
