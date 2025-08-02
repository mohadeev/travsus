'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { initiateTour } from '@/app/actions/tourActions'

export default function InitiateTour() {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const handleInitiateTour = async () => {
		setIsLoading(true)
		setError(null)
		try {
			const tourId = await initiateTour()
			if (tourId) {
				router.push(`/service-editor?active=create&step=1&serviceId=${tourId}`)
			} else {
				throw new Error('Failed to get tour ID')
			}
		} catch (error) {
			console.error('Failed to initiate tour:', error)
			setError('Failed to initiate tour. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
			<h1 className="mb-6 text-3xl font-bold">Create a New Tour</h1>
			{error && <p className="mb-4 text-red-500">{error}</p>}
			<Button
				onClick={handleInitiateTour}
				disabled={isLoading}
				className="rounded-lg bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800"
			>
				{isLoading ? 'Initiating...' : 'Start New Tour'}
			</Button>
		</div>
	)
}
