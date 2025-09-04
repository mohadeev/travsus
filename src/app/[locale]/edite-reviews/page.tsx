'use client'

import { useState, useEffect } from 'react'

interface Review {
	id: string
	travelDate1: string | null
	content: string
	rating: number
	userName: string
}

export default function EditReviewsPage() {
	const [reviews, setReviews] = useState<Review[]>([])
	const [loading, setLoading] = useState(true)
	const [updating, setUpdating] = useState<string | null>(null)

	useEffect(() => {
		fetchReviews()
	}, [])

	const fetchReviews = async () => {
		try {
			const response = await fetch('/api/reviews')
			const data = await response.json()
			setReviews(data)
		} catch (error) {
			console.error('Failed to fetch reviews:', error)
		} finally {
			setLoading(false)
		}
	}

	const updateTravelDate1 = async (reviewId: string, newDate: string) => {
		setUpdating(reviewId)
		try {
			const response = await fetch(`/api/reviews/${reviewId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ travelDate1: newDate }),
			})

			if (response.ok) {
				setReviews(
					reviews.map((review) =>
						review.id === reviewId
							? { ...review, travelDate1: newDate }
							: review,
					),
				)
			} else {
				console.error('Failed to update review')
			}
		} catch (error) {
			console.error('Error updating review:', error)
		} finally {
			setUpdating(null)
		}
	}

	if (loading) {
		return (
			<div className="bg-background min-h-screen p-8">
				<div className="mx-auto max-w-4xl">
					<h1 className="mb-8 text-3xl font-bold">Edit Reviews</h1>
					<p>Loading reviews...</p>
				</div>
			</div>
		)
	}

	return (
		<div className="bg-background min-h-screen p-8">
			<div className="mx-auto max-w-4xl">
				<h1 className="mb-8 text-3xl font-bold">Edit Reviews Travel Dates</h1>

				<div className="space-y-6">
					{reviews.map((review) => (
						<div
							key={review.id}
							className="border-border bg-card rounded-lg border p-6"
						>
							<div className="mb-4 flex items-start justify-between">
								<div>
									<h3 className="text-lg font-semibold">{review.userName}</h3>
									<div className="mb-2 flex items-center gap-1">
										{[...Array(5)].map((_, i) => (
											<span
												key={i}
												className={
													i < review.rating
														? 'text-yellow-500'
														: 'text-gray-300'
												}
											>
												★
											</span>
										))}
									</div>
								</div>
								<span className="text-muted-foreground text-sm">
									ID: {review.id}
								</span>
							</div>

							<p className="text-muted-foreground mb-4 line-clamp-3 text-sm">
								{review.content}
							</p>

							<div className="flex items-center gap-4">
								<label className="text-sm font-medium">Travel Date:</label>
								<input
									type="month"
									value={
										review.travelDate1
											? new Date(review.travelDate1).toISOString().slice(0, 7)
											: new Date().toISOString().slice(0, 7)
									}
									onChange={(e) => {
										const newDate = new Date(
											e.target.value + '-15',
										).toISOString()
										updateTravelDate1(review.id, newDate)
									}}
									disabled={updating === review.id}
									className="border-input bg-background text-foreground rounded-md border px-3 py-2"
								/>
								<span className="text-muted-foreground text-sm">
									Current: {review.travelDate1 || 'Not set'}
								</span>
								{updating === review.id && (
									<span className="text-sm text-blue-600">Updating...</span>
								)}
							</div>
						</div>
					))}
				</div>

				{reviews.length === 0 && (
					<p className="text-muted-foreground text-center">No reviews found.</p>
				)}
			</div>
		</div>
	)
}
