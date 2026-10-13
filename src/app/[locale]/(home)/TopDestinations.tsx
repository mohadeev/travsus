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
			<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('destinations_title')}</h2>
			<p className="mt-2 text-neutral-500">{t('destinations_sub')}</p>

			<div className="mt-8 grid auto-rows-[200px] grid-cols-2 gap-3 sm:auto-rows-[240px] lg:grid-cols-4">
				{destinations.slice(0, 5).map((d, i) => (
					<Link
						key={d.city}
						href={`/search?query=${encodeURIComponent(d.city)}` as any}
						className={`group relative overflow-hidden rounded-2xl bg-neutral-200 ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
					>
						<Image
							src={d.image}
							alt={d.city}
							fill
							sizes={i === 0 ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
							className="object-cover transition duration-700 group-hover:scale-105"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
						<div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-4 text-white sm:p-5">
							<div>
								<h3 className={`font-bold tracking-tight ${i === 0 ? 'text-3xl sm:text-4xl' : 'text-xl'}`}>{d.city}</h3>
								<p className="text-sm text-white/80">{d.country}</p>
							</div>
							<span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-950">
								{t('tours_count', { count: d.toursCount })}
							</span>
						</div>
					</Link>
				))}
			</div>
		</section>
	)
}
