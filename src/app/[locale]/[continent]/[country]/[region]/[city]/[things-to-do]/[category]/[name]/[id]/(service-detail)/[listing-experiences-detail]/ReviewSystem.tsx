'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Star, Camera, ChevronDown, X } from 'lucide-react'
import Image from 'next/image'
// import Avatar from '@/shared/Avatar'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import Textarea from '@/shared/Textarea'
import Input from '@/shared/Input'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useAuthAction } from '@/app/hooks/useAuthAction'
import { useTranslations } from '@/lib/i18n'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

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
	const t = useTranslations('experience_reviews')
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

	const handleAddToWishList = useAuthAction(async (e: any) => {})

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

	const handleSubmitReview = useAuthAction(async (e: React.FormEvent) => {
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
				alert(`${t('Error_Submit_Review')} ${error.error}`)
			}
		} catch (error) {
			console.error('Error submitting review:', error)
			alert(t('Failed_Submit'))
		} finally {
			setIsSubmitting(false)
		}
	})

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
			return ''
		}

		return (
			<div className="w-full">
				<h3 className="mb-6 text-4xl font-extrabold">{t('Tell_Us_Visit')}</h3>
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
								alt={title || t('Tour_Title')}
								width={220}
								height={220}
								style={{ objectFit: 'cover', width: '100%', height: '100%' }}
							/>
						</div>
					</div>
					<div className="p-4">
						<h4 className="mb-1 text-lg font-bold">
							{title || t('Tour_Title')}
						</h4>
						{daysCount && (
							<p className="text-sm text-neutral-600">
								{daysCount} {t('Days')} {region && `${t('In')} ${region}`}
							</p>
						)}
						{!daysCount && region && (
							<p className="text-sm text-neutral-600">{region}</p>
						)}
					</div>
				</div>
				<div className="mt-4 text-center text-sm">
					<p className="text-neutral-500">
						{t('Not_Right_One')}{' '}
						<button className="text-black underline">
							{t('Change_Activity')}
						</button>
					</p>
				</div>
			</div>
		)
	}

	const handleWriteReview = useAuthAction(async () => {
		setShowReviewForm(!showReviewForm)
	})

	const totalReviews = reviews.length
	const averageRating =
		totalReviews > 0
			? (
					reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
				).toFixed(1)
			: '0.0'

	const ratingCounts = {
		5: reviews.filter((review) => review.rating === 5).length,
		4: reviews.filter((review) => review.rating === 4).length,
		3: reviews.filter((review) => review.rating === 3).length,
		2: reviews.filter((review) => review.rating === 2).length,
		1: reviews.filter((review) => review.rating === 1).length,
	}

	const ratingLabels = {
		5: 'Excellent',
		4: 'Very good',
		3: 'Average',
		2: 'Poor',
		1: 'Terrible',
	}

	const ratingBreakdown = ratingCounts

	return (
		<div id="experience_reviews" className="mb-10 mt-10 w-full">
			{/* Reviews Section */}
			<div className="">
				{!isLoading && (
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-2xl font-semibold">
							{t('Reviews')} ({reviews.length})
						</h2>
						{reviews.length >= 1 ? (
							<ButtonPrimary onClick={() => handleWriteReview()}>
								{t('Write_Review')}
							</ButtonPrimary>
						) : (
							''
						)}
					</div>
				)}

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
											{t('Rate_Experience')}
										</h4>
										<div className="flex gap-1">
											{[1, 2, 3, 4, 5].map((star) => (
												<button
													key={star}
													type="button"
													onClick={() => handleRatingChange(star)}
													className={`transition-colors ${
														rating >= star
															? 'text-yellow-400'
															: 'text-gray-300 hover:text-gray-400'
													}`}
												>
													<Star
														className={`h-8 w-8 ${rating >= star ? 'fill-yellow-400' : ''}`}
													/>
												</button>
											))}
										</div>
									</div>

									{/* When did you go */}
									<div className="mb-6">
										<h4 className="mb-2 text-lg font-medium">{t('When_Go')}</h4>
										<div className="relative">
											<select
												value={travelDate}
												onChange={(e) => setTravelDate(e.target.value)}
												className="w-full appearance-none rounded-md border border-neutral-300 bg-white px-4 py-2 md:w-64"
												required
											>
												<option value="">{t('Select_One')}</option>
												{generateMonthOptions()}
											</select>
											<ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-neutral-500" />
										</div>
									</div>

									{/* Who did you go with */}
									<div className="mb-6">
										<h4 className="mb-2 text-lg font-medium">
											{t('Who_Go_With')}
										</h4>
										<div className="flex flex-wrap gap-2">
											{[
												{ key: 'Business', label: t('Business') },
												{ key: 'Couples', label: t('Couples') },
												{ key: 'Family', label: t('Family') },
												{ key: 'Friends', label: t('Friends') },
												{ key: 'Solo', label: t('Solo') },
											].map((type) => (
												<button
													key={type.key}
													type="button"
													onClick={() => handleTravelTypeSelect(type.key)}
													className={`rounded-full border px-4 py-1.5 ${
														travelType === type.key
															? 'border-black bg-black text-white'
															: 'border-neutral-200 bg-white text-black hover:border-neutral-400'
													}`}
												>
													{type.label}
												</button>
											))}
										</div>
									</div>

									{/* Write your review */}
									<div className="mb-6">
										<h4 className="mb-2 text-lg font-medium">
											{t('Write_Your_Review')}
										</h4>
										<Textarea
											value={reviewText}
											onChange={(e) => setReviewText(e.target.value)}
											placeholder={t('Share_Experience')}
											rows={5}
											maxLength={1000}
											required
										/>
										<div className="text-right text-sm text-neutral-500">
											{reviewText.length}/1000 {t('Max_Characters')}
										</div>
									</div>

									{/* Title your review */}
									<div className="mb-6">
										<h4 className="mb-2 text-lg font-medium">
											{t('Title_Your_Review')}
										</h4>
										<Input
											type="text"
											value={reviewTitle}
											onChange={(e) => setReviewTitle(e.target.value)}
											placeholder={t('Summarize_Experience')}
											maxLength={120}
											required
										/>
										<div className="text-right text-sm text-neutral-500">
											{reviewTitle.length}/120 {t('Max_Characters')}
										</div>
									</div>

									{/* Add photos */}
									<div className="mb-6">
										<h4 className="mb-2 text-lg font-medium">
											{t('Add_Photos')}
										</h4>
										<p className="mb-3 text-sm text-neutral-500">
											{t('Optional')}
										</p>

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
													{t('Click_Add_Photos')}
												</span>
												<span className="text-sm text-neutral-500">
													{t('Drag_Drop')}
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
												{t('Certify_Review')}
											</span>
										</label>
									</div>

									<div className="flex justify-end gap-4">
										<ButtonSecondary
											type="button"
											onClick={() => setShowReviewForm(false)}
										>
											{t('Cancel')}
										</ButtonSecondary>
										<ButtonPrimary type="submit" disabled={isSubmitting}>
											{isSubmitting ? t('Submitting') : t('Submit')}
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
					<div className="bg-white">
						{/* Rating Summary Section */}
						<div className="border-b border-gray-200 p-6">
							<div className="flex flex-col gap-8 md:flex-row md:items-start">
								{/* Overall Rating */}
								<div className="flex flex-col items-center md:items-start">
									<div className="mb-2 flex items-baseline gap-2">
										<div className="text-5xl font-bold text-gray-900">
											{averageRating}
										</div>
										<div className="text-lg text-gray-600">/ 5</div>
									</div>
									<div className="mb-2 flex gap-1">
										{[1, 2, 3, 4, 5].map((star) => (
											<Star
												key={star}
												className={`h-5 w-5 ${
													star <= Math.round(Number.parseFloat(averageRating))
														? 'fill-yellow-400 text-yellow-400'
														: 'fill-gray-300 text-gray-300'
												}`}
											/>
										))}
									</div>
									<div className="text-sm text-gray-600">
										Based on {totalReviews.toLocaleString()} review
										{totalReviews !== 1 ? 's' : ''}
									</div>
								</div>

								{/* Rating Breakdown */}
								<div className="flex-1 space-y-2">
									{[5, 4, 3, 2, 1].map((rating) => (
										<div key={rating} className="flex items-center gap-3">
											<div className="flex w-20 items-center gap-1 text-sm font-medium text-gray-700">
												<span>{rating}</span>
												<Star className="h-3 w-3 fill-gray-400 text-gray-400" />
											</div>
											<div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
												<div
													className="h-full rounded-full bg-yellow-400 transition-all duration-300"
													style={{
														width:
															totalReviews > 0
																? `${(ratingBreakdown[rating as keyof typeof ratingBreakdown] / totalReviews) * 100}%`
																: '0%',
													}}
												/>
											</div>
											<div className="w-12 text-right text-sm text-gray-600">
												{
													ratingBreakdown[
														rating as keyof typeof ratingBreakdown
													]
												}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Individual Reviews */}
						<div className="divide-y divide-gray-200">
							{reviews.map((review) => (
								<div key={review.id} className="p-6">
									<div className="flex items-start gap-4">
										<Avatar className="h-12 w-12">
											<AvatarImage
												src={review.userImage || '/placeholder.svg'}
												alt={review.userName}
											/>
											<AvatarFallback>
												{review.userName
													.split(' ')
													.map((n) => n[0])
													.join('')
													.toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="flex items-start justify-between">
												<div>
													<h4 className="font-semibold text-gray-900">
														{review.userName}
													</h4>
													{review.author && (
														<div className="flex items-center text-sm text-gray-500">
															<span>{review.author.location}</span>
															<span className="mx-2">•</span>
															<span>
																{review.author.contributions} Contributions
															</span>
														</div>
													)}
												</div>
												<div className="text-sm text-gray-500">
													{new Date(review.createdAt).toLocaleDateString(
														'en-US',
														{
															year: 'numeric',
															month: 'long',
															day: 'numeric',
														},
													)}
												</div>
											</div>

											<div className="mt-3">
												<div className="mb-2 flex items-center gap-2">
													<div className="flex gap-0.5">
														{[1, 2, 3, 4, 5].map((star) => (
															<Star
																key={star}
																className={`h-4 w-4 ${
																	star <= review.rating
																		? 'fill-yellow-400 text-yellow-400'
																		: 'fill-gray-300 text-gray-300'
																}`}
															/>
														))}
													</div>
													<span className="text-sm font-medium text-gray-700">
														{review.rating}/5
													</span>
												</div>

												<h3 className="mb-2 text-lg font-semibold text-gray-900">
													{review.title}
												</h3>
												<p className="mb-3 leading-relaxed text-gray-700">
													{review.content}
												</p>

												<div className="mb-3 flex flex-wrap gap-4 text-sm text-gray-500">
													<span>Date of experience: {review.travelDate}</span>
													<span>Trip type: {review.travelType}</span>
												</div>

												{review.images && review.images.length > 0 && (
													<div className="mt-4 flex flex-wrap gap-2">
														{review.images.map((image, index) => (
															<img
																key={index}
																src={image || '/placeholder.svg'}
																alt={`Review image ${index + 1}`}
																className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
															/>
														))}
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				) : (
					<div className="nc-custom-shadow-1 rounded-lg py-10 text-center">
						<h3 className="mb-2 text-lg font-medium">{t('No_Reviews_Yet')}</h3>
						<p className="mb-4 text-neutral-500">{t('First_Share')}</p>
						<ButtonPrimary onClick={() => setShowReviewForm(true)}>
							{t('Write_Review')}
						</ButtonPrimary>
					</div>
				)}

				{reviews.length > 5 && (
					<div className="mt-6 text-center">
						<ButtonPrimary>{t('Load_More_Reviews')}</ButtonPrimary>
					</div>
				)}
			</div>
		</div>
	)
}

export default ReviewSystem
