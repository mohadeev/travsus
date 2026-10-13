// TripAdvisor-style tour shelf: swipe on phones, a grid on larger screens.
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import TourCard from './TourCard'
import styles from './home.module.css'

export default function TopTours({ tours }: { tours: HomeTour[] }) {
	const t = useTranslations('Home')
	if (!tours.length) return null

	return (
		<section className={styles.reveal}>
			<div className="mb-8 flex items-end justify-between gap-4">
				<div>
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('top_tours')}</h2>
					<p className="mt-2 text-neutral-500">{t('top_tours_sub')}</p>
				</div>
				<Link
					href={'/search?query=' as any}
					className="group hidden shrink-0 items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold transition hover:border-neutral-950 sm:inline-flex"
				>
					{t('see_all')}
					<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
				</Link>
			</div>

			<ul className={`${styles.noScrollbar} flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 sm:overflow-visible lg:grid-cols-4`}>
				{tours.map((tour) => (
					<li key={tour.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
						<TourCard tour={tour} />
					</li>
				))}
			</ul>
		</section>
	)
}
