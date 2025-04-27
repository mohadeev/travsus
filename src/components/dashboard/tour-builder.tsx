'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import TourBasicInfo from './tour/TourBasicInfo'
import TourOverviewHighlights from './tour/TourOverviewHighlights'
import TourItinerary from './tour/TourItinerary'
import TourPricing from './tour/TourPricing'
import TourAccommodations from './tour/TourAccommodations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { Save } from 'lucide-react'
import { createTour } from '@/app/actions/tourActions'

// Define the form schema with Zod
const tourSchema = z.object({
	name: z
		.string()
		.min(2, { message: 'Tour name must be at least 2 characters.' }),
	subtitle: z.string().optional(),
	lang: z.string().min(1, { message: 'Please select a language.' }),
	tags: z.array(z.string()).optional(),
	// We'll add more fields as we add more components
})

// Define the form values type
export type TourFormValues = z.infer<typeof tourSchema>

export function TourBuilder({ tour }: { tour?: any }) {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
	const [activeTab, setActiveTab] = useState('basic-info')

	// Initialize tour data state
	const [tourData, setTourData] = useState({
		id: tour?.id || '',
		name: tour?.name || '',
		subtitle: tour?.subtitle || '',
		overview: tour?.overview || '',
		slug: tour?.slug || '',
		highlights: tour?.highlights || [],
		days: tour?.days || [],
		price: tour?.price || '',
		discount: tour?.discount || '',
		images: tour?.images || [],
		tags: tour?.tags || [],
		lang: tour?.lang || 'EN',
		people: tour?.people || [],
		services: tour?.services || [],
		places: tour?.places || [],
		paths: tour?.paths || [],
		reviews: tour?.reviews || [],
		tourfor: tour?.tourfor || '',
		updated: true,
		conclusion: tour?.conclusion || '',
		keyphrase: tour?.keyphrase || [],
		productCategory: tour?.productCategory || '', // String, not array
		pricingTiers: tour?.pricingTiers || [],
		accommodations: tour?.accommodations || [],
		duration: tour?.duration || undefined,
		durationType: tour?.durationType || 'days',
		includesOvernight: tour?.includesOvernight || false,
	})

	// Initialize the form with React Hook Form and Zod validation
	const methods = useForm<TourFormValues>({
		resolver: zodResolver(tourSchema),
		defaultValues: {
			name: tour?.name || '',
			subtitle: tour?.subtitle || '',
			lang: tour?.lang || 'EN',
			tags: tour?.tags || [],
		},
	})

	// Function to update tour data
	const updateTourData = (data: Partial<typeof tourData>) => {
		setTourData((prev) => ({
			...prev,
			...data,
		}))
		setHasUnsavedChanges(true)
	}

	// Handle tab change with validation
	const handleTabChange = (tab: string) => {
		// If changing from itinerary tab, trigger validation
		if (activeTab === 'itinerary') {
			window.dispatchEvent(new Event('validateItinerary'))
		}
		// If changing from pricing tab, trigger validation
		if (activeTab === 'pricing') {
			window.dispatchEvent(new Event('validatePricing'))
		}
		// If changing from accommodations tab, trigger validation
		if (activeTab === 'accommodations') {
			window.dispatchEvent(new Event('validateAccommodations'))
		}
		setActiveTab(tab)
	}

	// Handle form submission
	async function onSubmit(data: TourFormValues) {
		setIsSubmitting(true)
		try {
			// Merge form data with tour data
			const updatedTourData = {
				...tourData,
				name: data.name,
				subtitle: data.subtitle,
				lang: data.lang,
				tags: data.tags,
			}

			let result

			if (tour?.id) {
				// Update existing tour - Direct API call
				const response = await fetch(`/api/dashboard/tours/${tour.id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(updatedTourData),
				})

				if (!response.ok) {
					const errorData = await response.json()
					result = {
						success: false,
						error: errorData.message || 'Failed to update tour',
					}
				} else {
					const data = await response.json()
					result = { success: true, data }
				}
			} else {
				// Create new tour - Use server action
				result = await createTour(updatedTourData)
			}

			if (result.success) {
				toast({
					title: tour?.id
						? 'Tour updated successfully'
						: 'Tour created successfully',
					description: 'Your tour has been saved.',
				})
				setHasUnsavedChanges(false)
				// No redirect after save
			} else {
				throw new Error(result.error || 'Failed to save tour')
			}
		} catch (error) {
			console.error('Error saving tour:', error)
			toast({
				title: 'Error saving tour',
				description:
					(error as Error).message ||
					'There was a problem saving your tour. Please try again.',
				variant: 'destructive',
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	// Handle form changes to track unsaved changes
	const handleFormChange = () => {
		if (!hasUnsavedChanges) {
			setHasUnsavedChanges(true)
		}
	}

	return (
		<div className="space-y-6">
			<FormProvider {...methods}>
				<form
					onSubmit={methods.handleSubmit(onSubmit)}
					onChange={handleFormChange}
				>
					{/* Tabs for different sections */}
					<div className="mb-6 flex space-x-2 overflow-x-auto border-b">
						<button
							type="button"
							className={`border-b-2 px-4 py-2 ${
								activeTab === 'basic-info'
									? 'border-black font-medium'
									: 'border-transparent'
							}`}
							onClick={() => handleTabChange('basic-info')}
						>
							Basic Info
						</button>
						<button
							type="button"
							className={`border-b-2 px-4 py-2 ${
								activeTab === 'overview-highlights'
									? 'border-black font-medium'
									: 'border-transparent'
							}`}
							onClick={() => handleTabChange('overview-highlights')}
						>
							Overview & Highlights
						</button>
						<button
							type="button"
							className={`border-b-2 px-4 py-2 ${
								activeTab === 'itinerary'
									? 'border-black font-medium'
									: 'border-transparent'
							}`}
							onClick={() => handleTabChange('itinerary')}
						>
							Itinerary
						</button>
						<button
							type="button"
							className={`border-b-2 px-4 py-2 ${
								activeTab === 'pricing'
									? 'border-black font-medium'
									: 'border-transparent'
							}`}
							onClick={() => handleTabChange('pricing')}
						>
							Pricing
						</button>
						<button
							type="button"
							className={`border-b-2 px-4 py-2 ${
								activeTab === 'accommodations'
									? 'border-black font-medium'
									: 'border-transparent'
							}`}
							onClick={() => handleTabChange('accommodations')}
						>
							Accommodations
						</button>
					</div>

					{/* Content based on active tab */}
					{activeTab === 'basic-info' && (
						<Card>
							<CardHeader>
								<CardTitle>Basic Information</CardTitle>
							</CardHeader>
							<CardContent>
								<TourBasicInfo />
							</CardContent>
						</Card>
					)}

					{activeTab === 'overview-highlights' && (
						<Card>
							<CardHeader>
								<CardTitle>Overview & Highlights</CardTitle>
							</CardHeader>
							<CardContent>
								<TourOverviewHighlights
									tourData={tourData}
									updateTourData={updateTourData}
								/>
							</CardContent>
						</Card>
					)}

					{activeTab === 'itinerary' && (
						<Card>
							<CardHeader>
								<CardTitle>Tour Itinerary</CardTitle>
							</CardHeader>
							<CardContent>
								<TourItinerary
									tourData={tourData}
									updateTourData={updateTourData}
								/>
							</CardContent>
						</Card>
					)}

					{activeTab === 'pricing' && (
						<Card>
							<CardHeader>
								<CardTitle>Tour Pricing</CardTitle>
							</CardHeader>
							<CardContent>
								<TourPricing
									tourData={tourData}
									updateTourData={updateTourData}
								/>
							</CardContent>
						</Card>
					)}

					{activeTab === 'accommodations' && (
						<Card>
							<CardHeader>
								<CardTitle>Tour Accommodations</CardTitle>
							</CardHeader>
							<CardContent>
								<TourAccommodations
									tourData={tourData}
									updateTourData={updateTourData}
								/>
							</CardContent>
						</Card>
					)}

					{/* Submit buttons */}
					<div className="mt-6 flex justify-between">
						<div className="text-muted-foreground text-sm">
							{hasUnsavedChanges && (
								<span className="text-amber-600">You have unsaved changes</span>
							)}
						</div>
						<div className="space-x-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => router.push('/dashboard/tours')}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										<svg
											className="mr-2 h-4 w-4 animate-spin"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										Saving...
									</>
								) : (
									<>
										<Save className="mr-2 h-4 w-4" />
										Save Tour
									</>
								)}
							</Button>
						</div>
					</div>
				</form>
			</FormProvider>
		</div>
	)
}
