'use client'

import type React from 'react'
import { Circle } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useTranslations } from '@/lib/i18n'
import { useLocale } from 'next-intl'
import defualt_user from '@/images/defualt_user.jpg'

interface ReviewType {
	id: string
	userId: string
	userName: string
	userImage?: string
	rating: number
	title: string
	content: string
	travelDate1: string
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

interface ReviewProps {
	review: ReviewType
}

const Review: React.FC<ReviewProps> = ({ review }) => {
	const t = useTranslations('experience_reviews')
	const locale = useLocale()

	return (
		<div className="p-6">
			<div className="flex items-start gap-4">
				<div className="flex-1">
					<div className="flex items-start justify-between">
						<div className="flex gap-3">
							<Avatar className="h-12 w-12">
								<AvatarImage
									src={review.userImage ? review.userImage : defualt_user.src}
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
							<div className="">
								<h4 className="font-semibold text-gray-900">
									{review.userName}
								</h4>
								{review.author && (
									<div className="flex items-center text-sm font-medium text-black">
										<span>{review.author.location}</span>
										<span className="mx-2">•</span>
										<span>
											{review.author.contributions} {t('Contributions')}
										</span>
									</div>
								)}
							</div>
						</div>
						<div className="text-sm font-medium text-black">
							{new Date(review.createdAt).toLocaleDateString(locale, {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</div>
					</div>

					<div className="mt-3">
						<div className="mb-2 flex items-center gap-2">
							<div className="flex gap-0.5">
								{[1, 2, 3, 4, 5].map((circle) => (
									<Circle
										key={circle}
										className={`h-4.5 w-4.5 ${circle <= review.rating ? 'fill-green-600 text-green-600' : 'text-gray-300'}`}
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

						<div className="mb-3 flex flex-wrap gap-4 text-sm/6 font-semibold text-black">
							<span>
								{t('Date_Experience')} {review.travelDate1}
							</span>
							<span>
								{t('Trip_Type')} {t(review.travelType)}
							</span>
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
	)
}

export default Review
