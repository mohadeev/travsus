// TripAdvisor-style tour shelf: title and subtitle, "See all" on the right, and
// one row of tour cards that scrolls sideways (4 in view on large screens,
// arrows on the sides). Used for every row of tours on the home page.
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import Shelf from './Shelf'
import TourCard from './TourCard'
import styles from './home.module.css'

type Props = {
	tours: HomeTour[]
	title?: string
	subtitle?: string
	/** "See all" link: a search */
	href?: string
}

export default function TopTours({ tours, title, subtitle, href = '/search?query=' }: Props) {
	const t = useTranslations('Home')
	if (!tours.length) return null
	const heading = title ?? t('top_tours')

	return (
		<section>
			<div className="mb-4 flex items-end justify-between gap-4 sm:mb-6">
				<div className="min-w-0">
					<h2 className="headline text-[22px] sm:text-[28px]">{heading}</h2>
					<p className="mt-1 text-sm text-neutral-600 sm:text-base dark:text-neutral-400">{subtitle ?? t('top_tours_sub')}</p>
				</div>
				<Link
					href={href as any}
					className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline sm:text-[15px]"
				>
					{t('see_all')}
					<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
				</Link>
			</div>

			<Shelf label={heading} className={`${styles.noScrollbar} -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-5 pt-1 sm:mx-0 sm:scroll-px-0 sm:gap-5 sm:px-0`}>
				{tours.map((tour) => (
					<li key={tour.id} className="w-[72%] max-w-[290px] shrink-0 snap-start sm:w-[calc((100%-20px)/2)] sm:max-w-none lg:w-[calc((100%-60px)/4)]">
						<TourCard tour={tour} />
					</li>
				))}
			</Shelf>
		</section>
	)
}
