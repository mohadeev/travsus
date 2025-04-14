'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// import { DashboardShell } from '@/components/dashboard/shell'
import { DashboardHeader } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { initializeBlankTour } from '@/app/actions/tourActions'
import { toast } from '@/components/ui/use-toast'
import { Map, Plus } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/shell'

export default function CreateTourPage() {
	const router = useRouter()
	const [isInitiating, setIsInitiating] = useState(false)

	const handleInitiateTour = async () => {
		setIsInitiating(true)
		try {
			const result = await initializeBlankTour()

			if (result.success) {
				toast({
					title: 'Tour initialized',
					description: 'You can now fill in your tour details.',
				})

				// Redirect to the tour's edit page with the tour ID
				router.push(`/dashboard/tours/${result.tour.id}/edit`)
			} else {
				throw new Error(result.error || 'Failed to initialize tour')
			}
		} catch (error) {
			console.error('Error initializing tour:', error)
			toast({
				title: 'Error initializing tour',
				description:
					(error as Error).message ||
					'There was a problem initializing your tour. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsInitiating(false)
		}
	}

	return (
		<DashboardShell>
			<DashboardHeader
				heading="Create Tour"
				text="Add a new tour package to your catalog"
			/>

			<Card className="w-full">
				<CardHeader>
					<CardTitle>Initiate New Tour</CardTitle>
					<CardDescription>
						Start the process of creating a new tour by initializing a blank
						tour record.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center justify-center p-10">
					<div className="flex flex-col items-center justify-center space-y-4 text-center">
						<div className="rounded-full bg-primary/10 p-6">
							<Map className="h-12 w-12 text-primary" />
						</div>
						<h2 className="text-2xl font-bold">Create a New Tour</h2>
						<p className="text-muted-foreground">
							Click the button below to initiate a new tour. You'll be able to
							add all the details in the next step.
						</p>
						<Button
							onClick={handleInitiateTour}
							disabled={isInitiating}
							size="lg"
							className="mt-4"
						>
							<Plus className="mr-2 h-4 w-4" />
							{isInitiating ? 'Initializing...' : 'Initiate Tour'}
						</Button>
					</div>
				</CardContent>
			</Card>
		</DashboardShell>
	)
}
