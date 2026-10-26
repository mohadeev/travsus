'use client'
// "Recently viewed": the tours this visitor opened, read from their browser.
// Hidden until they have opened at least one tour.
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { HomeTour } from '@/lib/homeData'
import { RECENT_TOURS_EVENT, clearRecentTours, readRecentTours } from '@/lib/recentTours'
import Shelf from './Shelf'
import TourCard from './TourCard'
import styles from './home.module.css'

export type RecentCard = Omit<HomeTour, 'searchText'>

export default function RecentlyViewed({ tours }: { tours: RecentCard[] }) {
	const t = useTranslations('Home')
	const [ids, setIds] = useState<string[]>([])

	useEffect(() => {
		const update = () => setIds(readRecentTours())
		update()
		// Another tab, or the Clear button, changed the list
		window.addEventListener('storage', update)
		window.addEventListener(RECENT_TOURS_EVENT, update)
		return () => {
			window.removeEventListener('storage', update)
			window.removeEventListener(RECENT_TOURS_EVENT, update)
		}
	}, [])

	const byId = new Map(tours.map((tour) => [tour.id, tour]))
	const recent = ids.map((id) => byId.get(id)).filter((tour): tour is RecentCard => !!tour).slice(0, 8)
	if (!recent.length) return null

	return (
		<section>
			<div className="mb-5 flex items-end justify-between gap-4 sm:mb-8">
				<div>
					<h2 className="text-2xl font-bold tracking-tight sm:text-4xl">{t('recently_viewed')}</h2>
					<p className="mt-1 text-sm text-neutral-500 sm:mt-2 sm:text-base">{t('recently_viewed_sub')}</p>
				</div>
				<button
					type="button"
					onClick={clearRecentTours}
					className="shrink-0 text-sm font-semibold text-neutral-500 underline underline-offset-4 transition hover:text-neutral-950 dark:hover:text-white"
				>
					{t('recently_viewed_clear')}
				</button>
			</div>

			<Shelf label={t('recently_viewed')} className={`${styles.noScrollbar} -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:scroll-px-0 sm:gap-5 sm:px-0`}>
				{recent.map((tour) => (
					<li key={tour.id} className="w-[58%] max-w-[240px] shrink-0 snap-start sm:w-[calc((100%-20px)/2)] sm:max-w-none lg:w-[calc((100%-60px)/4)]">
						<TourCard tour={tour as HomeTour} />
					</li>
				))}
			</Shelf>
		</section>
	)
}
