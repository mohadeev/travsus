'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TourBasicInfo from './TourBasicInfo'
import TourOverview from './TourOverview'
import TourHighlights from './TourHighlights'
import TourItinerary from './TourItinerary'
import TourPricing from './TourPricing'
import TourAccommodations from './TourAccommodations'
import TourImages from './TourImages'
import TourReview from './TourReview'
import { updateTour } from '@/app/actions/tourActions'

const steps = [
	{ id: 'basic-info', title: 'Basic Info' },
	{ id: 'overview', title: 'Overview' },
	{ id: 'highlights', title: 'Highlights' },
	{ id: 'itinerary', title: 'Itinerary' },
	{ id: 'pricing', title: 'Pricing' },
	{ id: 'accommodations', title: 'Accommodations' },
	{ id: 'images', title: 'Images' },
	{ id: 'review', title: 'Review' },
]

interface TourBuilderProps {
	tourData: any
	updateTourData: (data: Partial<typeof tourData>) => void
	currentStep: number
}

export default function TourBuilder({
	tourData,
	updateTourData,
	currentStep,
}: TourBuilderProps) {
	const [step, setStep] = useState(currentStep)
	const router = useRouter()

	const renderStep = () => {
		switch (step) {
			case 0:
				return (
					<TourBasicInfo tourData={tourData} updateTourData={updateTourData} />
				)
			case 1:
				return (
					<TourOverview tourData={tourData} updateTourData={updateTourData} />
				)
			case 2:
				return (
					<TourHighlights tourData={tourData} updateTourData={updateTourData} />
				)
			case 3:
				return (
					<TourItinerary tourData={tourData} updateTourData={updateTourData} />
				)
			case 4:
				return (
					<TourPricing tourData={tourData} updateTourData={updateTourData} />
				)
			case 5:
				return (
					<TourAccommodations
						tourData={tourData}
						updateTourData={updateTourData}
					/>
				)
			case 6:
				return (
					<TourImages tourData={tourData} updateTourData={updateTourData} />
				)
			case 7:
				return <TourReview tourData={tourData} />
			default:
				return null
		}
	}

	const handleNext = () => {
		const nextStep = Math.min(steps.length - 1, step + 1)
		setStep(nextStep)
		router.push(
			`/service-editor?active=create&step=${nextStep + 1}&serviceId=${tourData.id}`,
		)
	}

	const handlePrevious = () => {
		const prevStep = Math.max(0, step - 1)
		setStep(prevStep)
		router.push(
			`/service-editor?active=create&step=${prevStep + 1}&serviceId=${tourData.id}`,
		)
	}

	const handleSubmit = async () => {
		try {
			const updatedTour = await updateTour(tourData.id, tourData)
			alert('Tour updated successfully!')
			router.push('/dashboard') // Assuming there's a dashboard page to redirect to
		} catch (error) {
			console.error('Error updating tour:', error)
			alert('Failed to update tour. Please try again.')
		}
	}

	return (
		<div className="rounded-lg bg-white p-6 shadow-md">
			<nav aria-label="Progress">
				<ol role="list" className="mb-8 flex items-center justify-between">
					{steps.map((s, index) => (
						<li key={s.id} className="relative">
							<button
								onClick={() => setStep(index)}
								className={`flex h-10 w-10 items-center justify-center rounded-full ${
									step >= index
										? 'bg-black text-white'
										: 'bg-gray-200 text-gray-500'
								} transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2`}
								aria-current={step === index ? 'step' : undefined}
							>
								<span className="sr-only">{s.title}</span>
								<span>{index + 1}</span>
							</button>
							<span className="absolute left-1/2 top-14 -translate-x-1/2 transform text-xs font-medium text-gray-500">
								{s.title}
							</span>
						</li>
					))}
				</ol>
			</nav>
			<div className="mb-8 mt-8">{renderStep()}</div>
			<div className="mt-8 flex justify-between">
				<button
					onClick={handlePrevious}
					disabled={step === 0}
					className="rounded bg-gray-200 px-4 py-2 text-gray-700 transition-colors duration-200 ease-in-out hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
				>
					Previous
				</button>
				{step === steps.length - 1 ? (
					<button
						onClick={handleSubmit}
						className="rounded bg-black px-4 py-2 text-white transition-colors duration-200 ease-in-out hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
					>
						Submit Tour
					</button>
				) : (
					<button
						onClick={handleNext}
						className="rounded bg-black px-4 py-2 text-white transition-colors duration-200 ease-in-out hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
					>
						Next
					</button>
				)}
			</div>
		</div>
	)
}
