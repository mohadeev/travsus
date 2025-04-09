'use client'

import { useState, useEffect, useRef } from 'react'
import { searchCountries } from '@/utils/searchCountries'
import { placesClient } from '@/libs/prisma'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus, X } from 'lucide-react'

// Function to validate image URL
const isValidImageUrl = (url: string) => {
	// Basic URL validation
	const urlPattern = /^(https?:\/\/)([\w.-]+)\.([a-z]{2,})(\/[\w.-]*)*\/?$/i
	if (!urlPattern.test(url)) return false

	// Check if URL ends with common image extensions
	const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
	return (
		imageExtensions.some((ext) => url.toLowerCase().endsWith(ext)) ||
		url.includes('images')
	)
}

export default function CMSAdmin() {
	const [value, setValue] = useState('')
	const [searchResults, setSearchResults] = useState<any[]>([])
	const [loading, setLoading] = useState(false)
	const [savingImageFor, setSavingImageFor] = useState<string | null>(null)
	const [newImageUrls, setNewImageUrls] = useState<Record<string, string>>({})
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string>
	>({})
	const [successMessages, setSuccessMessages] = useState<
		Record<string, string>
	>({})

	// Handle search input change
	const handleChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setValue(value)

		if (value.length < 2) {
			setSearchResults([])
			return
		}

		setLoading(true)
		try {
			const newSearchCountries: any = await searchCountries({
				placeName: value,
			})
			// Filter to only include countries and cities
			const filteredResults = newSearchCountries.filter(
				(item: any) => item.type === 'country' || item.type === 'city',
			)
			setSearchResults(filteredResults)
		} catch (error) {
			console.error('Error searching:', error)
		} finally {
			setLoading(false)
		}
	}

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
	const saveImageUrl = async (id: string, type: string, url: string) => {
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
			// Update the entity with the new image URL
			if (type === 'country') {
				await fetch('/api/update-image', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id,
						type: 'country',
						imageUrl: url,
					}),
				})
			} else if (type === 'city') {
				await fetch('/api/update-image', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id,
						type: 'city',
						imageUrl: url,
					}),
				})
			}

			// Update the UI to show the new image
			setSearchResults((prev) =>
				prev.map((item) => {
					if (item.id === id) {
						return {
							...item,
							image: { uploadFrom: url },
						}
					}
					return item
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

	return (
		<div className="container mx-auto py-8">
			<h1 className="mb-6 text-3xl font-bold">CMS Admin - Image Management</h1>

			<div className="mb-8">
				<label htmlFor="search" className="mb-2 block text-sm font-medium">
					Search for Countries or Cities
				</label>
				<Input
					id="search"
					type="text"
					placeholder="Type to search..."
					value={value}
					onChange={handleChangeInput}
					className="w-full max-w-md"
				/>
			</div>

			{loading && (
				<div className="text-muted-foreground flex items-center gap-2">
					<Loader2 className="h-4 w-4 animate-spin" />
					<span>Searching...</span>
				</div>
			)}

			{searchResults.length > 0 ? (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{searchResults.map((result) => (
						<Card key={result.id} className="overflow-hidden">
							<CardHeader className="pb-2">
								<CardTitle className="flex items-center justify-between">
									<div>
										<span>{result.name}</span>
										<span className="bg-muted ml-2 rounded-full px-2 py-1 text-xs">
											{result.type}
										</span>
									</div>
								</CardTitle>
							</CardHeader>

							<CardContent>
								{/* Display existing image */}
								{result.image ? (
									<div className="mb-4">
										<h4 className="mb-2 text-sm font-medium">Current Image</h4>
										<div className="aspect-video relative overflow-hidden rounded-md border">
											{result.image.url ? (
												<Image
													src={result.image.url || '/placeholder.svg'}
													alt={`${result.name} image`}
													fill
													className="object-cover"
												/>
											) : (
												<div className="bg-muted flex h-full items-center justify-center">
													<span className="text-muted-foreground break-all px-2 text-xs">
														{result.image.uploadFrom}
													</span>
												</div>
											)}
										</div>
									</div>
								) : (
									<p className="text-muted-foreground mb-4 text-sm">
										No image yet
									</p>
								)}

								{/* Add new image */}
								<div className="space-y-2">
									<h4 className="text-sm font-medium">
										{result.image ? 'Update Image' : 'Add Image'}
									</h4>

									<div className="flex gap-2">
										<Input
											type="url"
											placeholder="Enter image URL"
											value={newImageUrls[result.id] || ''}
											onChange={(e) =>
												handleImageUrlChange(result.id, e.target.value)
											}
											onBlur={() => {
												if (newImageUrls[result.id]) {
													saveImageUrl(
														result.id,
														result.type,
														newImageUrls[result.id],
													)
												}
											}}
											className={
												validationErrors[result.id] ? 'border-red-500' : ''
											}
										/>

										<Button
											size="sm"
											onClick={() =>
												saveImageUrl(
													result.id,
													result.type,
													newImageUrls[result.id] || '',
												)
											}
											disabled={savingImageFor === result.id}
										>
											{savingImageFor === result.id ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												<Plus className="h-4 w-4" />
											)}
										</Button>
									</div>

									{validationErrors[result.id] && (
										<p className="text-xs text-red-500">
											{validationErrors[result.id]}
										</p>
									)}

									{successMessages[result.id] && (
										<p className="text-xs text-green-500">
											{successMessages[result.id]}
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : value.length > 1 && !loading ? (
				<p className="text-muted-foreground">No results found</p>
			) : null}
		</div>
	)
}
