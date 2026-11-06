'use client'

import type React from 'react'
import Stars from './Stars'
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
		<article className="py-[22px]">
			<div className="flex items-start gap-4">
				<div className="flex-1">
					<div className="flex items-start justify-between">
						<div className="flex gap-3">
							<Avatar className="h-10 w-10">
								<AvatarImage
									src={review.userImage ? review.userImage : defualt_user.src}
									alt={review?.user?.accountData?.firstname}
								/>
								<AvatarFallback>
									{/* {review.userName
										.split(' ')
										.map((n) => n[0])
										.join('')
										.toUpperCase()} */}
								</AvatarFallback>
							</Avatar>
							<div className="">
								<h4 className="text-[15px] font-bold text-ink dark:text-white">
									{review?.user?.accountData?.firstname}
								</h4>
								{review.author && (
									<div className="flex items-center text-[13px] text-neutral-700 dark:text-neutral-300">
										<span>{review.author.location}</span>
										<span className="mx-2">•</span>
										<span>
											{review.author.contributions} {t('Contributions')}
										</span>
									</div>
								)}
							</div>
						</div>
						<div className="text-[13px] text-neutral-600 dark:text-neutral-400">
							{new Date(review.createdAt).toLocaleDateString(locale, {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</div>
					</div>

					<div className="mt-3">
						<div className="mb-2 flex items-center gap-2">
							<Stars rating={review.rating} />
							<span className="sr-only">{review.rating}/5</span>
						</div>

						<h3 className="mb-1.5 text-[17px] font-extrabold text-ink dark:text-white">
							{review.title}
						</h3>
						<p className="mb-2.5 max-w-[72ch] text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
							{review.content}
						</p>

						<div className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-neutral-600 dark:text-neutral-400">
							<span>
								{t('Date_Experience')} {''}
								{new Date(review.travelDate1).toLocaleDateString(locale, {
									year: 'numeric',
									month: 'long',
								})}
								{/* {review.travelDate1} */}
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
										className="h-20 w-20 rounded-lg border border-neutral-200 object-cover"
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</article>
	)
}

export default Review
