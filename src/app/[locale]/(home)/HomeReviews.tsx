// Real reviews in one row that scrolls sideways (3 cards in view on large screens).
import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { HomeReview } from '@/lib/homeData'
import RatingBubbles from './RatingBubbles'
import Shelf from './Shelf'
import styles from './home.module.css'

export default function HomeReviews({ reviews }: { reviews: HomeReview[] }) {
	const t = useTranslations('Home')
	const locale = useLocale()
	if (!reviews.length) return null

	const formatDate = (date: string | null) =>
		date
			? new Intl.DateTimeFormat(locale, { month: 'short', year: 'numeric' }).format(new Date(date))
			: null

	return (
		<section className={styles.reveal}>
			<h2 className="headline text-[34px] sm:text-6xl">{t('reviews_title')}</h2>
			<p className="mt-1 text-sm text-neutral-500 sm:mt-2 sm:text-base">{t('reviews_sub')}</p>

			<div className="mt-5 sm:mt-8">
				<Shelf
					as="div"
					label={t('reviews_title')}
					className={`${styles.noScrollbar} ${styles.stagger} -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:scroll-px-0 sm:gap-4 sm:px-0`}
				>
					{reviews.map((review) => (
						<article
							key={review.id}
							className="flex w-[85%] max-w-[340px] shrink-0 snap-start flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition sm:w-[calc((100%-16px)/2)] sm:max-w-none sm:p-6 lg:w-[calc((100%-32px)/3)] hover:-translate-y-1 hover:border-neutral-950 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-white"
						>
							<header className="flex items-center gap-3">
								<span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neutral-950 text-sm font-bold text-white dark:bg-white dark:text-neutral-950">
									{review.author.charAt(0)}
								</span>
								<div className="min-w-0">
									<p className="truncate font-semibold">{review.author}</p>
									<p className="truncate text-xs text-neutral-500">
										{[review.travelType, formatDate(review.date)].filter(Boolean).join(' · ')}
									</p>
								</div>
							</header>

							<div className="mt-4 flex items-center gap-2">
								<RatingBubbles rating={review.rating} />
								{review.verified && (
									<span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-600">
										<BadgeCheck className="h-3.5 w-3.5" />
										{t('verified')}
									</span>
								)}
							</div>

							{review.title && <h3 className="mt-3 font-bold leading-snug">{review.title}</h3>}
							<p className="mb-4 mt-2 line-clamp-5 text-[15px] sm:line-clamp-6 leading-relaxed text-neutral-700 dark:text-neutral-300">
								{review.content}
							</p>

							{review.tour && (
								<Link
									href={review.tour.href as any}
									className="mt-auto block truncate border-t border-neutral-100 pt-4 text-sm font-medium text-neutral-500 hover:text-neutral-950 dark:border-neutral-800"
								>
									{t('see_tour')}: {review.tour.name}
								</Link>
							)}
						</article>
					))}
				</Shelf>
			</div>
		</section>
	)
}
