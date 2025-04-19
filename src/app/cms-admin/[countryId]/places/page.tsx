'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from '@/components/ui/card'
import {
	Loader2,
	Plus,
	ArrowLeft,
	MapPin,
	Trash2,
	AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// Function to validate image URL
const isValidImageUrl = (url: string) => {
	// Basic URL validation - allow URLs with query parameters
	const urlPattern =
		/^(https?:\/\/)([\w.-]+)\.([a-z]{2,})(\/[\w.-]*)*(\?[^#]*)?(#.*)?$/i
	if (!urlPattern.test(url)) return false

	// Check if URL contains common image indicators
	const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
	const imageKeywords = ['photo', 'image', 'picture', 'img', 'pexels']

	return (
		imageExtensions.some((ext) => url.toLowerCase().includes(ext)) ||
		imageKeywords.some((keyword) => url.toLowerCase().includes(keyword))
	)
}

export default function CountryPlacesAdmin({
	params,
}: {
	params: { countryId: string }
}) {
	const { countryId } = params
	const [places, setPlaces] = useState<any[]>([])
	const [cities, setCities] = useState<any[]>([])
	const [loading, setLoading] = useState(true)
	const [countryName, setCountryName] = useState<string>('')
	const [savingImageFor, setSavingImageFor] = useState<string | null>(null)
	const [newImageUrls, setNewImageUrls] = useState<Record<string, string>>({})
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string>
	>({})
	const [successMessages, setSuccessMessages] = useState<
		Record<string, string>
	>({})
	const [selectedCity, setSelectedCity] = useState<string>('all')
	const [updatingCityFor, setUpdatingCityFor] = useState<string | null>(null)
	const [deletingPlace, setDeletingPlace] = useState<string | null>(null)
	const [placeToDelete, setPlaceToDelete] = useState<string | null>(null)
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

	// Update the useEffect to use the updated API endpoint
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)
			try {
				// Fetch country, cities, and places data in one request
				const response = await fetch(
					`/api/countries/placesByCountry/${countryId}`,
				)
				const data = await response.json()

				if (data.country && data.country.name) {
					setCountryName(data.country.name)
				}

				if (data.cities && Array.isArray(data.cities)) {
					setCities(data.cities)
				}

				if (data.places && Array.isArray(data.places)) {
					setPlaces(data.places)
				}
			} catch (error) {
				console.error('Error fetching data:', error)
			} finally {
				setLoading(false)
			}
		}

		if (countryId) {
			fetchData()
		}
	}, [countryId])

	// Handle new image URL input change
	const handleImageUrlChange = (id: string, url: string) => {
		setNewImageUrls((prev) => ({ ...prev, [id]: url }))

		// Clear validation error if it exists
		if (validationErrors[id]) {
			setValidationErrors((prev) => {
				const updated = { ...prev }
				delete updated[id]
				return updated
			})
		}
	}

	// Save image URL to database
	const saveImageUrl = async (id: string, url: string) => {
		// Validate URL
		if (!url.trim()) {
			setValidationErrors((prev) => ({ ...prev, [id]: 'URL cannot be empty' }))
			return
		}

		if (!isValidImageUrl(url)) {
			setValidationErrors((prev) => ({
				...prev,
				[id]: 'Please enter a valid image URL',
			}))
			return
		}

		setSavingImageFor(id)

		try {
			// Update the place with the new image URL
			await fetch('/api/update-place-image', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id,
					imageUrl: url,
				}),
			})

			// Update the UI to show the new image
			setPlaces((prev) =>
				prev.map((place) => {
					if (place.id === id) {
						return {
							...place,
							image: {
								...place.image,
								uploadFrom: url,
							},
						}
					}
					return place
				}),
			)

			// Clear the input
			setNewImageUrls((prev) => {
				const updated = { ...prev }
				delete updated[id]
				return updated
			})

			// Show success message
			setSuccessMessages((prev) => ({
				...prev,
				[id]: 'Image added successfully!',
			}))

			// Clear success message after 3 seconds
			setTimeout(() => {
				setSuccessMessages((prev) => {
					const updated = { ...prev }
					delete updated[id]
					return updated
				})
			}, 3000)
		} catch (error) {
			console.error('Error saving image URL:', error)
			setValidationErrors((prev) => ({
				...prev,
				[id]: 'Failed to save image URL',
			}))
		} finally {
			setSavingImageFor(null)
		}
	}

	// Update city for a place
	const updatePlaceCity = async (placeId: string, cityId: string | null) => {
		setUpdatingCityFor(placeId)

		try {
			// Update the place with the new city ID
			await fetch('/api/update-place-city', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					placeId,
					cityId,
				}),
			})

			// Update the UI to show the new city
			setPlaces((prev) =>
				prev.map((place) => {
					if (place.id === placeId) {
						// Find the city name if cityId is provided
						const cityName = cityId
							? cities.find((city) => city.id === cityId)?.name ||
								'Unknown City'
							: null

						return {
							...place,
							cityId: cityId,
							cityName: cityName || 'No City',
						}
					}
					return place
				}),
			)

			// Show success message
			setSuccessMessages((prev) => ({
				...prev,
				[placeId]: cityId
					? 'City updated successfully!'
					: 'City removed successfully!',
			}))

			// Clear success message after 3 seconds
			setTimeout(() => {
				setSuccessMessages((prev) => {
					const updated = { ...prev }
					delete updated[placeId]
					return updated
				})
			}, 3000)
		} catch (error) {
			console.error('Error updating city:', error)
			setValidationErrors((prev) => ({
				...prev,
				[placeId]: 'Failed to update city',
			}))
		} finally {
			setUpdatingCityFor(null)
		}
	}

	// Open delete confirmation dialog
	const confirmDeletePlace = (placeId: string) => {
		setPlaceToDelete(placeId)
		setDeleteDialogOpen(true)
	}

	// Delete a place
	const deletePlace = async () => {
		if (!placeToDelete) return

		setDeletingPlace(placeToDelete)
		setDeleteDialogOpen(false)

		try {
			// Delete the place
			await fetch('/api/delete-place', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					placeId: placeToDelete,
				}),
			})

			// Remove the place from the UI
			setPlaces((prev) => prev.filter((place) => place.id !== placeToDelete))

			// Show temporary success message
			setSuccessMessages((prev) => ({
				...prev,
				global: 'Place deleted successfully!',
			}))

			// Clear success message after 3 seconds
			setTimeout(() => {
				setSuccessMessages((prev) => {
					const updated = { ...prev }
					delete updated.global
					return updated
				})
			}, 3000)
		} catch (error) {
			console.error('Error deleting place:', error)
			setValidationErrors((prev) => ({
				...prev,
				global: 'Failed to delete place',
			}))

			// Clear error message after 5 seconds
			setTimeout(() => {
				setValidationErrors((prev) => {
					const updated = { ...prev }
					delete updated.global
					return updated
				})
			}, 5000)
		} finally {
			setDeletingPlace(null)
			setPlaceToDelete(null)
		}
	}

	// Filter places based on selected city
	const filteredPlaces =
		selectedCity === 'all'
			? places
			: places.filter((place) => place.cityId === selectedCity)

	return (
		<div className="container mx-auto py-8">
			<div className="mb-6 flex items-center gap-2">
				<Link href="/cmd-admin" className="hover:text-primary">
					<ArrowLeft className="h-5 w-5" />
				</Link>
				<h1 className="text-3xl font-bold">
					Places in {countryName || countryId}
				</h1>
			</div>

			{/* Global success/error messages */}
			{successMessages.global && (
				<div className="mb-4 rounded-md bg-green-50 p-4 text-green-700">
					<p>{successMessages.global}</p>
				</div>
			)}

			{validationErrors.global && (
				<div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 p-4 text-red-700">
					<AlertCircle className="h-5 w-5" />
					<p>{validationErrors.global}</p>
				</div>
			)}

			{loading ? (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin" />
					<span className="ml-2">Loading places...</span>
				</div>
			) : (
				<>
					{/* City filter */}
					{cities.length > 0 && (
						<div className="mb-6">
							<label
								htmlFor="city-filter"
								className="mb-2 block text-sm font-medium"
							>
								Filter by City
							</label>
							<Select value={selectedCity} onValueChange={setSelectedCity}>
								<SelectTrigger className="w-[200px] bg-white" id="city-filter">
									<SelectValue placeholder="Select a city" />
								</SelectTrigger>
								<SelectContent className="bg-white">
									<SelectItem value="all">All Cities</SelectItem>
									{cities.map((city) => (
										<SelectItem key={city.id} value={city.id}>
											{city.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					{filteredPlaces.length > 0 ? (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{filteredPlaces.map((place) => (
								<Card key={place.id} className="overflow-hidden">
									<CardHeader className="pb-2">
										<CardTitle className="flex items-center justify-between">
											<div>
												<span>{place.name}</span>
												<span className="bg-muted ml-2 rounded-full px-2 py-1 text-xs">
													{place.category}
												</span>
											</div>
										</CardTitle>
										<div className="text-muted-foreground flex items-center text-xs">
											<MapPin className="mr-1 h-3 w-3" />
											{place.cityName}
										</div>
									</CardHeader>

									<CardContent>
										{/* Display existing image */}
										<div className="mb-4">
											<h4 className="mb-2 text-sm font-medium">
												{place.image ? 'Current Image' : 'No Image'}
											</h4>
											{place.image ? (
												<div className="aspect-video relative overflow-hidden rounded-md border">
													{place.image.url ? (
														<Image
															src={place.image.url || '/placeholder.svg'}
															alt={`${place.name} image`}
															width={200}
															height={200}
															className="object-cover"
														/>
													) : (
														<div className="bg-muted flex h-full items-center justify-center">
															<span className="text-muted-foreground break-all px-2 text-xs">
																{place.image.uploadFrom || 'No image URL'}
															</span>
														</div>
													)}
												</div>
											) : (
												<div className="bg-muted aspect-video flex items-center justify-center rounded-md border">
													<span className="text-muted-foreground text-sm">
														No image
													</span>
												</div>
											)}
										</div>

										{/* Brief description */}
										{place.description && (
											<div className="mb-4">
												<h4 className="mb-1 text-sm font-medium">
													Description
												</h4>
												<p className="text-muted-foreground line-clamp-3 text-sm">
													{place.description}
												</p>
											</div>
										)}

										{/* Add/Update image */}
										<div className="space-y-2">
											<h4 className="text-sm font-medium">
												{place.image ? 'Update Image' : 'Add Image'}
											</h4>

											<div className="flex gap-2">
												<Input
													type="url"
													placeholder="Enter image URL"
													value={newImageUrls[place.id] || ''}
													onChange={(e) =>
														handleImageUrlChange(place.id, e.target.value)
													}
													className={
														validationErrors[place.id] ? 'border-red-500' : ''
													}
												/>

												<Button
													size="sm"
													onClick={() =>
														saveImageUrl(place.id, newImageUrls[place.id] || '')
													}
													disabled={savingImageFor === place.id}
												>
													{savingImageFor === place.id ? (
														<Loader2 className="h-4 w-4 animate-spin" />
													) : (
														<Plus className="h-4 w-4" />
													)}
												</Button>
											</div>

											{validationErrors[place.id] && (
												<p className="text-xs text-red-500">
													{validationErrors[place.id]}
												</p>
											)}

											{successMessages[place.id] && (
												<p className="text-xs text-green-500">
													{successMessages[place.id]}
												</p>
											)}
										</div>

										{/* City selection */}
										<div className="mt-4 space-y-2">
											<h4 className="text-sm font-medium">City Assignment</h4>
											<div className="flex gap-2">
												<Select
													value={place.cityId || 'none'}
													onValueChange={(value) =>
														updatePlaceCity(
															place.id,
															value === 'none' ? null : value,
														)
													}
													disabled={updatingCityFor === place.id}
												>
													<SelectTrigger className="w-full bg-white">
														<SelectValue placeholder="Select a city" />
													</SelectTrigger>
													<SelectContent className="bg-white">
														<SelectItem value="none">No City</SelectItem>
														{cities.map((city) => (
															<SelectItem key={city.id} value={city.id}>
																{city.name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>

												{updatingCityFor === place.id && (
													<div className="flex items-center">
														<Loader2 className="h-4 w-4 animate-spin" />
													</div>
												)}
											</div>
										</div>
									</CardContent>

									<CardFooter className="border-t pt-4">
										<Button
											variant="destructive"
											size="sm"
											className="ml-auto flex items-center gap-1"
											onClick={() => confirmDeletePlace(place.id)}
											disabled={deletingPlace === place.id}
										>
											{deletingPlace === place.id ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												<Trash2 className="h-4 w-4" />
											)}
											Delete Place
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					) : (
						<div className="bg-muted/30 flex flex-col items-center justify-center rounded-lg p-12 text-center">
							<p className="text-muted-foreground mb-4">
								{cities.length > 0
									? selectedCity === 'all'
										? 'No places found for this country.'
										: 'No places found for the selected city.'
									: 'No cities with images found in this country.'}
							</p>
							<Link href={`/cmd-admin/${countryId}/add-place`}>
								<Button>Add New Place</Button>
							</Link>
						</div>
					)}
				</>
			)}

			{/* Delete confirmation dialog */}
			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you sure you want to delete this place?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							place and all associated data.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={deletePlace}
							className="bg-red-600 hover:bg-red-700"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
