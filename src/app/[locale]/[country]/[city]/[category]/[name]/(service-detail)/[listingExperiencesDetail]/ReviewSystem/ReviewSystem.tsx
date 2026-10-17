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

	const writeButton = (
		<button
			type="button"
			onClick={() => openComposer(undefined)}
			className="group inline-flex items-center gap-2 rounded-full bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 dark:bg-white dark:text-neutral-950"
		>
			<PenLine className="h-4 w-4 transition duration-300 group-hover:-rotate-12" />
			{t('Write_Review')}
		</button>
	)

	return (
		<section id="experience_reviews" className="w-full scroll-mt-32">
			{!isLoading && (
				<div className="mb-4 flex items-center justify-between gap-3">
					<h2 className="text-2xl font-bold tracking-tight">
						{t('Reviews')} <span className="text-neutral-400">({totalReviews})</span>
					</h2>
					{totalReviews > 0 && writeButton}
				</div>
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
				<div className="flex flex-col gap-8 md:flex-row">
					{/* Rating summary */}
					<div className="flex w-full flex-col gap-6 self-start rounded-2xl bg-sand-100 p-6 md:sticky md:top-32 md:w-1/3 dark:bg-neutral-900">
						<div>
							<div className="mb-2 flex items-baseline gap-2">
								<span className="text-5xl font-bold tracking-tight">{average.toFixed(1)}</span>
								<span className="text-lg text-neutral-500">/ 5</span>
							</div>
							<div className="mb-2 flex gap-1">
								{[1, 2, 3, 4, 5].map((n) => (
									<span
										key={n}
										className={`h-4 w-4 rounded-full border-2 ${n <= Math.round(average) ? 'border-[#00AA6C] bg-[#00AA6C]' : 'border-neutral-300'}`}
									/>
								))}
							</div>
							<p className="text-sm text-neutral-500">{t('Based_On', { count: totalReviews })}</p>
						</div>
						<div className="space-y-2">
							{[5, 4, 3, 2, 1].map((n) => (
								<div key={n} className="flex items-center gap-3 text-sm">
									<span className="w-24 shrink-0 text-neutral-600 dark:text-neutral-400">{t(`Rating_${n}`)}</span>
									<div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
										<div className="h-full rounded-full bg-[#00AA6C] transition-all duration-300" style={{ width: `${(countOf(n) / totalReviews) * 100}%` }} />
									</div>
									<span className="w-6 text-right text-neutral-500">{countOf(n)}</span>
								</div>
							))}
						</div>
					</div>

					{/* Reviews */}
					<div className="w-full md:w-2/3">
						<div className="divide-y divide-neutral-200 dark:divide-neutral-800">
							{reviews.slice(0, visible).map((review) => (
								<Review key={review.id} review={review} />
							))}
						</div>
						{totalReviews > visible && (
							<div className="mt-6 text-center">
								<button
									type="button"
									onClick={() => setVisible((v) => v + 5)}
									className="rounded-full border-2 border-neutral-200 px-6 py-2.5 font-semibold transition hover:border-neutral-400 dark:border-neutral-700"
								>
									{t('Load_More_Reviews')}
								</button>
							</div>
						)}
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-neutral-200 px-6 py-12 text-center dark:border-neutral-800">
					<div className="mb-4 flex gap-1.5">
						{[1, 2, 3, 4, 5].map((n) => (
							<span key={n} className="h-5 w-5 rounded-full border-2 border-[#00AA6C]" />
						))}
					</div>
					<h3 className="mb-1 text-lg font-bold">{t('No_Reviews_Yet')}</h3>
					<p className="mb-5 text-neutral-500">{t('First_Share')}</p>
					{writeButton}
				</div>
			)}
		</section>
	)
}

export default ReviewSystem
