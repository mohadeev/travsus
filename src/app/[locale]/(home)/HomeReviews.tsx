// Real reviews as a clean masonry wall of cards.
import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import type { HomeReview } from '@/lib/homeData'
import RatingBubbles from './RatingBubbles'
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
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('reviews_title')}</h2>
			<p className="mt-2 text-neutral-500">{t('reviews_sub')}</p>

			<div className="mt-8 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
				{reviews.map((review) => (
					<article
						key={review.id}
						className="mb-4 break-inside-avoid rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-400 dark:border-neutral-800 dark:bg-neutral-950"
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
						<p className="mt-2 line-clamp-6 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
							{review.content}
						</p>

						{review.tour && (
							<Link
								href={review.tour.href as any}
								className="mt-4 block truncate border-t border-neutral-100 pt-4 text-sm font-medium text-neutral-500 hover:text-neutral-950 dark:border-neutral-800"
							>
								{t('see_tour')}: {review.tour.name}
							</Link>
						)}
					</article>
				))}
			</div>
		</section>
	)
}
