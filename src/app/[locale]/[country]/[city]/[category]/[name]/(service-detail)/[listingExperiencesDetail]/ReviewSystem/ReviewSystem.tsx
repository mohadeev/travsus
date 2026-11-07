'use client'
// Reviews of a tour: the rating summary, the list, and the "Write a review"
// dialog (ReviewComposer), which needs the visitor to be signed in.
import type React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PenLine } from 'lucide-react'
import { useAuthAction } from '@/app/hooks/useAuthAction'
import { useTranslations } from '@/lib/i18n'
import Review from './Review'
import RatingBubbles from '@/app/[locale]/(home)/RatingBubbles'
import ReviewComposer from './ReviewComposer'
import { useTourService } from '../../TourServiceContext'

interface ReviewProps {
	serviceId: string
	serviceName: string
}

const ReviewSystem: React.FC<ReviewProps> = ({ serviceId, serviceName }) => {
	const t = useTranslations('experience_reviews')
	const router = useRouter()
	const tour: any = useTourService() || {}
	const [reviews, setReviews] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [writing, setWriting] = useState(false)
	const [visible, setVisible] = useState(5)
	// Filters: a star level (click a bar) and a type of trip (chips)
	const [stars, setStars] = useState(0)
	const [trip, setTrip] = useState('')

	useEffect(() => {
		if (!serviceId) return
		let cancelled = false
		setIsLoading(true)
		fetch(`/api/reviews?serviceId=${serviceId}`)
			.then((r) => (r.ok ? r.json() : { reviews: [] }))
			.then((data) => !cancelled && setReviews(data.reviews || []))
			.catch((error) => console.error('Error fetching reviews:', error))
			.finally(() => !cancelled && setIsLoading(false))
		return () => {
			cancelled = true
		}
	}, [serviceId])

	const openComposer = useAuthAction(async () => setWriting(true))

	const firstImage = Array.isArray(tour.images) ? tour.images.find((i: any) => (typeof i === 'string' ? i : i?.url)) : null
	const tourImage = typeof firstImage === 'string' ? firstImage : firstImage?.url
	const daysCount = Array.isArray(tour.days) ? tour.days.length : 0

	const totalReviews = reviews.length
	const average = totalReviews ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0
	const countOf = (n: number) => reviews.filter((r) => r.rating === n).length
	const tripTypes = TRIP_TYPES.filter((type) => reviews.some((r) => r.travelType === type))
	const shown = reviews.filter((r) => (!stars || r.rating === stars) && (!trip || r.travelType === trip))

	const writeButton = (
		<button
			type="button"
			onClick={() => openComposer(undefined)}
			className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink px-5 py-3 text-base font-bold leading-none text-ink transition hover:bg-neutral-100 sm:w-auto dark:border-white dark:text-white dark:hover:bg-neutral-800"
		>
			<PenLine className="h-4 w-4" />
			{t('Write_Review')}
		</button>
	)

	return (
		<section id="experience_reviews" className="w-full scroll-mt-32">
			{!isLoading && (
				<h2 className="headline mb-4 text-[24px] !leading-tight">{t('Reviews')}</h2>
			)}

			{writing && (
				<ReviewComposer
					serviceId={serviceId}
					tourName={tour.name || serviceName}
					tourImage={tourImage}
					tourSubtitle={daysCount > 1 ? `${daysCount} ${t('Days')}${tour.region ? ` ${t('In')} ${tour.region}` : ''}` : tour.region}
					onClose={() => setWriting(false)}
					onCreated={(review) => {
						if (review) setReviews((prev) => [review, ...prev])
						router.refresh()
					}}
				/>
			)}

			{isLoading ? (
				<div className="space-y-6">
					{[1, 2, 3].map((i) => (
						<div key={i} className="animate-pulse border-b border-neutral-200 pb-6">
							<div className="flex items-start gap-4">
								<div className="h-12 w-12 rounded-full bg-neutral-200" />
								<div className="flex-1">
									<div className="mb-2 h-4 w-32 rounded bg-neutral-200" />
									<div className="h-3 w-48 rounded bg-neutral-200" />
								</div>
							</div>
							<div className="mt-3 space-y-2">
								<div className="h-5 w-64 rounded bg-neutral-200" />
								<div className="h-4 w-full rounded bg-neutral-200" />
								<div className="h-4 w-3/4 rounded bg-neutral-200" />
							</div>
						</div>
					))}
				</div>
			) : totalReviews > 0 ? (
				<div className="grid gap-6 md:grid-cols-[260px_minmax(0,1fr)] md:gap-10">
					{/* Summary, as on TripAdvisor: a grey card with the average, its word and
					    the bubbles, then one green bar per level (click a bar to filter) */}
					<div className="self-start md:sticky md:top-32">
						<div className="rounded-2xl bg-neutral-100 px-6 py-7 text-center dark:bg-neutral-900">
							<p className="text-[44px] font-extrabold leading-none tabular-nums">{average.toFixed(1)}</p>
							<p className="mt-2 text-lg font-bold">{t(`Rating_${Math.min(5, Math.max(1, Math.round(average)))}`)}</p>
							<p className="mt-2 flex items-center justify-center gap-1.5 text-base text-ink-soft dark:text-neutral-300">
								<RatingBubbles rating={average} size={18} tone="green" />
								<span className="tabular-nums">({totalReviews.toLocaleString()})</span>
								<span className="sr-only">{t('Based_On', { count: totalReviews })}</span>
							</p>
						</div>
						<div className="mt-6 grid gap-3">
							{[5, 4, 3, 2, 1].map((n) => {
								const count = countOf(n)
								return (
									<button
										key={n}
										type="button"
										aria-pressed={stars === n}
										onClick={() => setStars(stars === n ? 0 : n)}
										disabled={!count}
										className="grid grid-cols-[80px_minmax(0,1fr)_36px] items-center gap-3 text-left text-base disabled:cursor-default"
									>
										<span className={stars === n ? 'font-bold underline underline-offset-2' : ''}>{t(`Rating_${n}`)}</span>
										<span className="h-3 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
											{count > 0 && (
												<span className="block h-full min-w-3 rounded-full bg-[#00852F]" style={{ width: `${(count / totalReviews) * 100}%` }} />
											)}
										</span>
										<span className="text-right text-sm tabular-nums text-ink-soft dark:text-neutral-400">{count.toLocaleString()}</span>
									</button>
								)
							})}
						</div>
						<div className="mt-6 border-t border-neutral-200 pt-6 dark:border-neutral-800">{writeButton}</div>
					</div>

					{/* Reviews, with chips for the type of trip */}
					<div className="min-w-0">
						{tripTypes.length > 1 && (
							<div className="flex flex-wrap gap-2" role="group" aria-label={t('Who_Go_With')}>
								{['', ...tripTypes].map((type) => (
									<button
										key={type || 'all'}
										type="button"
										aria-pressed={trip === type}
										onClick={() => setTrip(type)}
										className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
											trip === type
												? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink'
												: 'border-neutral-300 text-ink hover:border-ink dark:border-neutral-600 dark:text-white dark:hover:border-white'
										}`}
									>
										{type ? t(type) : t('All')}
									</button>
								))}
							</div>
						)}
						<div className="mt-2 divide-y divide-neutral-200 border-b border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
							{shown.slice(0, visible).map((review) => (
								<Review key={review.id} review={review} />
							))}
						</div>
						{shown.length > visible && (
							<div className="mt-6">
								<button
									type="button"
									onClick={() => setVisible((v) => v + 5)}
									className="w-full rounded-full border border-ink px-5 py-3 text-base font-bold leading-none text-ink transition hover:bg-neutral-100 sm:w-auto dark:border-white dark:text-white dark:hover:bg-neutral-800"
								>
									{t('Load_More_Reviews')}
								</button>
							</div>
						)}
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center rounded-2xl bg-neutral-100 px-6 py-12 text-center dark:bg-neutral-900">
					<div className="mb-4">
						<RatingBubbles rating={0} size={18} tone="green" />
					</div>
					<h3 className="mb-1 text-lg font-bold">{t('No_Reviews_Yet')}</h3>
					<p className="mb-5 text-neutral-500">{t('First_Share')}</p>
					{writeButton}
				</div>
			)}
		</section>
	)
}

const TRIP_TYPES = ['Couples', 'Family', 'Friends', 'Solo', 'Business']

export default ReviewSystem
