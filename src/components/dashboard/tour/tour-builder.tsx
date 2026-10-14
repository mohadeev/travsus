'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import TourBasicInfo from './TourBasicInfo'
import TourOverviewHighlights from './TourOverviewHighlights'
import TourItinerary from './TourItinerary'
import TourPricing from './TourPricing'
import TourAccommodations from './TourAccommodations'
import TourImages from './TourImages'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { BedDouble, Euro, FileText, Images, ListOrdered, Save, Sparkles, type LucideIcon } from 'lucide-react'
import { createTour } from '@/app/actions/tourActions'

// The builder's sections: [tab id, label, icon]
const SECTIONS: [string, string, LucideIcon][] = [
	['basic-info', 'Basics', FileText],
	['overview-highlights', 'Overview', Sparkles],
	['itinerary', 'Itinerary', ListOrdered],
	['pricing', 'Pricing', Euro],
	['images', 'Photos', Images],
	['accommodations', 'Stays', BedDouble],
]

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
		// If changing from images tab, trigger validation
		if (activeTab === 'images') {
			window.dispatchEvent(new Event('validateImages'))
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
					{/* Sections: numbered pills, swipe on phones */}
					<nav aria-label="Tour sections" className="-mx-5 mb-6 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
						{SECTIONS.map(([id, label, Icon], i) => {
							const active = activeTab === id
							return (
								<button
									key={id}
									type="button"
									onClick={() => handleTabChange(id)}
									aria-current={active ? 'step' : undefined}
									className={`inline-flex shrink-0 items-center gap-2 rounded-full py-2 pl-2 pr-4 text-sm font-semibold transition ${active ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800'}`}
								>
									<span className={`grid h-7 w-7 place-items-center rounded-full text-xs ${active ? 'bg-white/15 dark:bg-neutral-950/10' : 'bg-white dark:bg-neutral-950'}`}>
										<Icon className="h-3.5 w-3.5" />
									</span>
									<span className="tabular-nums opacity-50">{i + 1}</span>
									{label}
								</button>
							)
						})}
					</nav>

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
								<CardTitle>Itinerary &amp; duration</CardTitle>
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
								<CardTitle>Pricing</CardTitle>
							</CardHeader>
							<CardContent>
								<TourPricing
									tourData={tourData}
									updateTourData={updateTourData}
								/>
							</CardContent>
						</Card>
					)}

					{activeTab === 'images' && (
						<Card>
							<CardHeader>
								<CardTitle>Tour Images</CardTitle>
							</CardHeader>
							<CardContent>
								<TourImages
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

					{/* Save bar: always in reach */}
					<div className="sticky bottom-20 z-30 mt-8 flex flex-wrap items-center gap-3 rounded-full bg-white/90 py-2 pl-5 pr-2 shadow-[0_8px_30px_rgba(0,0,0,0.12)] ring-1 ring-neutral-200 backdrop-blur-xl sm:bottom-6 dark:bg-neutral-950/90 dark:ring-neutral-800">
						<span className="mr-auto flex items-center gap-2 text-sm">
							<span className={`h-2 w-2 rounded-full ${hasUnsavedChanges ? 'bg-amber-500' : 'bg-emerald-500'}`} />
							{hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
						</span>
						<Button type="button" variant="ghost" onClick={() => router.push('/dashboard/tours')}>
							Cancel
						</Button>
						<Button type="submit" loading={isSubmitting}>
							{!isSubmitting && <Save />}
							{isSubmitting ? 'Saving…' : 'Save tour'}
						</Button>
					</div>
				</form>
			</FormProvider>
		</div>
	)
}
