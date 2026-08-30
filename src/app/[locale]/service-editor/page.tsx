'use client'
export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import InitiateTour from './components/InitiateTour'
import TourBuilder from './components/TourBuilder'
import { updateTour } from '@/app/actions/tourActions'

export default function ServiceEditorPage() {
	const [tourData, setTourData] = useState<any>(null)
	const [isLoading, setIsLoading] = useState(true)
	const router = useRouter()
	const searchParams = useSearchParams()

	const active = searchParams.get('active')
	const step = searchParams.get('step')
		? parseInt(searchParams.get('step') as string)
		: 1
	const serviceId = searchParams.get('serviceId')

	useEffect(() => {
		const fetchTourData = async () => {
			// if (active === 'create' && serviceId) {
			// 	try {
			// 		const tour = await getTourById(serviceId)
			// 		if (tour) {
			// 			setTourData(tour)
			// 		} else {
			// 			console.error('Tour not found')
			// 			router.push('/service-editor')
			// 		}
			// 	} catch (error) {
			// 		console.error('Error fetching tour:', error)
			// 	} finally {
			// 		setIsLoading(false)
			// 	}
			// } else {
			// 	setIsLoading(false)
			// }
		}

		fetchTourData()
	}, [active, serviceId, router])

	const updateTourData = async (data: Partial<typeof tourData>) => {
		const updatedTourData = { ...tourData, ...data }
		setTourData(updatedTourData)
		if (updatedTourData.id) {
			await updateTour(updatedTourData.id, updatedTourData)
		}
	}

	if (isLoading) {
		return <div>Loading...</div>
	}

	if (active === 'create' && serviceId && tourData) {
		return (
			<TourBuilder
				tourData={tourData}
				updateTourData={updateTourData}
				currentStep={step - 1}
			/>
		)
	}

	return <InitiateTour />
}
