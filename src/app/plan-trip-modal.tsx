'use client'

import { useState, useEffect } from 'react'
import {
	X,
	Calendar,
	MapPin,
	Utensils,
	Camera,
	MountainIcon as Hiking,
	Umbrella,
	Users,
	Hotel,
	UserPlus,
	UserMinus,
	Home,
	Star,
	Group,
	Plus,
	Trash2,
	Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PlanTripModalProps {
	isOpen: boolean
	onClose: () => void
}

type Step =
	| 'country'
	| 'cities-selection'
	| 'duration'
	| 'travelers'
	| 'accommodation'
	| 'groupType'
	| 'tripType'
	| 'itinerary'
	| 'payment'
	| 'confirmation'

interface City {
	name: string
	order: number
}

export function PlanTripModal({ isOpen, onClose }: PlanTripModalProps) {
	const [step, setStep] = useState<Step>('country')
	const [formData, setFormData] = useState({
		country: '',
		duration: '',
		adults: '2',
		children: '0',
		infants: '0',
		accommodation: '',
		groupType: '',
		tripType: '',
		email: '',
		customRequests: '',
		maxBudget: '',
	})

	const [selectedCities, setSelectedCities] = useState<City[]>([])
	const [newCity, setNewCity] = useState('')
	const [suggestedCities, setSuggestedCities] = useState<string[]>([])
	const [isSuggestingCities, setIsSuggestingCities] = useState(false)
	const [cityError, setCityError] = useState<string | null>(null)

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false)
	const [itinerary, setItinerary] = useState<any>(null)
	const [error, setError] = useState<string | null>(null)

	const validateCity = (city: string): boolean => {
		// Basic validation - city should be at least 2 characters
		return city && city.trim().length >= 2
	}

	// Reset the form when the modal is closed
	useEffect(() => {
		if (!isOpen) {
			setStep('country')
			setFormData({
				country: '',
				duration: '',
				adults: '2',
				children: '0',
				infants: '0',
				accommodation: '',
				groupType: '',
				tripType: '',
				email: '',
				customRequests: '',
				maxBudget: '',
			})
			setSelectedCities([])
			setNewCity('')
			setSuggestedCities([])
			setItinerary(null)
			setError(null)
		}
	}, [isOpen])

	if (!isOpen) return null

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
	}

	const addCity = () => {
		if (!newCity.trim()) {
			setCityError('Please enter a city name')
			return
		}

		if (!validateCity(newCity)) {
			setCityError('City name must be at least 2 characters')
			return
		}

		// Check if city already exists
		if (
			selectedCities.some(
				(city) => city.name.toLowerCase() === newCity.toLowerCase(),
			)
		) {
			setCityError('This city is already in your itinerary')
			return
		}

		setCityError(null)
		setSelectedCities([
			...selectedCities,
			{ name: newCity, order: selectedCities.length },
		])
		setNewCity('')
	}

	const removeCity = (index: number) => {
		const updatedCities = selectedCities.filter((_, i) => i !== index)
		// Update order after removal
		const reorderedCities = updatedCities.map((city, i) => ({
			...city,
			order: i,
		}))
		setSelectedCities(reorderedCities)
	}

	const moveCity = (index: number, direction: 'up' | 'down') => {
		if (
			(direction === 'up' && index === 0) ||
			(direction === 'down' && index === selectedCities.length - 1)
		) {
			return
		}

		const newCities = [...selectedCities]
		const swapIndex = direction === 'up' ? index - 1 : index + 1

		// Swap the cities
		;[newCities[index], newCities[swapIndex]] = [
			newCities[swapIndex],
			newCities[index],
		]

		// Update order
		const reorderedCities = newCities.map((city, i) => ({ ...city, order: i }))
		setSelectedCities(reorderedCities)
	}

	const suggestCities = async () => {
		if (!formData.country) {
			setError('Please select a country first')
			return
		}

		setIsSuggestingCities(true)
		setSuggestedCities([])

		try {
			const response = await fetch('/api/suggest-cities', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					country: formData.country,
					existingCities: selectedCities.map((city) => city.name),
				}),
			})

			if (!response.ok) {
				throw new Error('Failed to get city suggestions')
			}

			const data = await response.json()

			if (data.success && data.cities && data.cities.length > 0) {
				setSuggestedCities(data.cities)
			} else {
				// Fallback suggestions if API fails
				const fallbackSuggestions = {
					morocco: [
						'Marrakech',
						'Fes',
						'Casablanca',
						'Chefchaouen',
						'Essaouira',
						'Merzouga',
						'Rabat',
					],
					spain: [
						'Madrid',
						'Barcelona',
						'Seville',
						'Valencia',
						'Granada',
						'Malaga',
						'Bilbao',
					],
					france: [
						'Paris',
						'Nice',
						'Lyon',
						'Marseille',
						'Bordeaux',
						'Strasbourg',
						'Toulouse',
					],
					italy: [
						'Rome',
						'Florence',
						'Venice',
						'Milan',
						'Naples',
						'Turin',
						'Bologna',
					],
					portugal: [
						'Lisbon',
						'Porto',
						'Faro',
						'Coimbra',
						'Braga',
						'Aveiro',
						'Sintra',
					],
				}[formData.country] || [
					'City 1',
					'City 2',
					'City 3',
					'City 4',
					'City 5',
				]

				setSuggestedCities(fallbackSuggestions)
			}
		} catch (error) {
			console.error('Error suggesting cities:', error)
			setError('Failed to get city suggestions. Please try again.')
		} finally {
			setIsSuggestingCities(false)
		}
	}

	const nextStep = () => {
		switch (step) {
			case 'country':
				setStep('cities-selection')
				break
			case 'cities-selection':
				if (selectedCities.length < 2) {
					setError('Please select at least 2 cities for your itinerary')
					return
				}
				setError(null)
				setStep('duration')
				break
			case 'duration':
				setStep('travelers')
				break
			case 'travelers':
				setStep('accommodation')
				break
			case 'accommodation':
				setStep('groupType')
				break
			case 'groupType':
				setStep('tripType')
				break
			case 'tripType':
				generateItinerary()
				break
			case 'itinerary':
				setStep('payment')
				break
			case 'payment':
				handleSubmit()
				break
			default:
				break
		}
	}

	const prevStep = () => {
		switch (step) {
			case 'cities-selection':
				setStep('country')
				break
			case 'duration':
				setStep('cities-selection')
				break
			case 'travelers':
				setStep('duration')
				break
			case 'accommodation':
				setStep('travelers')
				break
			case 'groupType':
				setStep('accommodation')
				break
			case 'tripType':
				setStep('groupType')
				break
			case 'itinerary':
				setStep('tripType')
				break
			case 'payment':
				setStep('itinerary')
				break
			default:
				break
		}
	}

	const generateItinerary = async () => {
		// Validate that we have cities
		if (selectedCities.length < 2) {
			setError('Please select at least 2 cities for your itinerary')
			return
		}

		setIsGeneratingItinerary(true)
		setError(null)

		try {
			// Call the API to generate the itinerary
			const response = await fetch('/api/generate-itinerary', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					country: formData.country,
					cities: selectedCities.map((city) => city.name),
					duration: formData.duration,
					adults: formData.adults,
					children: formData.children,
					infants: formData.infants,
					accommodation: formData.accommodation,
					groupType: formData.groupType,
					tripType: formData.tripType,
					customRequests: formData.customRequests,
				}),
			})

			if (!response.ok) {
				throw new Error(`API error: ${response.status}`)
			}

			const data = await response.json()

			if (!data.success) {
				throw new Error(data.message || 'Failed to generate itinerary')
			}

			setItinerary(data.itinerary)
			setStep('itinerary')
		} catch (error) {
			console.error('Error generating itinerary:', error)
			setError(
				'We encountered an error while generating your itinerary. Please try again.',
			)
		} finally {
			setIsGeneratingItinerary(false)
		}
	}

	const handleSubmit = async () => {
		setIsSubmitting(true)

		// Simulate API call
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000))
			setIsSubmitted(true)
			setStep('confirmation')
		} catch (error) {
			console.error('Error submitting form:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	// Prevent scrolling when modal is open
	if (typeof window !== 'undefined') {
		document.body.style.overflow = isOpen ? 'hidden' : 'auto'
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
			<div
				className="relative my-8 w-full max-w-md rounded-lg bg-white shadow-xl"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute right-4 top-4 z-10 text-gray-500 hover:text-gray-700"
				>
					<X size={24} />
				</button>

				<div className="flex h-full flex-col">
					{/* Header */}
					<div className="bg-black p-6 text-white">
						<h2 className="text-2xl font-bold">Plan Your Trip with AI</h2>
						<p className="mt-2 text-gray-300">
							Let our AI help you create the perfect travel experience
						</p>
					</div>

					{/* Content */}
					<div className="max-h-[60vh] overflow-y-auto p-6">
						{error && (
							<Alert variant="destructive" className="mb-4">
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{step === 'country' && (
							<div className="space-y-4">
								<h3 className="text-xl font-semibold">
									Where would you like to go?
								</h3>
								<p className="text-gray-600">
									Select the country you want to visit
								</p>

								<Select
									value={formData.country}
									onValueChange={(value) => handleInputChange('country', value)}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select a country" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="morocco">Morocco</SelectItem>
										<SelectItem value="spain">Spain</SelectItem>
										<SelectItem value="france">France</SelectItem>
										<SelectItem value="italy">Italy</SelectItem>
										<SelectItem value="portugal">Portugal</SelectItem>
										<SelectItem value="other">
											Other (specify in notes)
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}

						{step === 'cities-selection' && (
							<div className="space-y-4">
								<h3 className="text-xl font-semibold">
									Select Cities to Visit
								</h3>
								<p className="text-gray-600">
									Add the cities you want to visit in order. This will be your
									travel route.
								</p>

								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<Input
											placeholder="Enter a city name"
											value={newCity}
											onChange={(e) => {
												setNewCity(e.target.value)
												setCityError(null)
											}}
											className={cityError ? 'border-red-300' : ''}
										/>
										<Button
											onClick={addCity}
											size="icon"
											className="shrink-0 bg-black hover:bg-gray-800"
										>
											<Plus size={18} />
										</Button>
									</div>

									{cityError && (
										<p className="text-sm text-red-500">{cityError}</p>
									)}

									<div className="flex items-center justify-between">
										<p className="text-sm text-gray-500">
											Not sure which cities to visit?
										</p>
										<Button
											variant="outline"
											size="sm"
											onClick={suggestCities}
											disabled={isSuggestingCities || !formData.country}
											className="flex items-center gap-1 text-xs"
										>
											{isSuggestingCities ? (
												<>
													<div className="mr-1 h-3 w-3 animate-spin rounded-full border-t-2 border-black"></div>
													Suggesting...
												</>
											) : (
												<>
													<Sparkles size={14} />
													Suggest Cities
												</>
											)}
										</Button>
									</div>

									{suggestedCities.length > 0 && (
										<div className="mt-2">
											<p className="mb-2 text-sm font-medium">
												Suggested cities in {formData.country}:
											</p>
											<div className="flex flex-wrap gap-2">
												{suggestedCities.map((city, index) => (
													<Button
														key={index}
														variant="outline"
														size="sm"
														className="text-xs"
														onClick={() => {
															setNewCity(city)
															setCityError(null)
														}}
													>
														{city}
													</Button>
												))}
											</div>
										</div>
									)}

									{selectedCities.length > 0 && (
										<div className="mt-4">
											<p className="mb-2 font-medium">Your travel route:</p>
											<div className="max-h-60 space-y-2 overflow-y-auto rounded-md border p-2">
												{selectedCities.map((city, index) => (
													<div
														key={index}
														className="flex items-center justify-between rounded bg-gray-50 p-2"
													>
														<div className="flex items-center gap-2">
															<span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white">
																{index + 1}
															</span>
															<span>{city.name}</span>
														</div>
														<div className="flex items-center gap-1">
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8"
																onClick={() => moveCity(index, 'up')}
																disabled={index === 0}
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	width="16"
																	height="16"
																	viewBox="0 0 24 24"
																	fill="none"
																	stroke="currentColor"
																	strokeWidth="2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																>
																	<path d="m18 15-6-6-6 6" />
																</svg>
															</Button>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8"
																onClick={() => moveCity(index, 'down')}
																disabled={index === selectedCities.length - 1}
															>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	width="16"
																	height="16"
																	viewBox="0 0 24 24"
																	fill="none"
																	stroke="currentColor"
																	strokeWidth="2"
																	strokeLinecap="round"
																	strokeLinejoin="round"
																>
																	<path d="m6 9 6 6 6-6" />
																</svg>
															</Button>
															<Button
																variant="ghost"
																size="icon"
																className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
																onClick={() => removeCity(index)}
															>
																<Trash2 size={16} />
															</Button>
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</div>
						)}

						{step === 'duration' && (
							<div className="space-y-4">
								<h3 className="text-xl font-semibold">Trip Duration</h3>
								<p className="text-gray-600">
									How many days would you like to travel?
								</p>

								<div className="grid grid-cols-2 gap-2">
									{[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 21].map(
										(days) => (
											<div
												key={days}
												className={`cursor-pointer rounded-md border p-3 text-center hover:bg-gray-50 ${
													formData.duration === days.toString()
														? 'border-black bg-gray-50'
														: ''
												}`}
												onClick={() =>
													handleInputChange('duration', days.toString())
												}
											>
												<span>{days} days</span>
											</div>
										),
									)}
								</div>

								<div className="mt-4">
									<Label htmlFor="custom-duration">
										Or enter exact number of days:
									</Label>
									<Input
										id="custom-duration"
										type="number"
										min="1"
										max="30"
										placeholder="Enter number of days"
										value={formData.duration}
										onChange={(e) =>
											handleInputChange('duration', e.target.value)
										}
										className="mt-1"
									/>
								</div>
							</div>
						)}

						{step === 'travelers' && (
							<div className="space-y-4">
								<h3 className="text-xl font-semibold">Travelers</h3>
								<p className="text-gray-600">
									How many people will be traveling?
								</p>

								<div className="space-y-4">
									<div className="flex items-center justify-between rounded-md border p-3">
										<div className="flex items-center gap-2">
											<Users size={18} />
											<span>Adults</span>
											<span className="text-xs text-gray-500">(18+ years)</span>
										</div>
										<div className="flex items-center">
											<button
												type="button"
												className="flex h-8 w-8 items-center justify-center rounded-l-md border hover:bg-gray-100"
												onClick={() => {
													const current = Number.parseInt(formData.adults) || 0
													if (current > 1) {
														handleInputChange(
															'adults',
															(current - 1).toString(),
														)
													}
												}}
											>
												<UserMinus size={16} />
											</button>
											<input
												type="number"
												min="1"
												max="20"
												className="h-8 w-10 border-y text-center"
												value={formData.adults}
												onChange={(e) =>
													handleInputChange('adults', e.target.value)
												}
											/>
											<button
												type="button"
												className="flex h-8 w-8 items-center justify-center rounded-r-md border hover:bg-gray-100"
												onClick={() => {
													const current = Number.parseInt(formData.adults) || 0
													handleInputChange('adults', (current + 1).toString())
												}}
											>
												<UserPlus size={16} />
											</button>
										</div>
									</div>

									<div className="flex items-center justify-between rounded-md border p-3">
										<div className="flex items-center gap-2">
											<Users size={18} />
											<span>Children</span>
											<span className="text-xs text-gray-500">
												(2-17 years)
											</span>
										</div>
										<div className="flex items-center">
											<button
												type="button"
												className="flex h-8 w-8 items-center justify-center rounded-l-md border hover:bg-gray-100"
												onClick={() => {
													const current =
														Number.parseInt(formData.children) || 0
													if (current > 0) {
														handleInputChange(
															'children',
															(current - 1).toString(),
														)
													}
												}}
											>
												<UserMinus size={16} />
											</button>
											<input
												type="number"
												min="0"
												max="10"
												className="h-8 w-10 border-y text-center"
												value={formData.children}
												onChange={(e) =>
													handleInputChange('children', e.target.value)
												}
											/>
											<button
												type="button"
												className="flex h-8 w-8 items-center justify-center rounded-r-md border hover:bg-gray-100"
												onClick={() => {
													const current =
														Number.parseInt(formData.children) || 0
													handleInputChange(
														'children',
														(current + 1).toString(),
													)
												}}
											>
												<UserPlus size={16} />
											</button>
										</div>
									</div>

									<div className="flex items-center justify-between rounded-md border p-3">
										<div className="flex items-center gap-2">
											<Users size={18} />
											<span>Infants</span>
											<span className="text-xs text-gray-500">(0-2 years)</span>
										</div>
										<div className="flex items-center">
											<button
												type="button"
												className="flex h-8 w-8 items-center justify-center rounded-l-md border hover:bg-gray-100"
												onClick={() => {
													const current = Number.parseInt(formData.infants) || 0
													if (current > 0) {
														handleInputChange(
															'infants',
															(current - 1).toString(),
														)
													}
												}}
											>
												<UserMinus size={16} />
											</button>
											<input
												type="number"
												min="0"
												max="5"
												className="h-8 w-10 border-y text-center"
												value={formData.infants}
												onChange={(e) =>
													handleInputChange('infants', e.target.value)
												}
											/>
											<button
												type="button"
												className="flex h-8 w-8 items-center justify-center rounded-r-md border hover:bg-gray-100"
												onClick={() => {
													const current = Number.parseInt(formData.infants) || 0
													handleInputChange('infants', (current + 1).toString())
												}}
											>
												<UserPlus size={16} />
											</button>
										</div>
									</div>
								</div>
							</div>
						)}

						{step === 'accommodation' && (
							<div className="space-y-4">
								<h3 className="text-xl font-semibold">
									Accommodation Preference
								</h3>
								<p className="text-gray-600">
									What type of accommodation would you prefer?
								</p>

								<div className="grid grid-cols-1 gap-3">
									<div
										className={`cursor-pointer rounded-md border p-4 hover:bg-gray-50 ${
											formData.accommodation === 'standard'
												? 'border-black bg-gray-50'
												: ''
										}`}
										onClick={() =>
											handleInputChange('accommodation', 'standard')
										}
									>
										<div className="flex items-center gap-2">
											<Home size={20} />
											<span className="font-medium">Standard</span>
										</div>
										<p className="mt-1 pl-7 text-sm text-gray-600">
											Comfortable 3-4 star hotels and quality local
											accommodations
										</p>
									</div>

									<div
										className={`cursor-pointer rounded-md border p-4 hover:bg-gray-50 ${
											formData.accommodation === 'luxury'
												? 'border-black bg-gray-50'
												: ''
										}`}
										onClick={() => handleInputChange('accommodation', 'luxury')}
									>
										<div className="flex items-center gap-2">
											<Star size={20} />
											<span className="font-medium">Luxury</span>
										</div>
										<p className="mt-1 pl-7 text-sm text-gray-600">
											Premium 5-star hotels, luxury riads, and boutique
											properties
										</p>
									</div>
								</div>
							</div>
						)}

						{step === 'groupType' && (
							<div className="space-y-4">
								<h3 className="text-xl font-semibold">Tour Type</h3>
								<p className="text-gray-600">
									Would you prefer a private tour or to join a small group?
								</p>

								<div className="grid grid-cols-1 gap-3">
									<div
										className={`cursor-pointer rounded-md border p-4 hover:bg-gray-50 ${
											formData.groupType === 'private'
												? 'border-black bg-gray-50'
												: ''
										}`}
										onClick={() => handleInputChange('groupType', 'private')}
									>
										<div className="flex items-center gap-2">
											<Users size={20} />
											<span className="font-medium">Private Tour</span>
										</div>
										<p className="mt-1 pl-7 text-sm text-gray-600">
											Exclusive tour just for you and your travel companions
										</p>
									</div>

									<div
										className={`cursor-pointer rounded-md border p-4 hover:bg-gray-50 ${
											formData.groupType === 'group'
												? 'border-black bg-gray-50'
												: ''
										}`}
										onClick={() => handleInputChange('groupType', 'group')}
									>
										<div className="flex items-center gap-2">
											<Group size={20} />
											<span className="font-medium">Small Group Tour</span>
										</div>
										<p className="mt-1 pl-7 text-sm text-gray-600">
											Join a small group of like-minded travelers (max 12
											people)
										</p>
									</div>
								</div>
							</div>
						)}

						{step === 'tripType' && (
							<div className="space-y-3">
								<h3 className="text-xl font-semibold">Trip Type</h3>
								<p className="mb-2 text-gray-600">
									What kind of experience are you looking for?
								</p>

								<div className="space-y-2">
									{[
										{
											id: 'cultural',
											label: 'Cultural & Historical',
											icon: <Camera size={16} />,
										},
										{
											id: 'adventure',
											label: 'Adventure & Outdoor',
											icon: <Hiking size />,
										},
										{
											id: 'adventure',
											label: 'Adventure & Outdoor',
											icon: <Hiking size={16} />,
										},
										{
											id: 'relaxation',
											label: 'Relaxation & Wellness',
											icon: <Umbrella size={16} />,
										},
										{
											id: 'food',
											label: 'Food & Culinary',
											icon: <Utensils size={16} />,
										},
										{
											id: 'mixed',
											label: 'Mix of Everything',
											icon: <Camera size={16} />,
										},
									].map((option) => (
										<div
											key={option.id}
											className="flex cursor-pointer items-center space-x-2 rounded-md border p-2 hover:bg-gray-50"
											onClick={() => handleInputChange('tripType', option.id)}
										>
											<div
												className={`flex h-4 w-4 items-center justify-center rounded-full border ${formData.tripType === option.id ? 'border-black' : 'border-gray-300'}`}
											>
												{formData.tripType === option.id && (
													<div className="h-2 w-2 rounded-full bg-black" />
												)}
											</div>
											<span className="flex items-center gap-1">
												{option.icon}
												{option.label}
											</span>
										</div>
									))}
								</div>

								<div className="mt-3">
									<Label htmlFor="custom-requests">Any special requests?</Label>
									<Textarea
										id="custom-requests"
										placeholder="Tell us any specific activities, interests, or requirements"
										value={formData.customRequests}
										onChange={(e) =>
											handleInputChange('customRequests', e.target.value)
										}
										rows={2}
									/>
								</div>
							</div>
						)}

						{step === 'itinerary' && itinerary && (
							<div className="space-y-4">
								<h3 className="text-xl font-semibold">{itinerary.title}</h3>
								<p className="text-gray-600">{itinerary.subtitle}</p>

								<div className="mt-2 flex flex-col gap-2 text-sm text-gray-600">
									<div className="flex items-center gap-2">
										<MapPin size={16} />
										<span>
											Cities:{' '}
											{selectedCities.map((city) => city.name).join(' → ')}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Users size={16} />
										<span>
											Travelers: {itinerary.travelers.adults} adults
											{itinerary.travelers.children > 0
												? `, ${itinerary.travelers.children} children`
												: ''}
											{itinerary.travelers.infants > 0
												? `, ${itinerary.travelers.infants} infants`
												: ''}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Hotel size={16} />
										<span>
											Accommodation:{' '}
											{itinerary.accommodation === 'luxury'
												? 'Luxury'
												: 'Standard'}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<Group size={16} />
										<span>
											Tour Type:{' '}
											{itinerary.isPrivate
												? 'Private tour'
												: 'Small group tour'}
										</span>
									</div>
								</div>

								<div className="mt-4 space-y-3">
									{itinerary.days.map((day) => (
										<div key={day.day} className="rounded-md border p-3">
											<div className="flex items-center gap-2 font-medium">
												<Calendar size={16} />
												<span>Day {day.day}</span>
											</div>
											<div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
												<MapPin size={14} />
												<span>{day.city}</span>
											</div>
											<ul className="mt-2 space-y-1">
												{day.activities.map((activity, i) => (
													<li key={i} className="relative pl-5 text-sm">
														<span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-black"></span>
														{activity}
													</li>
												))}
											</ul>
										</div>
									))}
								</div>

								<div className="mt-4 rounded-lg bg-gray-100 p-4">
									<div className="flex items-center justify-between">
										<span className="font-medium">Total Price:</span>
										<span className="text-lg font-bold">
											€{itinerary.price.basePrice}
										</span>
									</div>
									<div className="mt-1 flex items-center justify-between text-sm text-gray-600">
										<span>Per person:</span>
										<span>€{itinerary.price.perPerson}</span>
									</div>
									<p className="mt-2 text-sm text-gray-600">
										This is an estimate based on your preferences. The final
										price may vary based on accommodation choices, activities,
										and travel dates.
									</p>
								</div>
							</div>
						)}

						{step === 'payment' && (
							<div className="space-y-4">
								<h3 className="text-xl font-semibold">
									Confirm Your Trip Plan
								</h3>
								<p className="text-gray-600">
									To secure this itinerary, we require a €50 deposit. This
									amount will be credited toward your final booking.
								</p>

								<div className="rounded-lg bg-gray-100 p-4">
									<div className="flex items-center justify-between">
										<span>Deposit Amount:</span>
										<span className="font-bold">€50</span>
									</div>
									<div className="mt-1 flex items-center justify-between">
										<span>Estimated Trip Cost:</span>
										<span>€{itinerary?.price.basePrice || '1,200+'}</span>
									</div>
								</div>

								<div className="mt-4 space-y-2">
									<Label htmlFor="max-budget">
										What's your maximum budget for this trip?
									</Label>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2">
											€
										</span>
										<Input
											id="max-budget"
											type="number"
											min="0"
											placeholder="Enter your maximum budget"
											value={formData.maxBudget}
											onChange={(e) =>
												handleInputChange('maxBudget', e.target.value)
											}
											className="pl-8"
										/>
									</div>
									<p className="text-sm text-gray-500">
										If our final price is within your budget, we'll proceed with
										your booking. If not, we'll send you a custom offer for your
										approval.
									</p>
								</div>

								<div className="mt-4 space-y-2">
									<Label htmlFor="email">Your email address</Label>
									<Input
										id="email"
										type="email"
										placeholder="your@email.com"
										value={formData.email}
										onChange={(e) => handleInputChange('email', e.target.value)}
									/>
								</div>

								<div className="mt-4 rounded-lg bg-gray-100 p-4">
									<p className="text-sm text-gray-600">
										By proceeding, you agree to pay a €50 deposit. Our travel
										expert will contact you within 24 hours to finalize your
										booking. The deposit is fully refundable if you decide not
										to proceed.
									</p>
								</div>
							</div>
						)}

						{step === 'confirmation' && (
							<div className="space-y-4 text-center">
								<div className="py-6">
									<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-8 w-8 text-green-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									</div>
								</div>

								<h3 className="text-xl font-semibold">
									Your Trip is Reserved!
								</h3>
								<p className="text-gray-600">
									We've received your €50 deposit. Our travel expert will
									contact you at {formData.email} within 24 hours to finalize
									your booking details.
								</p>

								<div className="mt-4 rounded-lg bg-gray-100 p-4 text-left">
									<div className="flex justify-between">
										<span>Deposit Paid:</span>
										<span className="font-medium">€50</span>
									</div>
									<div className="mt-1 flex justify-between">
										<span>Estimated Trip Cost:</span>
										<span className="font-medium">
											€{itinerary?.price.basePrice || 1200}
										</span>
									</div>
									<div className="mt-1 flex justify-between">
										<span>Your Maximum Budget:</span>
										<span className="font-medium">
											€{formData.maxBudget || 'Not specified'}
										</span>
									</div>
									<div className="mt-2 text-sm">
										{Number(formData.maxBudget) >=
										(itinerary?.price.basePrice || 1200) ? (
											<p className="text-green-600">
												Good news! Your budget meets our estimated price. We'll
												proceed with your booking.
											</p>
										) : Number(formData.maxBudget) > 0 ? (
											<p className="text-amber-600">
												We'll prepare a custom offer within your budget for your
												approval.
											</p>
										) : (
											<p>
												We'll contact you with detailed pricing information.
											</p>
										)}
									</div>
								</div>
							</div>
						)}

						{isGeneratingItinerary && (
							<div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white bg-opacity-90">
								<div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-black"></div>
								<p className="text-lg font-medium">
									Generating Your Itinerary...
								</p>
								<p className="mt-2 text-sm text-gray-500">
									Our AI is creating a personalized trip plan based on your
									preferences
								</p>
							</div>
						)}
					</div>

					{/* Footer with buttons */}
					{step !== 'confirmation' && (
						<div className="flex justify-between border-t border-gray-200 p-6">
							{step !== 'country' ? (
								<Button variant="outline" onClick={prevStep}>
									Back
								</Button>
							) : (
								<div></div>
							)}

							<Button
								onClick={nextStep}
								disabled={
									(step === 'country' && !formData.country) ||
									(step === 'cities-selection' && selectedCities.length < 2) ||
									(step === 'duration' && !formData.duration) ||
									(step === 'travelers' &&
										Number.parseInt(formData.adults) < 1) ||
									(step === 'accommodation' && !formData.accommodation) ||
									(step === 'groupType' && !formData.groupType) ||
									(step === 'tripType' && !formData.tripType) ||
									(step === 'payment' &&
										(!formData.email || !formData.maxBudget)) ||
									isSubmitting ||
									isGeneratingItinerary
								}
								className={cn(
									'bg-black text-white hover:bg-gray-800',
									(isSubmitting || isGeneratingItinerary) &&
										'cursor-not-allowed opacity-70',
								)}
							>
								{step === 'tripType'
									? isGeneratingItinerary
										? 'Generating...'
										: 'Generate Itinerary'
									: step === 'payment'
										? isSubmitting
											? 'Processing...'
											: 'Pay €50 Deposit'
										: step === 'itinerary'
											? 'Proceed to Payment'
											: 'Continue'}
							</Button>
						</div>
					)}

					{step === 'confirmation' && (
						<div className="border-t border-gray-200 p-6">
							<Button
								onClick={onClose}
								className="w-full bg-black text-white hover:bg-gray-800"
							>
								Close
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
