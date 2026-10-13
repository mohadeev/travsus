// TripAdvisor-style destination grid: one large photo, smaller ones beside it.
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { HomeDestination } from '@/lib/homeData'
import styles from './home.module.css'

export default function TopDestinations({ destinations }: { destinations: HomeDestination[] }) {
	const t = useTranslations('Home')
	if (!destinations.length) return null

	return (
		<section className={styles.reveal}>
			<h2 className="text-2xl font-bold tracking-tight sm:text-4xl">{t('destinations_title')}</h2>
			<p className="mt-1 text-sm text-neutral-500 sm:mt-2 sm:text-base">{t('destinations_sub')}</p>

			<div className="mt-5 grid auto-rows-[150px] grid-cols-2 gap-2.5 sm:mt-8 sm:auto-rows-[240px] sm:gap-3 lg:grid-cols-4">
				{destinations.slice(0, 5).map((d, i) => (
					<Link
						key={d.city}
						href={`/search?query=${encodeURIComponent(d.city)}` as any}
						className={`group relative overflow-hidden rounded-2xl bg-neutral-200 active:scale-[0.98] transition ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
					>
						<Image
							src={d.image}
							alt={d.city}
							fill
							sizes={i === 0 ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
							className="object-cover transition duration-700 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
						<div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-3.5 text-white sm:p-5">
							<div>
								<h3 className={`font-bold tracking-tight ${i === 0 ? 'text-2xl sm:text-4xl' : 'text-lg sm:text-xl'}`}>{d.city}</h3>
								<p className="text-xs text-white/80 sm:text-sm">
									{d.country}
									{/* Phones: the count sits here, there is no room for the badge */}
									<span className="sm:hidden"> · {t('tours_count', { count: d.toursCount })}</span>
								</p>
							</div>
							<span className="hidden shrink-0 rounded-full bg-white px-3 py-1 sm:inline-block text-xs font-semibold text-neutral-950">
								{t('tours_count', { count: d.toursCount })}
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	)
}
