'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Circle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import defualt_user from '@/images/defualt_user.jpg'
import ReadMore from '@/app/(client-components)/ReadeMore'
import { useTranslations } from '@/lib/i18n'
import { useLocale } from 'next-intl'

interface Testimonial {
	id: string
	userName: string
	userImage: string | null
	rating: number
	title: string
	content: string
	travelDate1: string
	travelType: string
	createdAt: string
	user?: {
		accountData?: {
			firstname: string
		}
	}
}

const TestimonialSkeleton = () => {
	return (
		<Card className="min-h-90 min-w-100 bg-white">
			<CardContent className="p-6">
				<div className="animate-pulse">
					<div className="flex items-start gap-4">
						<div className="h-12 w-12 rounded-full bg-neutral-200"></div>
						<div className="flex-1">
							<div className="mb-2 h-4 w-32 rounded bg-neutral-200"></div>
							<div className="h-3 w-48 rounded bg-neutral-200"></div>
						</div>
						<div className="h-3 w-24 rounded bg-neutral-200"></div>
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
			</CardContent>
		</Card>
	)
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
	const t = useTranslations('Testimonials')
	const locale = useLocale()

	return (
		<Card className="min-h-90 min-w-100 bg-white">
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
												: defualt_user.src
										}
										alt={testimonial?.user?.accountData?.firstname || ''}
									/>
									<AvatarFallback>
										{testimonial?.user?.accountData?.firstname
											?.split(' ')
											.map((n) => n[0])
											.join('')
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div>
									<h4 className="font-semibold text-gray-900">
										{testimonial?.user?.accountData?.firstname}
									</h4>
									<div className="flex items-center text-sm font-medium text-black">
										<span>{testimonial.travelType}</span>
									</div>
								</div>
							</div>
							<div className="text-sm font-medium text-black">
								{new Date(testimonial.createdAt).toLocaleDateString(locale, {
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
								<ReadMore description={testimonial.content} />
							</p>

							<div className="flex flex-wrap gap-4 text-sm/6 font-semibold text-black">
								<span>
									{t('travel_date')}:{' '}
									{new Date(testimonial.travelDate1).toLocaleDateString(
										locale,
										{
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										},
									)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default function Testimonials() {
	const t = useTranslations('Testimonials')
	const [testimonials, setTestimonials] = useState<Testimonial[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	const scrollLeft = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
		}
	}

	const scrollRight = () => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
		}
	}

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				setLoading(true)
				const response = await fetch('/api/reviews/testimonials')

				if (!response.ok) {
					throw new Error('Failed to fetch reviews')
				}

				const data = await response.json()
				console.log('data: ', data)
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
							{t('title')}
						</h2>
						<p className="max-w-2xl text-pretty text-xs text-black">
							{t('description')}
						</p>
					</div>

					<div className="relative">
						<div
							className="scrollbar-hide flex flex-row items-start gap-6 overflow-auto"
							style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
						>
							{[1, 2, 3, 4].map((index) => (
								<TestimonialSkeleton key={index} />
							))}
						</div>
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
							{t('title')}
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
						{t('title')}
					</h2>
					<p className="max-w-2xl text-pretty text-xs text-black">
						{t('description')}
					</p>
				</div>

				{testimonials.length > 0 ? (
					<div className="relative">
						<div
							ref={scrollContainerRef}
							className="scrollbar-hide flex flex-row items-start gap-6 overflow-auto"
							style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
						>
							{testimonials.map((testimonial) => (
								<TestimonialCard
									key={testimonial.id}
									testimonial={testimonial}
								/>
							))}
						</div>

						<div className="mt-6 flex justify-start gap-2">
							<button
								onClick={scrollLeft}
								className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
								aria-label="Previous testimonials"
							>
								<ChevronLeft className="h-5 w-5" />
							</button>
							<button
								onClick={scrollRight}
								className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
								aria-label="Next testimonials"
							>
								<ChevronRight className="h-5 w-5" />
							</button>
						</div>
					</div>
				) : (
					<div className="py-8 text-center">
						<p className="text-gray-600">{t('no_reviews')}</p>
					</div>
				)}
			</div>
		</section>
	)
}
