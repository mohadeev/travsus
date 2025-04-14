'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import {
	ChevronLeft,
	ChevronRight,
	Save,
	AlertCircle,
	CheckCircle2,
} from 'lucide-react'
import { createTour, updateTour } from '@/app/actions/tourActions'

import TourBasicInfo from './TourBasicInfo'
import TourOverview from './TourOverview'
import TourHighlights from './TourHighlights'
import TourItinerary from './TourItinerary'
import TourPricing from './TourPricing'
import TourAccommodations from './TourAccommodations' // Add this import
import TourImages from './TourImages'
import TourReview from './TourReview'

// Update the steps array to include accommodations after pricing
const steps = [
	{ id: 'basic-info', title: 'Basic Info' },
	{ id: 'overview', title: 'Overview' },
	{ id: 'highlights', title: 'Highlights' },
	{ id: 'itinerary', title: 'Itinerary' },
	{ id: 'pricing', title: 'Pricing' },
	{ id: 'accommodations', title: 'Accommodations' }, // Add new step here
	{ id: 'images', title: 'Images' },
	{ id: 'review', title: 'Review' },
]

interface TourBuilderProps {
	tour?: any
}

export default function TourBuilder({ tour }: TourBuilderProps) {
	const router = useRouter()
	const [activeTab, setActiveTab] = useState('basic-info')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string[]>
	>({})
	const [stepStatus, setStepStatus] = useState<
		Record<string, 'complete' | 'incomplete' | 'error'>
	>({})
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
	const [isSaving, setIsSaving] = useState(false)
	const autoSaveTimeout = useRef<NodeJS.Timeout | null>(null)
	// Update the tourData state to include accommodations
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
		// Add other fields that match the Prisma schema
		people: tour?.people || [],
		services: tour?.services || [],
		places: tour?.places || [],
		paths: tour?.paths || [],
		reviews: tour?.reviews || [],
		tourfor: tour?.tourfor || '',
		updated: true,
		conclusion: tour?.conclusion || '',
		keyphrase: tour?.keyphrase || [],
		productCategory: tour?.productCategory || [],
		pricingTiers: tour?.pricingTiers || [], // Added pricingTiers field
		accommodations: tour?.accommodations || [], // Add accommodations field
	})
	console.log('accommodations', JSON.stringify(tour?.accommodations))

	// Add auto-save state to track saving status

	// Check all steps on initial load and when data changes
	useEffect(() => {
		const newStepStatus: Record<string, 'complete' | 'incomplete' | 'error'> =
			{}

		steps.forEach((step) => {
			const isValid = validateStep(step.id, false) // Don't update validation errors state
			if (isValid) {
				newStepStatus[step.id] = 'complete'
			} else {
				newStepStatus[step.id] = 'incomplete'
			}
		})

		setStepStatus(newStepStatus)

		// Find the first incomplete step if any
		const firstIncompleteStep = steps.find(
			(step) => newStepStatus[step.id] === 'incomplete',
		)

		// If we're on the first load and there's an incomplete step, go to it
		if (firstIncompleteStep && !tour?.updated && activeTab === 'basic-info') {
			setActiveTab(firstIncompleteStep.id)
		}
	}, [tourData, tour?.updated])

	useEffect(() => {
		// Check for step query parameter in URL
		if (typeof window !== 'undefined') {
			const params = new URLSearchParams(window.location.search)
			const stepParam = params.get('step')

			if (stepParam) {
				const stepIndex = Number.parseInt(stepParam, 10) - 1 // Convert to zero-based index
				if (stepIndex >= 0 && stepIndex < steps.length) {
					const stepId = steps[stepIndex].id
					// Only change step if it's valid
					setActiveTab(stepId)
				}
			}
		}
	}, [])

	const updateTourData = async (data: Partial<typeof tourData>) => {
		// Create the updated tour data by merging current data with new changes
		const updatedTourData = { ...tourData, ...data }

		// Update local state first for immediate UI feedback
		setTourData(updatedTourData)

		// Mark that we have unsaved changes
		setHasUnsavedChanges(true)

		// Clear validation errors for updated fields
		const updatedFields = Object.keys(data)
		if (updatedFields.length > 0) {
			const currentStepId = activeTab
			setValidationErrors((prev) => {
				const newErrors = { ...prev }
				if (newErrors[currentStepId]) {
					newErrors[currentStepId] = newErrors[currentStepId].filter(
						(error) => !updatedFields.some((field) => error.includes(field)),
					)
				}
				return newErrors
			})
		}
	}

	const handleSave = async () => {
		if (!tourData.id) return

		try {
			setIsSaving(true)
			console.log('Saving tour data:', tourData)
			const result = await updateTour(tourData.id, tourData)

			if (result.success) {
				console.log('Saved changes successfully')
				toast({
					title: 'Changes saved',
					description: 'Your changes have been saved.',
					duration: 2000,
				})
				setHasUnsavedChanges(false)
			} else {
				console.error('Failed to save:', result.error)
				toast({
					title: 'Failed to save changes',
					description:
						result.error || 'There was a problem saving your changes.',
					variant: 'destructive',
				})
			}
		} catch (error) {
			console.error('Error saving tour:', error)
			toast({
				title: 'Error saving changes',
				description:
					(error as Error).message || 'An unexpected error occurred.',
				variant: 'destructive',
			})
		} finally {
			setIsSaving(false)
		}
	}

	const updateUrlWithStep = (stepId: string) => {
		const stepIndex = steps.findIndex((step) => step.id === stepId)
		if (stepIndex !== -1 && typeof window !== 'undefined') {
			const url = new URL(window.location.href)
			url.searchParams.set('step', (stepIndex + 1).toString())
			window.history.replaceState({}, '', url.toString())
		}
	}

	const handleTabChange = (value: string) => {
		// Get the index of the step we're trying to navigate to
		const targetStepIndex = steps.findIndex((step) => step.id === value)

		// Check if the target step is already complete or if it's a previous step
		const isTargetStepComplete = stepStatus[value] === 'complete'
		const isTargetStepPrevious = targetStepIndex < getCurrentStepIndex()

		// Allow navigation if:
		// 1. Current step is valid, OR
		// 2. Target step is already complete, OR
		// 3. Target step is a previous step (allow going back)
		if (
			validateStep(activeTab) ||
			isTargetStepComplete ||
			isTargetStepPrevious
		) {
			setActiveTab(value)
			updateUrlWithStep(value)
		} else {
			// If validation fails and we're trying to go to a future incomplete step,
			// show an error message
			toast({
				title: 'Please complete all required fields',
				description:
					'Fill in all required information before proceeding to new steps.',
				variant: 'destructive',
			})
		}
	}

	const getCurrentStepIndex = () => {
		return steps.findIndex((step) => step.id === activeTab)
	}

	// Add validation for the accommodations step in the validateStep function
	const validateStep = (stepId: string, updateErrors = true): boolean => {
		const errors: string[] = []

		switch (stepId) {
			case 'basic-info':
				if (!tourData.name || tourData.name.trim() === '') {
					errors.push('Tour name is required')
				}
				// Removed country validation
				break

			case 'overview':
				if (!tourData.overview || tourData.overview.trim() === '') {
					errors.push('Tour overview is required')
				}
				if (tourData.overview && tourData.overview.length < 50) {
					errors.push('Overview should be at least 50 characters')
				}
				break

			case 'highlights':
				if (!tourData.highlights || tourData.highlights.length === 0) {
					errors.push('At least one highlight is required')
				} else {
					const emptyHighlights = tourData.highlights.filter(
						(h) => !h.name || h.name.trim() === '',
					)
					if (emptyHighlights.length > 0) {
						errors.push('All highlights must have a name')
					}
				}
				break

			case 'itinerary':
				// Dispatch an event to notify the itinerary component before validation
				if (typeof window !== 'undefined') {
					window.dispatchEvent(new Event('validateItinerary'))
				}

				if (!tourData.days || tourData.days.length === 0) {
					errors.push('At least one day in the itinerary is required')
				} else {
					const emptyDays = tourData.days.filter(
						(d) => !d.description || d.description.trim() === '',
					)
					if (emptyDays.length > 0) {
						errors.push('All days must have a description')
					}
				}
				break

			case 'pricing':
				if (!tourData.price || tourData.price.trim() === '') {
					errors.push('Price is required')
				}
				break

			case 'accommodations':
				// Add validation for accommodations
				if (!tourData.accommodations || tourData.accommodations.length === 0) {
					errors.push('At least one accommodation is required')
				}
				break

			case 'images':
				if (!tourData.images || tourData.images.length === 0) {
					errors.push('At least one image is required')
				}
				break

			case 'review':
				// No validation needed for review step
				break

			default:
				break
		}

		if (updateErrors) {
			setValidationErrors((prev) => ({ ...prev, [stepId]: errors }))
		}

		return errors.length === 0
	}

	const handleNext = () => {
		const currentIndex = getCurrentStepIndex()
		if (currentIndex < steps.length - 1) {
			const nextStepId = steps[currentIndex + 1].id

			// Check if the next step is already complete
			const isNextStepComplete = stepStatus[nextStepId] === 'complete'

			// Allow navigation if current step is valid or next step is already complete
			if (validateStep(activeTab) || isNextStepComplete) {
				setActiveTab(nextStepId)
				updateUrlWithStep(nextStepId)
			} else {
				toast({
					title: 'Please complete all required fields',
					description: 'Fill in all required information before proceeding.',
					variant: 'destructive',
				})
			}
		}
	}

	const handlePrevious = () => {
		const currentIndex = getCurrentStepIndex()
		if (currentIndex > 0) {
			const prevStepId = steps[currentIndex - 1].id
			setActiveTab(prevStepId)
			updateUrlWithStep(prevStepId)
		}
	}

	const handleSubmit = async () => {
		// Validate all steps before submission
		let allValid = true
		let firstInvalidStep = null

		for (const step of steps) {
			if (!validateStep(step.id)) {
				allValid = false
				if (!firstInvalidStep) {
					firstInvalidStep = step.id
				}
			}
		}

		if (!allValid && firstInvalidStep) {
			setActiveTab(firstInvalidStep)
			toast({
				title: 'Please complete all required fields',
				description:
					'Fill in all required information in all steps before submitting.',
				variant: 'destructive',
			})
			return
		}

		setIsSubmitting(true)
		try {
			// Generate a slug if not provided
			if (!tourData.slug && tourData.name) {
				tourData.slug = tourData.name.toLowerCase().replace(/\s+/g, '-')
			}

			let result

			if (tourData.id) {
				// Update existing tour
				result = await updateTour(tourData.id, tourData)
			} else {
				// Create new tour
				result = await createTour(tourData)
			}

			if (result.success) {
				toast({
					title: tourData.id
						? 'Tour updated successfully'
						: 'Tour created successfully',
					description: 'Your tour has been saved and is ready to publish.',
				})

				// Clear unsaved changes flag
				setHasUnsavedChanges(false)

				// Redirect to tours page
				router.push('/dashboard/tours')
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

	// Check if current step has validation errors
	const hasErrors = (stepId: string) => {
		return validationErrors[stepId] && validationErrors[stepId].length > 0
	}

	// Get the status icon for a step
	const getStepStatusIcon = (
		stepId: string,
		isActive: boolean,
		isCompleted: boolean,
	) => {
		if (hasErrors(stepId)) {
			return <AlertCircle className="h-5 w-5 text-red-500" />
		}

		if (stepStatus[stepId] === 'complete' && !isActive) {
			return <CheckCircle2 className="h-5 w-5 text-green-500" />
		}

		if (isCompleted && !isActive) {
			return (
				<svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					<path
						fillRule="evenodd"
						d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
						clipRule="evenodd"
					/>
				</svg>
			)
		}

		return null
	}

	return (
		<div className="space-y-6">
			{/* Progress Indicator */}
			<div className="hidden sm:block">
				<nav aria-label="Progress" className="mb-8">
					<ol className="flex items-center justify-between">
						{steps.map((step, index) => {
							const isActive = step.id === activeTab
							const isCompleted = getCurrentStepIndex() > index
							const hasValidationErrors = hasErrors(step.id)
							const status = stepStatus[step.id] || 'incomplete'

							return (
								<li
									key={step.id}
									className="relative flex flex-col items-center"
								>
									{/* Step label with number - MOVED TO TOP */}
									<div className="mb-2">
										<span
											className={`text-sm font-medium ${
												hasValidationErrors
													? 'text-red-500'
													: isActive
														? 'text-black'
														: status === 'complete'
															? 'text-green-500'
															: isCompleted
																? 'text-black'
																: 'text-gray-500'
											}`}
										>
											{index + 1}. {step.title}
										</span>

										{/* Status indicator */}
										{!isActive && (
											<span
												className={`ml-2 text-xs ${
													status === 'complete'
														? 'text-green-500'
														: status === 'error'
															? 'text-red-500'
															: 'text-gray-400'
												}`}
											>
												{status === 'complete'
													? 'Complete'
													: status === 'error'
														? 'Needs attention'
														: 'Incomplete'}
											</span>
										)}
									</div>

									<div className="relative">
										{/* Step connector line - POSITIONED BELOW WITH STEP NUMBER */}
										{index > 0 && (
											<div
												className="absolute left-0 right-0 top-5 h-[2px] w-full -translate-x-full bg-gray-200"
												style={{ width: 'calc(100% - 2rem)', left: '-50%' }}
											>
												<div
													className={`h-full transition-all duration-300 ${
														isCompleted || isActive
															? status === 'complete'
																? 'bg-green-500'
																: 'bg-black'
															: 'bg-transparent'
													}`}
													style={{
														width: isCompleted || isActive ? '100%' : '0%',
													}}
												/>
											</div>
										)}

										{/* Step circle */}
										<button
											onClick={() => handleTabChange(step.id)}
											className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
												hasValidationErrors
													? 'border-red-500 bg-red-50 text-red-500'
													: isActive
														? 'border-black bg-black text-white'
														: status === 'complete'
															? 'border-green-500 bg-green-50 text-green-500'
															: isCompleted
																? 'border-black bg-black text-white'
																: 'border-gray-300 bg-white text-gray-500'
											}`}
											aria-current={isActive ? 'step' : undefined}
										>
											<span className="text-sm font-medium">
												{getStepStatusIcon(step.id, isActive, isCompleted) ||
													index + 1}
											</span>
										</button>
									</div>
								</li>
							)
						})}
					</ol>
				</nav>
			</div>

			{tourData.id && !tourData.updated && (
				<div className="mb-4 rounded border border-yellow-200 bg-yellow-50 px-4 py-3 text-yellow-800">
					<div className="flex">
						<div className="flex-shrink-0">
							<svg
								className="h-5 w-5 text-yellow-400"
								viewBox="0 0 20 20"
								fill="currentColor"
							>
								<path
									fillRule="evenodd"
									d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div className="ml-3">
							<h3 className="text-sm font-medium">Tour Initialized</h3>
							<div className="mt-1 text-sm">
								Your tour has been initialized with ID:{' '}
								<span className="font-mono rounded bg-yellow-100 px-1 py-0.5 text-xs">
									{tourData.id}
								</span>
								. Please complete all required information by navigating through
								the tabs below. Your progress will be saved automatically.
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Validation Errors */}
			{hasErrors(activeTab) && (
				<div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-800">
					<div className="flex">
						<div className="flex-shrink-0">
							<AlertCircle className="h-5 w-5 text-red-400" />
						</div>
						<div className="ml-3">
							<h3 className="text-sm font-medium">
								Please fix the following errors:
							</h3>
							<ul className="mt-1 list-inside list-disc text-sm">
								{validationErrors[activeTab]?.map((error, index) => (
									<li key={index}>{error}</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			)}

			{/* Mobile Step Indicator */}
			<div className="sm:hidden">
				<div className="bg-muted grid w-full grid-cols-3 rounded-lg p-1">
					<Button
						variant="ghost"
						onClick={handlePrevious}
						disabled={getCurrentStepIndex() === 0}
						className="h-9 rounded-md px-3"
					>
						<ChevronLeft className="mr-1 h-4 w-4" />
						Previous
					</Button>
					<div className="flex items-center justify-center text-sm font-medium">
						Step {getCurrentStepIndex() + 1}/{steps.length}
					</div>
					<Button
						variant="ghost"
						onClick={handleNext}
						disabled={
							getCurrentStepIndex() === steps.length - 1 || hasErrors(activeTab)
						}
						className="h-9 rounded-md px-3"
					>
						Next
						<ChevronRight className="ml-1 h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Content */}
			<Card className="p-6">
				<Tabs value={activeTab} onValueChange={handleTabChange}>
					<TabsContent value="basic-info">
						<TourBasicInfo
							tourData={tourData}
							updateTourData={updateTourData}
						/>
					</TabsContent>
					<TabsContent value="overview">
						<TourOverview tourData={tourData} updateTourData={updateTourData} />
					</TabsContent>
					<TabsContent value="highlights">
						<TourHighlights
							tourData={tourData}
							updateTourData={updateTourData}
						/>
					</TabsContent>
					<TabsContent value="itinerary">
						<TourItinerary
							tourData={tourData}
							updateTourData={updateTourData}
						/>
					</TabsContent>
					<TabsContent value="pricing">
						<TourPricing tourData={tourData} updateTourData={updateTourData} />
					</TabsContent>
					<TabsContent value="accommodations">
						<TourAccommodations
							tourData={tourData}
							updateTourData={updateTourData}
						/>
					</TabsContent>
					<TabsContent value="images">
						<TourImages tourData={tourData} updateTourData={updateTourData} />
					</TabsContent>
					<TabsContent value="review">
						<TourReview tourData={tourData} />
					</TabsContent>
				</Tabs>
			</Card>

			{/* Navigation Buttons */}
			<div className="flex justify-between">
				<div className="text-muted-foreground text-sm">
					{hasUnsavedChanges ? (
						<span className="flex items-center text-amber-600">
							<AlertCircle className="mr-2 h-4 w-4" />
							You have unsaved changes
						</span>
					) : (
						<span className="flex items-center text-green-600">
							<CheckCircle2 className="mr-2 h-4 w-4" />
							All changes saved
						</span>
					)}
				</div>
				<div className="flex space-x-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleSave}
						disabled={!hasUnsavedChanges || isSaving || !tourData.id}
						className="mr-2 h-9 scale-110 transform text-sm"
					>
						{isSaving ? (
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
								Save
							</>
						)}
					</Button>

					<button
						onClick={handlePrevious}
						disabled={getCurrentStepIndex() === 0}
						className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-50"
					>
						<span className="sr-only">Previous</span>
						<ChevronLeft className="h-4 w-4" />
					</button>

					{getCurrentStepIndex() === steps.length - 1 ? (
						<button
							onClick={handleSubmit}
							disabled={isSubmitting || hasErrors(activeTab)}
							className={`flex h-8 w-8 items-center justify-center rounded-full border ${
								hasErrors(activeTab)
									? 'cursor-not-allowed border-red-300 bg-red-50 text-red-500'
									: 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
							}`}
						>
							<span className="sr-only">Save</span>
							<Save className="h-4 w-4" />
						</button>
					) : (
						<button
							onClick={handleNext}
							disabled={hasErrors(activeTab)}
							className={`flex h-8 w-8 items-center justify-center rounded-full border ${
								hasErrors(activeTab)
									? 'cursor-not-allowed border-red-300 bg-red-50 text-red-500'
									: 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
							}`}
						>
							<span className="sr-only">Next</span>
							<ChevronRight className="h-4 w-4" />
						</button>
					)}
				</div>
			</div>
		</div>
	)
}
