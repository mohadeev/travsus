// TripAdvisor-style destination shelf: square photos in one row that scrolls
// sideways (4 in view on large screens), "City, Country" in big white letters.
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { HomeDestination } from '@/lib/homeData'
import Shelf from './Shelf'
import styles from './home.module.css'

export default function TopDestinations({ destinations }: { destinations: HomeDestination[] }) {
	const t = useTranslations('Home')
	if (!destinations.length) return null

	return (
		<section className={styles.reveal}>
			<h2 className="headline text-[34px] sm:text-6xl">{t('destinations_title')}</h2>
			<p className="mt-1 text-sm text-neutral-500 sm:mt-2 sm:text-base">{t('destinations_sub')}</p>

			<Shelf label={t('destinations_title')} className={`${styles.noScrollbar} ${styles.stagger} -mx-5 mt-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:mt-8 sm:scroll-px-0 sm:gap-5 sm:px-0`}>
				{destinations.slice(0, 12).map((d) => (
					<li key={d.city} className="w-[72%] max-w-[300px] shrink-0 snap-start sm:w-[calc((100%-20px)/2)] sm:max-w-none lg:w-[calc((100%-60px)/4)]">
						<Link
							href={`/search?query=${encodeURIComponent(d.city)}` as any}
							style={{ aspectRatio: '1 / 1' }}
							className="group relative block overflow-hidden rounded-xl bg-neutral-200 transition active:scale-[0.98]"
						>
							<Image src={d.image} alt={d.city} fill sizes="(max-width: 640px) 72vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105" />
							<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />
							<div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
								<h3 className="text-2xl font-bold leading-tight tracking-tight [text-shadow:0_1px_12px_rgb(0_0_0/0.35)] sm:text-[26px]">
									{d.country ? `${d.city}, ${d.country}` : d.city}
								</h3>
								<p className="mt-1 text-sm text-white/80">{t('tours_count', { count: d.toursCount })}</p>
							</div>
						</Link>
					</li>
				))}
			</Shelf>
		</section>
	)
}
