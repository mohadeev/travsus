'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Circle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Testimonial {
	id: string
	userName: string
	userImage: string | null
	rating: number
	title: string
	content: string
	travelDate: string
	travelType: string
	createdAt: string
}

const StarRating = ({ rating }: { rating: number }) => {
	return (
		<div className="flex items-center gap-2">
			<div className="flex gap-0.5">
				{[1, 2, 3, 4, 5].map((circle) => (
					<Circle
						key={circle}
						className={`h-4.5 w-4.5 ${circle <= rating ? 'fill-green-600 text-green-600' : 'text-gray-300'}`}
					/>
				))}
			</div>
			<span className="text-sm font-medium text-gray-700">{rating}/5</span>
		</div>
	)
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
	return (
		<Card className="min-w-100 bg-white">
			<CardContent className="p-6">
				<div className="flex items-start gap-4">
					<div className="flex-1">
						<div className="flex items-start justify-between">
							<div className="flex gap-3">
								<Avatar className="h-12 w-12">
									<AvatarImage
										src={
											testimonial.userImage
												? testimonial.userImage
												: '/placeholder.svg?height=48&width=48&query=default user avatar'
										}
										alt={testimonial?.user?.accountData?.firstName}
									/>
									<AvatarFallback>
										{/* {testimonial?.user?.accountData?.firstName
											.split(' ')
											.map((n) => n[0])
											.join('')
											.toUpperCase()} */}
									</AvatarFallback>
								</Avatar>
								<div>
									<h4 className="font-semibold text-gray-900">
										{testimonial?.user?.accountData?.firstName}
									</h4>
									<div className="flex items-center text-sm font-medium text-black">
										<span>{testimonial.travelType}</span>
									</div>
								</div>
							</div>
							<div className="text-sm font-medium text-black">
								{new Date(testimonial.createdAt).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</div>
						</div>

						<div className="mt-3">
							<div className="mb-2">
								<StarRating rating={testimonial.rating} />
							</div>

							<h3 className="mb-2 text-lg font-semibold text-gray-900">
								{testimonial.title}
							</h3>
							<p className="mb-3 leading-relaxed text-gray-700">
								{testimonial.content}
							</p>

							<div className="flex flex-wrap gap-4 text-sm/6 font-semibold text-black">
								<span>Travel Date: {testimonial.travelDate}</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default function Testimonials() {
	const [testimonials, setTestimonials] = useState<Testimonial[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				setLoading(true)
				const response = await fetch('/api/reviews/testimonials')

				if (!response.ok) {
					throw new Error('Failed to fetch reviews')
				}

				const data = await response.json()

				setTestimonials(data)
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load reviews')
			} finally {
				setLoading(false)
			}
		}

		fetchReviews()
	}, [])

	if (loading) {
		return (
			<section
				className="mx-auto my-10 w-full px-4 py-16"
				style={{ backgroundColor: '#F5F5F7' }}
			>
				<div className="container">
					<div className="mb-12 text-start">
						<h2 className="mb-4 text-balance text-3xl font-bold text-gray-900">
							What Our Customers Say
						</h2>
						<p className="max-w-2xl text-pretty text-xs text-black">
							Loading customer reviews...
						</p>
					</div>
				</div>
			</section>
		)
	}

	if (error) {
		return (
			<section
				className="mx-auto my-10 w-full px-4 py-16"
				style={{ backgroundColor: '#F5F5F7' }}
			>
				<div className="container">
					<div className="mb-12 text-start">
						<h2 className="mb-4 text-balance text-3xl font-bold text-gray-900">
							What Our Customers Say
						</h2>
						<p className="max-w-2xl text-pretty text-xs text-red-600">
							{error}
						</p>
					</div>
				</div>
			</section>
		)
	}

	return (
		<section
			className="mx-auto my-10 w-full px-4 py-16"
			style={{ backgroundColor: '#F5F5F7' }}
		>
			<div className="container">
				<div className="mb-12 text-start">
					<h2 className="mb-4 text-balance text-3xl font-bold text-gray-900">
						What Our Customers Say
					</h2>
					<p className="max-w-2xl text-pretty text-xs text-black">
						Don't just take our word for it. Here's what our satisfied customers
						have to say about their experience with our 5-star rated services.
					</p>
				</div>

				{testimonials.length > 0 ? (
					<div className="flex flex-row items-start gap-6 overflow-auto">
						{testimonials.map((testimonial) => (
							<TestimonialCard key={testimonial.id} testimonial={testimonial} />
						))}
					</div>
				) : (
					<div className="py-8 text-center">
						<p className="text-gray-600">
							No 5-star reviews available at the moment.
						</p>
					</div>
				)}
			</div>
		</section>
	)
}
