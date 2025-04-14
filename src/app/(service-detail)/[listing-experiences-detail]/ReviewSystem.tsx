'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Circle, Camera, ChevronDown, X } from 'lucide-react'
import Image from 'next/image'
import Avatar from '@/shared/Avatar'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import Textarea from '@/shared/Textarea'
import Input from '@/shared/Input'
import { useRouter } from 'next/navigation'
import ReviewImageGallery from './ReviewImageGallery'
import { useSelector } from 'react-redux'

interface ReviewProps {
	serviceId: string
	serviceName: string
}

interface ReviewType {
	id: string
	userId: string
	userName: string
	userImage?: string
	rating: number
	title: string
	content: string
	travelDate: string
	travelType: string
	images: string[]
	createdAt: string
	updatedAt?: string
	author?: {
		name: string
		image: string
		location: string
		contributions: number
	}
}

const ReviewSystem: React.FC<ReviewProps> = ({ serviceId, serviceName }) => {
	const router = useRouter()
	const [showReviewForm, setShowReviewForm] = useState(false)
	const [rating, setRating] = useState(0)
	const [travelDate, setTravelDate] = useState('')
	const [travelType, setTravelType] = useState('')
	const [reviewText, setReviewText] = useState('')
	const [reviewTitle, setReviewTitle] = useState('')
	const [selectedImages, setSelectedImages] = useState<File[]>([])
	const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
	const [isAgreed, setIsAgreed] = useState(false)
	const [reviews, setReviews] = useState<ReviewType[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Get tour data from Redux store
	const tourData =
		useSelector((state: any) => state.creatingServiceSlice.service) || {}
	const { name: title, region, images } = tourData

	// Safely get the number of days
	const getDaysCount = () => {
		const { days } = tourData
		if (!days) return null

		// If days is an array, return its length
		if (Array.isArray(days)) {
			return days.length > 0 ? days.length : null
		}

		// If days is a number, return it directly
		if (typeof days === 'number') {
			return days
		}

		// Otherwise, return null
		return null
	}

	const daysCount = getDaysCount()

	// Fetch reviews on component mount
	useEffect(() => {
		const fetchReviews = async () => {
			try {
				setIsLoading(true)
				const response = await fetch(`/api/reviews?serviceId=${serviceId}`)
				if (response.ok) {
					const data = await response.json()
					setReviews(data.reviews || [])
				}
			} catch (error) {
				console.error('Error fetching reviews:', error)
			} finally {
				setIsLoading(false)
			}
		}

		if (serviceId) {
			fetchReviews()
		}
	}, [serviceId])

	const handleRatingChange = (newRating: number) => {
		setRating(newRating)
	}

	const handleTravelTypeSelect = (type: string) => {
		setTravelType(type)
	}

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const filesArray = Array.from(e.target.files)
			setSelectedImages([...selectedImages, ...filesArray])

			// Create preview URLs
			const newImageUrls = filesArray.map((file) => URL.createObjectURL(file))
			setImagePreviewUrls([...imagePreviewUrls, ...newImageUrls])
		}
	}

	const handleRemoveImage = (index: number) => {
		const newImages = [...selectedImages]
		const newUrls = [...imagePreviewUrls]
		newImages.splice(index, 1)
		newUrls.splice(index, 1)
		setSelectedImages(newImages)
		setImagePreviewUrls(newUrls)
	}

	const handleSubmitReview = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			const formData = new FormData()
			formData.append('serviceId', serviceId)
			formData.append('rating', rating.toString())
			formData.append('travelDate', travelDate)
			formData.append('travelType', travelType)
			formData.append('reviewText', reviewText)
			formData.append('reviewTitle', reviewTitle)
			selectedImages.forEach((image) => {
				formData.append('images', image)
			})
			formData.append('isAgreed', isAgreed.toString())

			const response = await fetch('/api/reviews', {
				method: 'POST',
				body: formData,
			})

			if (response.ok) {
				const data = await response.json()

				// Add the new review to the list
				setReviews((prevReviews) => [data.review, ...prevReviews])

				// Reset form and hide it
				setShowReviewForm(false)
				setRating(0)
				setTravelDate('')
				setTravelType('')
				setReviewText('')
				setReviewTitle('')
				setSelectedImages([])
				setImagePreviewUrls([])
				setIsAgreed(false)

				// Refresh the page to show the new review
				router.refresh()
			} else {
				const error = await response.json()
				alert(`Error submitting review: ${error.error}`)
			}
		} catch (error) {
			console.error('Error submitting review:', error)
			alert('Failed to submit review. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	// Generate months for the dropdown
	const generateMonthOptions = () => {
		const options = []
		const currentDate = new Date()

		for (let i = 0; i < 12; i++) {
			const date = new Date(currentDate)
			date.setMonth(currentDate.getMonth() - i)

			const monthName = date.toLocaleString('default', { month: 'long' })
			const year = date.getFullYear()
			const value = `${monthName} ${year}`

			options.push(
				<option key={value} value={value}>
					{value}
				</option>,
			)
		}

		return options
	}

	// Tour Card Component
	const TourCard = () => {
		// Safely get the image URL
		const getImageUrl = () => {
			if (images && Array.isArray(images) && images.length > 0) {
				const firstImage = images[0]
				if (typeof firstImage === 'string') {
					return firstImage
				} else if (
					firstImage &&
					typeof firstImage === 'object' &&
					'url' in firstImage
				) {
					return firstImage.url
				}
			}
			return '/placeholder.svg?height=300&width=300'
		}

		return (
			<div className="w-full">
				<h3 className="mb-6 text-4xl font-extrabold">
					Tell us, how was your visit?
				</h3>
				<div className="mx-auto max-w-xs overflow-hidden rounded-xl border border-neutral-200">
					<div className="p-4">
						<div
							className="w-full"
							style={{
								height: '220px',
								position: 'relative',
								backgroundColor: '#F2F2F2',
							}}
						>
							<Image
								src={getImageUrl() || '/placeholder.svg'}
								alt={title || 'Tour image'}
								width={220}
								height={220}
								style={{ objectFit: 'cover', width: '100%', height: '100%' }}
							/>
						</div>
					</div>
					<div className="p-4">
						<h4 className="mb-1 text-lg font-bold">{title || 'Tour Title'}</h4>
						{daysCount && (
							<p className="text-sm text-neutral-600">
								{daysCount} Days {region && `in ${region}`}
							</p>
						)}
						{!daysCount && region && (
							<p className="text-sm text-neutral-600">{region}</p>
						)}
					</div>
				</div>
				<div className="mt-4 text-center text-sm">
					<p className="text-neutral-500">
						Not the right one?{' '}
						<button className="text-black underline">Change activity</button>
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="mb-10 mt-10 w-full">
			{/* Reviews Section */}
			<div className="">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-2xl font-semibold">Reviews ({reviews.length})</h2>
					{reviews.length >= 1 ? (
						<ButtonPrimary onClick={() => setShowReviewForm(!showReviewForm)}>
							Write a Review
						</ButtonPrimary>
					) : (
						''
					)}
				</div>

				{/* Review Form */}
				{showReviewForm && (
					<div className="mb-8 bg-white p-6">
						<div className="grid gap-8 md:grid-cols-12">
							{/* Left Column - Tour Card (35%) */}
							<div className="border-r border-neutral-200 pr-6 md:col-span-4">
								<TourCard />
							</div>

							{/* Right Column - Review Form (65%) */}
							<div className="md:col-span-8">
								<form onSubmit={handleSubmitReview}>
									{/* Rating */}
									<div className="mb-6">
										<h4 className="mb-3 text-2xl font-semibold">
											How would you rate your experience?
										</h4>
										<div className="flex gap-1">
											{[1, 2, 3, 4, 5].map((circle) => (
												<button
													key={circle}
													type="button"
													onClick={() => handleRatingChange(circle)}
													className={`flex h-13 w-13 items-center justify-center rounded-full transition-colors ${
														rating >= circle
															? 'text-black'
															: 'text-gray-300 hover:text-gray-400'
													}`}
												>
													<Circle
														className={`h-9 w-9 ${rating >= circle ? 'fill-black' : ''}`}
													/>
												</button>
											))}
										</div>
									</div>

									{/* When did you go */}
									<div className="mb-6">
										<h4 className="mb-2 text-lg font-medium">
											When did you go?
										</h4>
										<div className="relative">
											<select
												value={travelDate}
												onChange={(e) => setTravelDate(e.target.value)}
												className="w-full appearance-none rounded-md border border-neutral-300 bg-white px-4 py-2 md:w-64"
												required
											>
												<option value="">Select one</option>
												{generateMonthOptions()}
											</select>
											<ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-neutral-500" />
										</div>
									</div>

									{/* Who did you go with */}
									<div className="mb-6">
										<h4 className="mb-2 text-lg font-medium">
											Who did you go with?
										</h4>
										<div className="flex flex-wrap gap-2">
											{['Business', 'Couples', 'Family', 'Friends', 'Solo'].map(
												(type) => (
													<button
														key={type}
														type="button"
														onClick={() => handleTravelTypeSelect(type)}
														className={`rounded-full border px-4 py-1.5 ${
															travelType === type
																? 'border-black bg-black text-white'
																: 'border-neutral-200 bg-white text-black hover:border-neutral-400'
														}`}
													>
														{type}
													</button>
												),
											)}
										</div>
									</div>

									{/* Write your review */}
									<div className="mb-6">
										<h4 className="mb-2 text-lg font-medium">
											Write your review
										</h4>
										<Textarea
											value={reviewText}
											onChange={(e) => setReviewText(e.target.value)}
											placeholder="Share your experience with other travelers..."
											rows={5}
											maxLength={1000}
											required
										/>
										<div className="text-right text-sm text-neutral-500">
											{reviewText.length}/1000 max characters
										</div>
									</div>

									{/* Title your review */}
									<div className="mb-6">
										<h4 className="mb-2 text-lg font-medium">
											Title your review
										</h4>
										<Input
											type="text"
											value={reviewTitle}
											onChange={(e) => setReviewTitle(e.target.value)}
											placeholder="Summarize your experience"
											maxLength={120}
											required
										/>
										<div className="text-right text-sm text-neutral-500">
											{reviewTitle.length}/120 max characters
										</div>
									</div>

									{/* Add photos */}
									<div className="mb-6">
										<h4 className="mb-2 text-lg font-medium">
											Add some photos
										</h4>
										<p className="mb-3 text-sm text-neutral-500">Optional</p>

										<div className="rounded-md bg-[#F2F2F2] p-6 text-center">
											{imagePreviewUrls.length > 0 ? (
												<div className="mb-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
													{imagePreviewUrls.map((url, index) => (
														<div key={index} className="relative">
															<Image
																src={url || '/placeholder.svg'}
																alt={`Preview ${index}`}
																width={120}
																height={120}
																className="h-24 w-24 rounded-md object-cover"
															/>
															<button
																type="button"
																onClick={() => handleRemoveImage(index)}
																className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black p-1 text-xs text-white"
															>
																<X size={12} />
															</button>
														</div>
													))}
												</div>
											) : null}

											<label className="flex cursor-pointer flex-col items-center justify-center">
												<Camera className="mb-2 h-8 w-8 text-neutral-400" />
												<span className="font-medium text-neutral-600">
													Click to add photos
												</span>
												<span className="text-sm text-neutral-500">
													or drag and drop
												</span>
												<input
													type="file"
													accept="image/*"
													multiple
													onChange={handleImageUpload}
													className="hidden"
												/>
											</label>
										</div>
									</div>

									{/* Terms agreement */}
									<div className="mb-6">
										<label className="flex cursor-pointer items-start gap-2">
											<input
												type="checkbox"
												checked={isAgreed}
												onChange={(e) => setIsAgreed(e.target.checked)}
												className="mt-1 accent-black"
												required
											/>
											<span className="text-sm text-neutral-600">
												I certify that this review is based on my own experience
												and is my genuine opinion of this establishment, and
												that I have no personal or business relationship with
												this establishment, and have not been offered any
												incentive or payment originating from the establishment
												to write this review. I understand that Travsus has a
												zero-tolerance policy on fake reviews.
											</span>
										</label>
									</div>

									<div className="flex justify-end gap-4">
										<ButtonSecondary
											type="button"
											onClick={() => setShowReviewForm(false)}
										>
											Cancel
										</ButtonSecondary>
										<ButtonPrimary type="submit" disabled={isSubmitting}>
											{isSubmitting ? 'Submitting...' : 'Submit'}
										</ButtonPrimary>
									</div>
								</form>
							</div>
						</div>
					</div>
				)}

				{/* Reviews List */}
				{isLoading ? (
					<div className="space-y-6">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="animate-pulse border-b border-neutral-200 pb-6"
							>
								<div className="flex items-start gap-4">
									<div className="h-12 w-12 rounded-full bg-neutral-200"></div>
									<div className="flex-1">
										<div className="mb-2 h-4 w-32 rounded bg-neutral-200"></div>
										<div className="h-3 w-48 rounded bg-neutral-200"></div>
									</div>
								</div>
								<div className="mt-3">
									<div className="mb-2 h-4 w-24 rounded bg-neutral-200"></div>
									<div className="mb-2 h-5 w-64 rounded bg-neutral-200"></div>
									<div className="mb-1 h-4 w-full rounded bg-neutral-200"></div>
									<div className="mb-1 h-4 w-full rounded bg-neutral-200"></div>
									<div className="mb-3 h-4 w-3/4 rounded bg-neutral-200"></div>
									<div className="h-3 w-48 rounded bg-neutral-200"></div>
								</div>
							</div>
						))}
					</div>
				) : reviews.length > 0 ? (
					<div className="space-y-6">
						{reviews.map((review) => (
							<div
								key={review.id}
								className="border-b border-neutral-200 pb-6 last:border-b-0"
							>
								<div className="flex items-start gap-4">
									<Avatar
										sizeClass="h-12 w-12"
										radius="rounded-full"
										imgUrl={
											review.userImage || ""
										}
									/>
									<div>
										<h4 className="font-medium">{review.userName}</h4>
										{review.author && (
											<div className="flex items-center text-sm text-neutral-500">
												<span>{review.author.location}</span>
												<span className="mx-2">•</span>
												<span>{review.author.contributions} contributions</span>
											</div>
										)}
									</div>
								</div>

								<div className="mt-3">
									<div className="mb-1 flex items-center gap-1">
										<div className="flex gap-0.5">
											{[1, 2, 3, 4, 5].map((circle) => (
												<Circle
													key={circle}
													className={`h-4.5 w-4.5 ${circle <= review.rating ? 'fill-black text-black' : 'text-gray-300'}`}
												/>
											))}
										</div>
										<span className="ml-2 text-sm text-neutral-500">
											{new Date(review.createdAt).toLocaleDateString('en-US', {
												year: 'numeric',
												month: 'long',
											})}
										</span>
									</div>

									<h3 className="mb-2 text-lg font-bold">{review.title}</h3>
									<p className="mb-3 text-neutral-700">{review.content}</p>

									<div className="mb-3 text-sm text-neutral-500">
										<span>Date of experience: {review.travelDate}</span>
										<span className="mx-2">•</span>
										<span>Trip type: {review.travelType}</span>
									</div>

									{review.images && review.images.length > 0 && (
										<ReviewImageGallery images={review.images} />
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="nc-custom-shadow-1 rounded-lg py-10 text-center">
						<h3 className="mb-2 text-lg font-medium">No reviews yet</h3>
						<p className="mb-4 text-neutral-500">
							Be the first to share your experience
						</p>
						<ButtonPrimary onClick={() => setShowReviewForm(true)}>
							Write a Review
						</ButtonPrimary>
					</div>
				)}

				{reviews.length > 5 && (
					<div className="mt-6 text-center">
						<ButtonPrimary>Load More Reviews</ButtonPrimary>
					</div>
				)}
			</div>
		</div>
	)
}

export default ReviewSystem
