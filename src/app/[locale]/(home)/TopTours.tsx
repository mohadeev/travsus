// TripAdvisor-style tour shelf: one row that scrolls sideways (4 cards in view
// on large screens).
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import Shelf from './Shelf'
import TourCard from './TourCard'
import styles from './home.module.css'

export default function TopTours({ tours }: { tours: HomeTour[] }) {
	const t = useTranslations('Home')
	if (!tours.length) return null

	return (
		<section className={styles.reveal}>
			<div className="mb-5 flex items-end justify-between gap-4 sm:mb-8">
				<div>
					<h2 className="headline text-[34px] sm:text-6xl">{t('top_tours')}</h2>
					<p className="mt-1 text-sm text-neutral-500 sm:mt-2 sm:text-base">{t('top_tours_sub')}</p>
				</div>
				<Link
					href={'/search?query=' as any}
					className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold underline underline-offset-4 transition sm:gap-1.5 sm:rounded-full sm:border sm:border-neutral-300 sm:px-4 sm:py-2 sm:no-underline sm:hover:border-neutral-950"
				>
					{t('see_all')}
					<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
				</Link>
			</div>

			<Shelf label={t('top_tours')} className={`${styles.noScrollbar} ${styles.stagger} -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:scroll-px-0 sm:gap-5 sm:px-0`}>
				{tours.map((tour) => (
					<li key={tour.id} className="w-[58%] max-w-[240px] shrink-0 snap-start sm:w-[calc((100%-20px)/2)] sm:max-w-none lg:w-[calc((100%-60px)/4)]">
						<TourCard tour={tour} />
					</li>
				))}
			</Shelf>
		</section>
	)
}
